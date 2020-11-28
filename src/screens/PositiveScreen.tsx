import * as React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';

import HabitList from '../components/lists/HabitList';
import {positiveListName} from '../utils/Constants';

export default function PositiveScreen(props) {
  return <HabitList positive={true} {...props} />;
}
