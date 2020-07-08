import * as React from "react";
import HabitList from "../components/HabitList";

export default function PositiveScreen() {
  return <HabitList dataKey="negativeList" positive={false} />;
}
