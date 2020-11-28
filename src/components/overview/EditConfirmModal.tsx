/*Small modal opened from DayModal that confirms the toggling of historical
 *habit activity */

import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import * as Haptics from '../../utils/Haptics';

function EditConfirmModal(props) {
  return (
    <Modal
      isVisible={props.visible}
      onBackButtonPress={() => props.close()}
      backdropOpacity={0.5}
      hasBackdrop={true}
      swipeDirection="down"
      swipeThreshold={80}
      onSwipeComplete={() => props.close()}
      onBackdropPress={() => props.close()}
      useNativeDriver={true}
      animationInTiming={500}
      animationOutTiming={500}
      scrollOffset={100}
      style={{flex: 1}}>
      <View style={styles.spacer} />
      <View style={styles.container}>
        <View style={styles.oval} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Edit History</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.buttonContainer}>
              <Button
                style={styles.btn}
                title="Cancel"
                onPress={() => {
                  props.close();
                }}
              />
              <Button
                style={styles.btn}
                title="Confirm"
                onPress={() => {
                  props.toggle();
                  Haptics.impactAsync();
                  props.close();
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.spacer} />
    </Modal>
  );
}

const mapDispatchToProps = (dispatch, ownProps) => {
  try {
    let prefix = ownProps.data.positive ? 'positive/' : 'negative/';
    let dateToChange = new Date(
      ownProps.data.dateString.split('-')[0],
      ownProps.data.dateString.split('-')[1] - 1,
      ownProps.data.dateString.split('-')[2],
    );
    return {
      toggle: () =>
        dispatch({
          type: prefix + 'toggle',
          payload: {date: dateToChange.getTime(), id: ownProps.data.id},
        }),
    };
  } catch (e) {
    return {toggle: () => {}};
  }
};

export default connect(null, mapDispatchToProps)(EditConfirmModal);

const styles = StyleSheet.create({
  spacer: {
    flex: 3,
    opacity: 0,
  },
  container: {
    flex: 3,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  oval: {
    width: 15,
    height: 4,
    backgroundColor: '#aaa8',
    margin: 4,
    borderRadius: 3,
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 3,
  },
  buttonContainer: {
    flex: 1,
    minWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  btn: {
    flex: 1,
    padding: 10,
  },
});
