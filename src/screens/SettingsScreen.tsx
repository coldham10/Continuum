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
          renderItem={({item, index}) => (
            <BackgroundCard
              source={item}
              onSelect={props.chooseBackground.bind(this, props.premium, index)}
            />
          )}
          style={styles.cardList}
        />
      </View>
    </View>
  );
}

function BackgroundCard(props) {
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={() => props.onSelect()}>
        <Image style={styles.cardImage} source={props.source} />
      </TouchableOpacity>
    </View>
  );
}

const mapStateToProps = (state, ownProps) => ({
  premium: state.settings.premium,
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
  cardOverlay: {},
  cardImage: {resizeMode: 'contain', width: 120, height: 240},
});
