import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native'; //TODO TouchableOpacity
import {connect} from 'react-redux';

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
        {props.premium ? (
          <Button title="Set Free" onPress={() => props.setPremium(false)} />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(GetPremiumModal);

const styles = StyleSheet.create({
  container: {height: '100%', width: '100%', padding: 15},
  paragraph: {margin: 5, marginBottom: 15},
  text: {fontSize: 16},
});
