import * as React from 'react';
import {StyleSheet, TouchableOpacity, AppState, Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import * as Haptics from '../../utils/Haptics';

function Habit(props) {
  return (
    <TouchableOpacity
      style={{...statusColors(props.status), ...styles.habitHL}}
      activeOpacity={0.9}
      onPress={() => props.toggleTodayActivity()}>
      <View style={{...statusColors(props.status), ...styles.habit}}>
        <View style={{...statusColors(props.status), ...styles.topRow}}>
          {props.activity[props.activity.length - 1] ? (
            <Ionicons
              name={
                props.positive
                  ? 'md-checkmark-circle-outline'
                  : 'md-close-circle-outline'
              }
              style={{
                ...statusColors(props.status),
                ...styles.checkbox,
              }}
              onPress={() => props.toggleTodayActivity()}
            />
          ) : (
            <Icon
              name="circle-thin"
              style={{
                ...statusColors(props.status),
                ...styles.checkbox,
                fontSize: 28,
              }}
              onPress={() => props.toggleTodayActivity()}
            />
          )}
          <View style={styles.highlight}>
            <Text style={{...statusColors(props.status), ...styles.title}}>
              {props.title}
            </Text>
          </View>
          <Ionicons
            name="md-create"
            style={{...statusColors(props.status), ...styles.icon}}
            onPress={() => {
              props.openEditor();
              Haptics.impactAsync();
            }}
          />
          <Ionicons
            name="ios-trash"
            style={{...statusColors(props.status), ...styles.icon}}
            onPress={() => {
              props.deleteItem();
              Haptics.warnAsync();
            }}
          />
        </View>

        <View
          style={{
            ...statusColors(props.status),
            ...styles.bottomRow,
          }}>
          <Text
            style={{
              ...statusColors(props.status),
              ...styles.subText,
            }}>
            {'Momentum: ' + Math.max(0, Math.round(100 * props.status)) + '%'}
          </Text>
          <Text
            style={{
              ...statusColors(props.status),
              ...styles.subText,
            }}>
            {'Streak: ' + props.getStreak() + ' days'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function statusColors(status) {
  //status is based on the habit function, with a maximum value of 1, minimum value of 0
  //status = 0.1* max(1, (currentValue /threhold)) + 0.9 * min(0, (currentValue - threshold)/(maxValue - threshold))
  //A status below 0.1 status therefore indicates slipping below the threshold
  if (status > 0.1) {
    let tstat = (status - 0.1) / 0.9; //status above the threshold
    return {
      backgroundColor:
        'rgb(' +
        Math.max(0, Math.round(255 * (1 - 2 * tstat))) +
        ',' +
        Math.round(55 + (1 - tstat) * 200) +
        ',' +
        Math.round(200 + 55 * (1 - tstat)) +
        ')',
      color:
        'rgb(' +
        Math.round(200 * (1 - tstat) + (tstat < 0.6 ? -70 : 160)) +
        ',' +
        Math.round(200 * (1 - tstat) + (tstat < 0.6 ? -70 : 160)) +
        ',' +
        Math.round(200 * (1 - tstat) + (tstat < 0.6 ? -70 : 160)) +
        ')',
    };
  } else {
    return {backgroundColor: '#eee', color: '#000'};
  }
}

const styles = StyleSheet.create({
  habitHL: {
    minHeight: 80,
    width: '90%',
    margin: 10,
    borderRadius: 5,
  },
  habit: {
    flex: 1,
    width: '100%',
    padding: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#0000',
  },
  topRow: {
    width: '100%',
    padding: 3,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 2,
    flexDirection: 'row',
  },
  bottomHL: {
    flex: 1,
    width: '100%',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    width: '100%',
    padding: 3,
  },
  highlight: {
    flex: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
  },
  icon: {
    fontSize: 30,
    flex: 1,
    padding: 5,
    paddingLeft: 10,
  },
  checkbox: {
    fontSize: 30,
    flex: 1,
    margin: 5,
    paddingRight: 3,
  },
});

const mapStateToProps = null;

const mapDispatchToProps = (dispatch, ownProps) => {
  let prefix = ownProps.positive ? 'positive/' : 'negative/';
  return {
    toggleTodayActivity: () =>
      dispatch({
        type: prefix + 'toggle',
        payload: {id: ownProps.id, date: Date.now()},
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Habit);
