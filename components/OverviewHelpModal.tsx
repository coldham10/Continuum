import React from "react";
import { StyleSheet, Button } from "react-native";
import { View, Text, ScrollView } from "../components/Themed";
import Modal from "react-native-modal";
import * as Haptics from "expo-haptics";

export default function OverviewHelpModal(props) {
  return (
    <Modal
      isVisible={props.visible}
      onBackButtonPress={() => props.close()}
      backdropOpacity={0.5}
      hasBackdrop={true}
      swipeDirection="down"
      swipeThreshold={100}
      onSwipeComplete={() => props.close()}
      onBackdropPress={() => props.close()}
      useNativeDriver={true}
      animationInTiming={500}
      animationOutTiming={500}
      scrollOffset={300}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.oval} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Overview Help</Text>
          </View>
          <View style={styles.body}>
            <ScrollView persistentScrollbar={true}>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  The Overview page gives you general and detailed feedback on
                  how your habits are going. Use the pencil button at the bottom
                  of the page to select one, many or all of your habits.
                </Text>
              </View>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  The progress of all the selected habits will be shown on the
                  calendar by colors (red: most selected habits have low
                  momentum; blue: you're doing great!).
                </Text>
              </View>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  You can press the days in the calendar to see a summary of
                  that day. For each of your habits you can see if you
                  completed/abstained that day and the momentum you had.
                </Text>
              </View>
              <View style={styles.pgph}>
                <Text style={styles.pgphTxt}>
                  You can also press the edit button for each habit to
                  retroactively change whether you achieved/abstained that day
                  or not. This is helpful if you're logging your habits after
                  not using the app for a couple of days.
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
  },
  oval: {
    width: 15,
    height: 4,
    backgroundColor: "#aaa8",
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
