import React from "react";
import { StyleSheet, Button } from "react-native";
import { View, Text, ScrollView } from "../components/Themed";
import Modal from "react-native-modal";

import * as Haptics from "expo-haptics";

export default function HabitHelpModal(props) {
  return (
    <Modal
      isVisible={props.visible}
      onBackButtonPress={() => props.close()}
      backdropOpacity={0.5}
      hasBackdrop={true}
      onBackdropPress={() => props.close()}
      useNativeDriver={true}
      animationInTiming={500}
      animationOutTiming={500}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.oval} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Habit Help</Text>
          </View>
          <View style={styles.body}>
            <ScrollView persistentScrollbar={true}>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  Add habits by pressing the "Add New Habit" button, which can
                  be found at the bottom of the "Positive Habits" and "Negative
                  Habits" screens.
                </Text>
              </View>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  Tap the habit name to toggle how you did with that habit
                  today. Positive habits get a check mark next to them when you
                  have successfully performed the habit. Negative habits get a
                  cross when you successfully abstain for a day.
                </Text>
              </View>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  Positive Habits have two options as well as a name. "Habit
                  Formation Time" is how difficult it is to "get into" a habit.
                  "Habit Loss time" is how quickly you can "get out of the
                  habit" if you stop for a while.
                </Text>
              </View>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  All negative habits have only a "Formation Time". The day you
                  fail to abstain, you immediately fall back to 0 momentum and
                  need to start building back up again.
                </Text>
              </View>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  If you need to retroactively change a habit's completion
                  status for a missed day, click on that day in the calendar in
                  the "Overview" tab. Note that you cannot extend habits back
                  before the date you created them. Press the help button in the
                  overview tab for more information
                </Text>
              </View>
            </ScrollView>
          </View>
          <View style={styles.footer}>
            <Button
              title="Close"
              onPress={() => {
                props.close();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 25,
  },
  oval: {
    width: 15,
    height: 4,
    backgroundColor: "#aaa0",
    margin: 4,
    borderRadius: 3,
  },
  content: {
    alignItems: "center",
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 7,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    margin: 5,
  },
  pgph: {
    padding: 5,
    paddingBottom: 10,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#aaa6",
  },
  pgphTxt: {
    fontSize: 16,
  },
  footer: {
    flex: 1,
    minWidth: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  btn: {
    flex: 1,
    padding: 10,
  },
});
