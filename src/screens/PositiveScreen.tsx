import * as React from 'react';
import HabitList from '../components/lists/HabitList';

export default function PositiveScreen(props) {
  return <HabitList positive={true} {...props} />;
}
