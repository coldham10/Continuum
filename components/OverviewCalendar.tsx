import React from "react";
import { CalendarList } from "react-native-calendars";
import * as Haptics from "expo-haptics";

export default function OverviewCalendar(props) {
  return (
    <CalendarList
      minDate={props.minDate}
      maxDate={props.maxDate}
      markedDates={getMarkings(props.dataByDate)}
      horizontal={true}
      pagingEnabled={true}
      futureScrollRange={1}
      pastScrollRange={Math.ceil(
        (Date.now() - props.minDate) / (1000 * 60 * 60 * 24 * 30.4)
      )}
      firstDay={1}
      showScrollIndicator={true}
      markingType={"period"}
      onDayPress={(day) => {
        props.selectDay(day);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
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
          return { sum: acc.sum + habit.status, n: acc.n + 1 };
        } else {
          return acc;
        }
      },
      { sum: 0, n: 0 }
    );
    if (daySummary.n === 0) {
      markings[dateStr] = { selected: false };
    } else {
      let score = daySummary.sum / daySummary.n;
      let color =
        "#" +
        Math.round(255 * (1 - score)) //r
          .toString(16)
          .padStart(2, "0") +
        Math.round(10 + 170 * Math.pow(score, 1.5)) //g
          .toString(16)
          .padStart(2, "0") +
        Math.round(255 * score) //b
          .toString(16)
          .padStart(2, "0") +
        "c0"; //a
      markings[dateStr] = { color: color };
    }
  });
  return markings;
}
