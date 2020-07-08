import React from "react";
import { CalendarList } from "react-native-calendars";

export default function OverviewCalendar(props) {
  return (
    <CalendarList
      minDate={props.minDate}
      maxDate={props.maxDate}
      horizontal={true}
      pagingEnabled={true}
      futureScrollRange={1}
      pastScrollRange={Math.ceil(
        (Date.now() - props.minDate) / (1000 * 60 * 60 * 24 * 30.4)
      )}
      firstDay={1}
      showScrollIndicator={true}
    />
  );
  //TODO if extending habit backwards, greyed out?
}
