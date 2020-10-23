import * as React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import HabitList from '../components/HabitList';

export default function PositiveScreen(props) {
  return <HabitList dataKey="positiveList" positive={true} {...props} />;
}
