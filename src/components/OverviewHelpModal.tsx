/*Full screen help modal for overview screen */

import React, {useState} from 'react';
import {
  StyleSheet,
  Button,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function OverviewHelpModal(props) {
  const [presses, setPresses] = useState(0);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            The <Text style={styles.bold}>Overview</Text> page gives you general
            and detailed feedback on how your habits are going. Use the{' '}
            <Text style={styles.bold}>pencil button</Text> at the bottom of the
            page to select one, many or all of your habits.
          </Text>
        </View>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            The progress of all the selected habits will be shown on the
            calendar by colors (red: most selected habits have low momentum;
            blue: you're doing great!).
          </Text>
        </View>
        <TouchableOpacity
          style={styles.secretTouch}
          activeOpacity={0.9}
          onPress={() => {
            setPresses(presses + 1);
            if (presses > 10) {
              props.navigation.navigate('AccountScreen');
            }
          }}>
          <Text style={styles.pgphTxt}>
            You can press the days in the calendar to see a summary of that day.
            For each of your habits you can see if you completed/abstained that
            day and the momentum you had. You can also press the{' '}
            <Text style={styles.bold}>edit button</Text> for each habit to
            retroactively change whether you achieved/abstained that day or not.
          </Text>
        </TouchableOpacity>
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
  secretTouch: {padding: 5, paddingBottom: 10, marginBottom: 10},
  pgphTxt: {
    fontSize: 18,
  },
  bold: {
    fontWeight: 'bold',
  },
});
