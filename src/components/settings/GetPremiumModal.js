import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native'; //TODO TouchableOpacity
import BuyPremiumButton from './BuyPremiumButton';

//TODO pretty pictures

function GetPremiumModal(props) {
  return (
    <View style={styles.container}>
      <View style={styles.paragraph}>
        <Text style={styles.text}>
          {props.route.params.reason} requires the premium version of the app.
        </Text>
      </View>
      <View style={styles.paragraph}>
        <Text style={styles.text}>
          With premium you can add as many habits as you like; change the
          background; and download your data to analyze in a spreadsheet.
        </Text>
      </View>
      <View style={styles.paragraph}>
        <Text style={styles.text}>
          It also supports the independent developer 😊
        </Text>
      </View>
      <View syle={styles.paragraph}>
        <BuyPremiumButton />
      </View>
    </View>
  );
}

export default GetPremiumModal;

const styles = StyleSheet.create({
  container: {height: '100%', width: '100%', padding: 15},
  paragraph: {margin: 5, marginBottom: 15},
  text: {fontSize: 16},
});
