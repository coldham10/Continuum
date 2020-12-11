import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import {imageList} from '../utils/Constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

function SettingsScreen(props) {
  return (
    <View style={styles.container}>
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
            {props.premium ? (
              <Button
                title="Set Free"
                onPress={() => props.setPremium(false)}
              />
            ) : (
              <Button
                title="Buy Premium"
                onPress={() => {
                  props.setPremium(true);
                }}
              />
            )}
          </View>
        </View>
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
    </View>
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

const mapStateToProps = (state, ownProps) => ({
  premium: state.settings.premium,
  backgroundSelected: state.settings.background,
});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setPremium: (isFree) => {
    dispatch({
      type: isFree ? 'settings/setPremium' : 'settings/setFree',
    });
  },
  chooseBackground: (premium, index) => {
    if (premium) {
      dispatch({type: 'settings/setBackground', payload: index});
    } else {
      ownProps.navigation.navigate('PositiveScreen');
    }
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    padding: 5,
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
