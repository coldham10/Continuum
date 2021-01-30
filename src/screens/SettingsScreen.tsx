import React, {useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Button,
  Switch,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import RNIap from 'react-native-iap';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {imageList, premiumSKU} from '../utils/Constants';
import BuyPremiumButton from '../components/settings/BuyPremiumButton';
import ExportDataButton from '../components/settings/ExportDataButton';

function SettingsScreen(props) {
  const [showDTP, setShowDTP] = useState(false);
  return (
    <ScrollView style={styles.outer} contentContainerstyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Account</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {props.premium ? 'Premium' : 'Free'} account
            </Text>
          </View>
          <View style={{flex: 1}}>
            <BuyPremiumButton />
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Reminder</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.text}>Daily reminder</Text>
          </View>
          <View style={{flex: 1}}>
            <Switch
              value={props.reminder}
              onValueChange={(val) => props.setReminder(val)}
            />
          </View>
        </View>
        {props.reminder ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{flex: 1}}>
              <Text style={styles.text}>Reminder time</Text>
            </View>
            <View
              style={{
                flex: 1,
                padding: 1,
                marginRight: 8,
                alignItems: 'flex-end',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#ddd',
                  borderRadius: 5,
                  padding: 5,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => setShowDTP(!showDTP)}>
                <Text style={{fontSize: 18, color: '#222', marginRight: 15}}>
                  {formatAMPM(props.reminderHour, props.reminderMinute)}{' '}
                </Text>
                <Ionicons name="md-arrow-dropdown" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Background</Text>
        <Text style={styles.text}>Choose a background</Text>
        <FlatList
          horizontal
          data={imageList}
          keyExtractor={(item) => item.key.toString()}
          renderItem={({item, index}) => {
            let type;
            if (item.key === props.backgroundSelected) {
              type = 'SELECTED';
            } else if (props.premium) {
              type = 'UNSELECTED';
            } else {
              type = 'UNAVAILABLE';
            }
            return (
              <BackgroundCard
                source={item.image}
                type={type}
                onSelect={props.chooseBackground.bind(
                  this,
                  props.premium,
                  index,
                )}
                navigation={props.navigation}
              />
            );
          }}
          style={styles.cardList}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Export Data</Text>
        <Text style={styles.text}>Export habit data to spreadsheet</Text>
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ExportDataButton navigation={props.navigation} />
        </View>
      </View>
      {showDTP ? (
        <DateTimePicker
          mode="time"
          value={new Date(2000, 2, 2, props.reminderHour, props.reminderMinute)}
          onChange={(e, val) => {
            setShowDTP(false);
            if (
              e.type === 'set' &&
              Object.prototype.toString.call(val) === '[object Date]' &&
              !isNaN(val.getTime())
            ) {
              props.setReminderTime(val.getHours(), val.getMinutes());
            }
          }}
        />
      ) : null}
    </ScrollView>
  );
}

function BackgroundCard(props) {
  return (
    <View style={styles.cardContainer}>
      <Overlay
        type={props.type}
        navigation={props.navigation}
        onSelect={props.onSelect}
      />
      <Image style={styles.cardImage} source={props.source} />
    </View>
  );
}

function Overlay(props) {
  if (props.type === 'UNAVAILABLE') {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('GetPremium', {
            reason: 'Changing the background',
          })
        }
        style={{
          ...styles.cardOverlay,
          backgroundColor: '#5558',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Ionicons name="md-lock" size={50} />
      </TouchableOpacity>
    );
  } else if (props.type === 'SELECTED') {
    return (
      <TouchableOpacity style={{...styles.cardOverlay, alignItems: 'flex-end'}}>
        <View
          style={{
            backgroundColor: '#eee8',
            aspectRatio: 1,
            padding: 1,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="ios-checkmark" size={30} />
        </View>
      </TouchableOpacity>
    );
  } else {
    return (
      <TouchableOpacity
        style={styles.cardOverlay}
        onPress={() => props.onSelect()}
      />
    );
  }
}

function formatAMPM(hour, minute) {
  let ampm = 'AM';
  let hr_fmt = hour;
  let min_fmt = minute;
  if (hour >= 12) {
    ampm = 'PM';
    hr_fmt = hour % 12;
  }
  if (hr_fmt === 0) {
    hr_fmt = 12;
  }
  if (String(minute).length < 2) {
    min_fmt = '0' + String(minute);
  }
  return hr_fmt + ':' + min_fmt + ' ' + ampm;
}

const mapStateToProps = (state, ownProps) => ({
  premium: state.settings.premium,
  reminder: state.settings.reminder,
  reminderHour: state.settings.reminderHour,
  reminderMinute: state.settings.reminderMinute,
  backgroundSelected: state.settings.background,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  chooseBackground: (premium, index) => {
    if (premium) {
      dispatch({type: 'settings/setBackground', payload: index});
    } else {
      ownProps.navigation.navigate('PositiveScreen');
    }
  },
  setReminder: (on) => {
    if (on) {
      dispatch({type: 'settings/setReminder'});
    } else {
      dispatch({type: 'settings/unsetReminder'});
    }
  },
  setReminderTime: (hours, minutes) => {
    dispatch({
      type: 'settings/setReminderTime',
      payload: {hour: hours, minute: minutes},
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
  outer: {
    padding: 5,
    flex: 1,
  },
  container: {
    alignItems: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#444',
  },
  sectionHeader: {
    fontSize: 24,
    color: '#444',
    marginLeft: 10,
    marginBottom: 10,
  },
  text: {fontSize: 18, color: '#222', marginLeft: 15},
  cardList: {flexGrow: 0},
  cardContainer: {margin: 10},
  cardOverlay: {
    width: 120,
    height: 180,
    position: 'absolute',
    zIndex: 1,
    padding: 10,
  },
  cardImage: {resizeMode: 'contain', width: 120, height: 180},
});
