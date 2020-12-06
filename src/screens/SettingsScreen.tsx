import * as React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {connect} from 'react-redux';

function SettingsScreen(props) {
  return (
    <View style={styles.container}>
      <Text>{props.premium ? 'Premium' : 'Free'}</Text>
      {props.premium ? (
        <Button title="Set Free" onPress={() => props.setPremium(false)} />
      ) : (
        <Button
          title="Set Premium"
          onPress={() => {
            props.setPremium(true);
          }}
        />
      )}
    </View>
  );
}

const mapStateToProps = (state, ownProps) => ({premium: state.meta.premium});
const mapDispatchToProps = (dispatch, ownProps) => ({
  setPremium: (state) => {
    dispatch({
      type: state ? 'meta/setPremium' : 'meta/setFree',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
