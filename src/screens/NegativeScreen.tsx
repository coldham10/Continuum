import * as React from 'react';
import HabitList from '../components/HabitList';
import {negativeListName} from '../utils/Constants';

export default function NegativeScreen(props) {
  return <HabitList positive={false} {...props} />;
}
