/*Full page help screen for PositiveScreen and NegativeScreen */

import React from 'react';
import {StyleSheet, Button, View, Text, ScrollView} from 'react-native';

import * as Haptics from '../utils/Haptics';

export default function HabitHelpModal(props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            After adding a habit, tap the habit name to toggle how you did with
            that habit today. Positive habits get a check mark next to them when
            you have successfully performed the habit. Negative habits get a
            cross when you successfully abstain for a day.
          </Text>
        </View>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            Positive Habits have two options as well as a name.{' '}
            <Text style={styles.bold}>Habit Formation Time</Text> is how
            difficult it is to "get into" a habit.{' '}
            <Text style={styles.bold}>Habit Loss time</Text> is how quickly you
            will "get out of the habit" if you stop for a while . Negative
            habits have only a <Text style={styles.bold}>Formation Time</Text> .
            The day you fail to abstain, you immediately fall back to 0
            momentum.
          </Text>
        </View>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            If you need to retroactively change a habit's completion status for
            a missed day, click on that day in the calendar in the{' '}
            <Text style={styles.bold}>Overview</Text> tab. Note that you cannot
            extend habits back before the date you created them. Press the help
            button in the overview tab for more information
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    margin: 15,
  },
  pgph: {
    padding: 5,
    paddingBottom: 10,
    marginBottom: 10,
  },
  pgphTxt: {
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
});
