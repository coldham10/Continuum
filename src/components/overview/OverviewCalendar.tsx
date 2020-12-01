/*The central 'Heatmap' style calendar component of OverviewScreen.  Days are
 *touchable (opens DayModal)*/

import React from 'react';
import {CalendarList} from 'react-native-calendars';
import {connect} from 'react-redux';
import * as Haptics from '../../utils/Haptics';

function OverviewCalendar(props) {
  /*futureScrollRange={1}
  pastScrollRange={Math.ceil(
    (Date.now() - props.minDate) / (1000 * 60 * 60 * 24 * 30.4)
  )}*/
  return (
    <CalendarList
      minDate={props.minDate}
      maxDate={props.maxDate}
      markedDates={getMarkings(props.dataByDate)}
      horizontal={true}
      pagingEnabled={true}
      firstDay={1}
      showScrollIndicator={true}
      markingType={'period'}
      onDayPress={(day) => {
        Haptics.impact();
        props.selectDay(day);
      }}
      futureScrollRange={3}
      pastScrollRange={Math.max(
        12,
        Math.ceil((Date.now() - props.minDate) / (1000 * 60 * 60 * 24 * 30.4)),
      )}
    />
  );
}

function getMarkings(dataByDate) {
  let markings = {};

  Object.keys(dataByDate).forEach((dateStr) => {
    let habits = dataByDate[dateStr];
    let daySummary = habits.reduce(
      (acc, habit) => {
        if (habit.data.selected) {
          return {sum: acc.sum + habit.status, n: acc.n + 1};
        } else {
          return acc;
        }
      },
      {sum: 0, n: 0},
    );
    if (daySummary.n === 0) {
      markings[dateStr] = {selected: false};
    } else {
      let score = daySummary.sum / daySummary.n;
      let color =
        '#' +
        Math.round(255 * (1 - score)) //r
          .toString(16)
          .padStart(2, '0') +
        Math.round(10 + 170 * Math.pow(score, 1.5)) //g
          .toString(16)
          .padStart(2, '0') +
        Math.round(255 * score) //b
          .toString(16)
          .padStart(2, '0') +
        'c0'; //a
      markings[dateStr] = {color: color};
    }
  });
  return markings;
}

function byDate(positiveData, negativeData) {
  let dataByDate = {};
  let dateString = (date) =>
    new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

  positiveData.forEach((pHabit) => {
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
  negativeData.forEach((nHabit) => {
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
      date.setDate(date.getDate() + 1);
    });
  });
  return dataByDate;
}

function getMinDate(positiveData, negativeData) {
  let minNeg =
    negativeData.length > 0
      ? Math.min(...negativeData.map((item) => item.timeStamp))
      : new Date().getTime();
  let minPos =
    positiveData.length > 0
      ? Math.min(...positiveData.map((item) => item.timeStamp))
      : new Date().getTime();
  let returnDate = new Date(Math.min(minNeg, minPos));
  returnDate.setDate(1);
  return returnDate;
}

function getMaxDate() {
  let d = new Date();
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return d;
}

const mapStateToProps = (state, ownProps) => {
  return {
    dataByDate: byDate(state.positiveList, state.negativeList),
    minDate: getMinDate(state.positiveList, state.negativeList),
    maxDate: getMaxDate(),
  };
};

export default connect(mapStateToProps, null)(OverviewCalendar);
