import * as React from 'react';
import HabitList from '../components/lists/HabitList';

export default function NegativeScreen(props) {
  return <HabitList positive={false} {...props} />;
}
