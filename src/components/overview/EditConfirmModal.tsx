import React from 'react';
import {StyleSheet, Button, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import * as Haptics from '../../utils/Haptics';

export default function EditConfirmModal(props) {
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
                  toggle(props.data);
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

function toggle(data) {
  if (data === null) {
    return;
  }
  let listName = data.positive ? positiveListName : negativeListName;
  let dateToChange = new Date(
    data.dateString.split('-')[0],
    data.dateString.split('-')[1] - 1,
    data.dateString.split('-')[2],
  );
  AsyncStorage.getItem(listName)
    .then((jsonData) => {
      let listData = JSON.parse(jsonData);
      let modifiedData = listData.map((habit) => {
        if (habit.id === data.id) {
          //Found habit to change, all others remain the same.
          let indexToChange = Math.round(
            (dateToChange - new Date(habit.timeStamp)) / (1000 * 60 * 60 * 24),
          );
          habit.activity = habit.activity.map((val, idx) => {
            if (idx === indexToChange) {
              val = 1 - val; //Flip the bit
            }
            return val; //Create new activity values with toggled day
          });
        }
        return habit; //Create new habit list with one modified habit
      });
      //TODO RECALCULATE staus
      return JSON.stringify(modifiedData);
    })
    .then((jsonData) => {
      AsyncStorage.setItem(listName, jsonData);
    });
}

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
