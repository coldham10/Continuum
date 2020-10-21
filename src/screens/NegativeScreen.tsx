import * as React from "react";
import HabitList from "../components/HabitList";

export default function NegativeScreen(props) {
  return (
    <HabitList
      dataKey="negativeList"
      positive={false}
      navigation={props.navigation}
    />
  );
}
