/*Full screen help modal for overview screen */

import React, {useState} from 'react';
import {
  StyleSheet,
  Button,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {vignettes} from '../utils/Constants';

export default function OverviewHelpModal(props) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            The <Text style={styles.bold}>Overview</Text> page gives you general
            and detailed feedback on how your habits are going. Use the{' '}
            <Text style={styles.bold}>
              " <Ionicons name="md-create" size={18} /> " button
            </Text>{' '}
            at the bottom of the page to select one, many or all of your habits.
          </Text>
        </View>
        <View style={styles.pgph}>
          <Text style={styles.pgphTxt}>
            The progress of all the selected habits will be shown on the
            calendar by colors, from red to blue.
          </Text>
          <View style={styles.image1Container}>
            <Image source={vignettes.calendar} style={styles.image1} />
          </View>
        </View>
        <Text style={styles.pgphTxt}>
          You can press the days in the calendar to see a summary of that day.
          For each of your habits you can see if you completed/abstained that
          day and the momentum you had.
        </Text>
        <View style={styles.image2Container}>
          <Image source={vignettes.daily} style={styles.image2} />
        </View>
        <Text>
          You can also press the <Text style={styles.bold}>edit button</Text>{' '}
          for each habit to retroactively change whether you achieved/abstained
          that day or not.
        </Text>
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
  bold: {
    fontWeight: 'bold',
  },
  image1Container: {
    alignSelf: 'center',
    width: 0.8 * Dimensions.get('window').width,
    height: 0.7 * Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#888',
  },
  image1: {
    resizeMode: 'center',
    width: 0.8 * Dimensions.get('window').width - 20,
    height: 0.7 * Dimensions.get('window').width - 20,
  },
  image2Container: {
    alignSelf: 'center',
    width: 0.8 * Dimensions.get('window').width,
    height: 0.16 * Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#888',
  },
  image2: {
    resizeMode: 'center',
    width: 0.8 * Dimensions.get('window').width - 5,
    height: 0.16 * Dimensions.get('window').width - 5,
  },
});
