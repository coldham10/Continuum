import * as React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import HabitList from '../components/HabitList';
import {positiveListName} from '../utils/Constants';

export default function PositiveScreen(props) {
  return <HabitList dataKey={positiveListName} positive={true} {...props} />;
}