/*Full page help screen for PositiveScreen and NegativeScreen */

import React from 'react';
import {
  StyleSheet,
  Button,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import {vignettes} from '../utils/Constants';

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
          <View style={styles.image1Container}>
            <Image source={vignettes.habit} style={styles.image1} />
          </View>
        </View>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            For positive habits you can set two options:{' '}
            <Text style={styles.bold}>Habit Formation Time</Text> is how
            difficult it is to "get into" a habit;{' '}
            <Text style={styles.bold}>Habit Loss time</Text> is how quickly you
            will "get out of the habit" if you stop. Negative habits have only a{' '}
            <Text style={styles.bold}>Formation Time</Text>, the day you fail to
            abstain, you immediately fall back to 0 momentum.
          </Text>
          <View style={styles.image2Container}>
            <Image source={vignettes.edit} style={styles.image2} />
          </View>
        </View>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            To retroactively change a habit's completion status, click on that
            day in the calendar on the <Text style={styles.bold}>Overview</Text>{' '}
            screen. Note that you cannot extend habits back before the date you
            created them.
          </Text>
        </View>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            Press the help button in the Overview screen for more information
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
  image1Container: {
    alignSelf: 'center',
    width: 0.8 * Dimensions.get('window').width,
    height: 0.27 * Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#888',
  },
  image1: {
    resizeMode: 'center',
    width: 0.8 * Dimensions.get('window').width - 20,
    height: 0.27 * Dimensions.get('window').width - 20,
    borderRadius: 10,
  },
  image2Container: {
    alignSelf: 'center',
    width: 0.8 * Dimensions.get('window').width,
    height: 0.8 * Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#888',
  },
  image2: {
    resizeMode: 'center',
    width: 0.8 * Dimensions.get('window').width - 30,
    height: 0.8 * Dimensions.get('window').width - 30,
  },
});
