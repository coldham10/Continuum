import React from "react";
import { StyleSheet, SectionList, TouchableHighlight } from "react-native";
import { View, Text } from "../components/Themed";
import Modal from "react-native-modal";

import { Ionicons, FontAwesome } from "@expo/vector-icons";

export default function OverviewModal(props) {
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
      scrollOffset={100}
      style={{ flex: 1 }}
    >
      <View style={styles.spacer} />
      <View style={styles.container}>
        <View style={styles.oval} />
        <View style={styles.body}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Habits</Text>
          </View>
          <View style={styles.listContainer}>
            <SectionList
              sections={[
                { title: "Positive", data: props.positiveData },
                { title: "Negative", data: props.negativeData },
              ]}
              keyExtractor={(item, index) => item + index}
              renderSectionHeader={({ section: { title, data } }) => (
                <SectionHeader
                  title={title}
                  data={data}
                  toggleSelected={(id) => props.toggleSelected(id)}
                />
              )}
              renderItem={({ item }) => (
                <ListItem
                  item={item}
                  toggleSelected={(id) => props.toggleSelected(id)}
                />
              )}
              ListEmptyComponent={
                <Text style={{ flex: 1 }}>No habits added yet</Text>
              }
              contentContainerStyle={styles.listextra}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ListItem(props) {
  return (
    <View style={styles.li}>
      <TouchableHighlight
        style={styles.liHL}
        activeOpacity={0.6}
        underlayColor="#aaa8"
        onPress={() => props.toggleSelected(props.item.id)}
      >
        <Text style={styles.liTxt}>{props.item.title}</Text>
      </TouchableHighlight>
      {props.item.selected ? (
        <Ionicons
          name="md-checkmark-circle-outline"
          style={styles.checkBox}
          onPress={() => props.toggleSelected(props.item.id)}
        />
      ) : (
          <FontAwesome
            name="circle-thin"
            style={styles.checkBox}
            onPress={() => props.toggleSelected(props.item.id)}
          />
        )}
    </View>
  );
}

function SectionHeader(props) {
  const toggleAll = (data) => {
    if (allSelected(props.data)) {
      props.data.forEach((habit) => props.toggleSelected(habit.id));
    } else {
      props.data.forEach((habit) => {
        if (!habit.selected) {
          props.toggleSelected(habit.id);
        }
      });
    }
  };
  return (
    <View style={styles.secHeader}>
      <TouchableHighlight
        style={styles.shHL}
        activeOpacity={0.6}
        underlayColor="#aaa8"
        onPress={() => toggleAll(props.data)}
      >
        <Text style={styles.shTxt}>{props.title}</Text>
      </TouchableHighlight>
      {allSelected(props.data) ? (
        <Ionicons
          name="md-checkmark-circle-outline"
          style={styles.checkBox}
          onPress={() => toggleAll(props.data)}
        />
      ) : (
          <FontAwesome
            name="circle-thin"
            style={styles.checkBox}
            onPress={() => toggleAll(props.data)}
          />
        )}
    </View>
  );
}

function allSelected(data) {
  return data.every((habit) => habit.selected);
}

const styles = StyleSheet.create({
  spacer: {
    flex: 4,
    opacity: 0,
  },
  container: {
    flex: 3,
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
  body: {
    alignItems: "center",
    flex: 1,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  listContainer: {
    alignItems: "center",
    minWidth: "90%",
    flex: 4,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#aaa8",
    margin: 5,
  },
  list: {
    minWidth: "100%",
  },
  listExtra: {
    justifyContent: "center",
    alignItems: "center",
  },
  secHeader: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 5,
  },
  shHL: {
    flex: 1,
    borderRadius: 2,
  },
  shTxt: {
    fontSize: 20,
    fontWeight: "bold",
  },
  li: {
    flexDirection: "row",
    minWidth: "90%",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  liHL: {
    flex: 1,
    borderRadius: 2,
  },
  liTxt: {
    fontSize: 20,
  },
  checkBox: {
    fontSize: 20,
  },
});
