import * as React from 'react';
import {StyleSheet, TouchableHighlight, Text, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as Haptics from '../utils/Haptics';
import {positiveListName, negativeListName} from '../utils/Constants';

import OverviewCalendar from '../components/OverviewCalendar';
import OverviewModal from '../components/OverviewModal';

export default class OverviewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positiveData: [],
      negativeData: [],
      modalVisible: false,
      dataByDate: {},
    };
  }

  componentDidMount() {
    //Load saved data for this list from local storage
    const loadData = () => {
      Promise.all([
        AsyncStorage.getItem(positiveListName).then((jsonValue) => {
          return jsonValue !== null ? JSON.parse(jsonValue) : [];
        }),
        AsyncStorage.getItem(negativeListName).then((jsonValue) => {
          return jsonValue !== null ? JSON.parse(jsonValue) : [];
        }),
      ]).then((bothData) => {
        this.setState(
          {positiveData: bothData[0], negativeData: bothData[1]},
          () => this.byDate(),
        );
      });
    };
    loadData();
    //When this tab is focused, reload the data
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      Haptics.impactAsync();
      loadData();
      this.setState({modalVisible: false});
    });
    //Add help icon to top navigation pane
    this.props.navigation.setOptions({
      headerRight: () => (
        <View style={{backgroundColor: '#0000'}}>
          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#aaa8"
            style={{borderRadius: 10}}
            onPress={() => {
              this.props.navigation.navigate('OverviewHelp');
              Haptics.impactAsync();
            }}>
            <Icon
              style={{margin: 5}}
              name="question-circle-o"
              size={24}
              color="black"
            />
          </TouchableHighlight>
        </View>
      ),
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.calendar}>
          <OverviewCalendar
            minDate={this.getMinDate()}
            maxDate={this.getMaxDate()}
            dataByDate={this.state.dataByDate}
            selectDay={(day) =>
              this.props.navigation.navigate('DayModal', {day: day})
            }
          />
        </View>
        <View style={styles.footer}>
          <View style={styles.status}>
            <View style={styles.statusLine}>
              <Ionicons
                name="md-checkmark-circle-outline"
                style={{fontSize: 15}}
              />
              <Text style={styles.statusTxt}>
                {this.state.positiveData.every((item) => item.selected) &&
                this.state.positiveData.length > 0
                  ? 'All '
                  : ''}
                {this.state.positiveData.reduce(
                  (acc, item) => (acc = acc + (item.selected ? 1 : 0)),
                  0,
                ) || 'No'}{' '}
                positive habits displayed
              </Text>
            </View>
            <View style={styles.statusLine}>
              <Ionicons name="md-close-circle-outline" style={{fontSize: 15}} />
              <Text style={styles.statusTxt}>
                {this.state.negativeData.every((item) => item.selected) &&
                this.state.negativeData.length > 0
                  ? 'All '
                  : ''}
                {this.state.negativeData.reduce(
                  (acc, item) => (acc = acc + (item.selected ? 1 : 0)),
                  0,
                ) || 'No'}{' '}
                negative habits displayed
              </Text>
            </View>
          </View>
          <View style={styles.edit}>
            <Ionicons
              name="md-create"
              style={styles.icon}
              onPress={() => {
                this.setState({modalVisible: true});
                Haptics.impactAsync();
              }}
            />
          </View>
        </View>
        <OverviewModal
          visible={this.state.modalVisible}
          close={() => this.setState({modalVisible: false})}
          positiveData={this.state.positiveData}
          negativeData={this.state.negativeData}
          toggleSelected={(id) => this.toggleSelected(id)}
        />
      </View>
    );
  }

  byDate() {
    let dataByDate = {};
    let dateString = (date) =>
      new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
    console.log(this.state.positiveData);

    this.state.positiveData.forEach((pHabit) => {
      let date = new Date(pHabit.timeStamp);
      pHabit.histValues.forEach((val, index) => {
        if (typeof dataByDate[dateString(date)] === 'undefined') {
          dataByDate[dateString(date)] = [];
        }
        dataByDate[dateString(date)].push({
          id: pHabit.id,
          status:
            0.1 * Math.min(1, val) +
            0.9 * Math.max(0, (val - 1) / (pHabit.parameters.max - 1)),
          completed: pHabit.activity[index],
          data: pHabit,
        });
        date.setDate(date.getDate() + 1);
      });
    });
    this.state.negativeData.forEach((nHabit) => {
      let date = new Date(nHabit.timeStamp);
      nHabit.histValues.forEach((val, index) => {
        if (typeof dataByDate[dateString(date)] === 'undefined') {
          dataByDate[dateString(date)] = [];
        }
        dataByDate[dateString(date)].push({
          id: nHabit.id,
          status: val,
          completed: nHabit.activity[index],
          data: nHabit,
        });
      });
    });
    this.setState({dataByDate: dataByDate});
  }

  toggleSelected(id) {
    let dataCopy;
    if (this.state.positiveData.filter((habit) => habit.id === id).length > 0) {
      //Positive
      this.setState(
        (prevState) => {
          dataCopy = prevState.positiveData.map((habit) => {
            let newHabit = {...habit};
            if (habit.id === id) {
              newHabit.selected = !habit.selected;
            }
            return newHabit;
          });
          this.storeData(positiveListName, dataCopy);
          return {positiveData: dataCopy};
        },
        () => this.byDate(),
      );
    } else {
      //Negative
      this.setState(
        (prevState) => {
          dataCopy = prevState.negativeData.map((habit) => {
            let newHabit = {...habit};
            if (habit.id === id) {
              newHabit.selected = !habit.selected;
            }
            return newHabit;
          });
          this.storeData(negativeListName, dataCopy);
          return {negativeData: dataCopy};
        },
        () => this.byDate(),
      );
    }
  }

  getMinDate() {
    let minNeg =
      this.state.negativeData.length > 0
        ? Math.min(...this.state.negativeData.map((item) => item.timeStamp))
        : new Date().getTime();
    let minPos =
      this.state.positiveData.length > 0
        ? Math.min(...this.state.positiveData.map((item) => item.timeStamp))
        : new Date().getTime();
    let returnDate = new Date(Math.min(minNeg, minPos));
    returnDate.setDate(1);
    return returnDate;
  }

  getMaxDate() {
    let d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(0);
    return d;
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  calendar: {
    minWidth: '100%',
    flex: 4,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 3,
  },
  footer: {
    minWidth: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    flexDirection: 'row',
  },
  status: {
    flex: 4,
    alignItems: 'flex-start',
    marginLeft: 5,
  },
  statusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  statusTxt: {
    fontSize: 15,
    marginLeft: 10,
  },
  edit: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 5,
  },
  icon: {
    fontSize: 25,
    margin: 5,
  },
});
