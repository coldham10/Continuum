import React, { useState } from "react";
import { StyleSheet, SectionList, TouchableHighlight } from "react-native";
import { View, Text, FlatList } from "../components/Themed";
import Modal from "react-native-modal";
import * as Haptics from "expo-haptics";

import { Ionicons, FontAwesome } from "@expo/vector-icons";

import EditConfirmModal from "../components/EditConfirmModal";

export default function DayModal(props) {
  const [confirm, setConfirm] = useState(null);

  return (
    <Modal
      isVisible={props.day !== null}
      onBackButtonPress={() => props.close()}
      backdropOpacity={0.5}
      hasBackdrop={true}
      swipeDirection="down"
      swipeThreshold={200}
      onSwipeComplete={() => props.close()}
      onBackdropPress={() => props.close()}
      useNativeDriver={true}
      animationInTiming={500}
      animationOutTiming={500}
      scrollOffset={200}
      style={{ flex: 1 }}
      propagateSwipe={confirm !== null}
    >
      <View style={styles.container}>
        <View style={styles.oval} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {props.day === null
                ? ""
                : "Overview of " +
                  new Date(
                    props.day.year,
                    props.day.month - 1,
                    props.day.day
                  ).toDateString()}
            </Text>
          </View>
          <View style={styles.body}>
            <FlatList
              data={props.day ? props.data[props.day.dateString] : []}
              renderItem={({ item }) => (
                <ListItem
                  title={item.data.title}
                  completed={item.completed}
                  status={item.status}
                  day={props.day}
                  positive={item.data.positive}
                  edit={setConfirm.bind(null, {
                    id: item.id,
                    dateString: props.day.dateString,
                  })}
                />
              )}
              keyExtractor={(item) => "id" + item.id}
              ListHeaderComponent={
                <View style={styles.listHdr}>
                  <View style={{ flex: 3, alignItems: "center" }}>
                    <Text style={{ fontSize: 20, paddingRight: "10%" }}>
                      Title
                    </Text>
                  </View>
                  <View style={{ flex: 2, alignItems: "center" }}>
                    <Text style={{ fontSize: 17 }}>Achieved/</Text>
                    <Text style={{ fontSize: 17 }}>Momentum</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 17, paddingRight: 5 }}>Edit</Text>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyTxt}>
                    No habits available for this day
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
      <EditConfirmModal
        visible={confirm !== null}
        close={() => setConfirm(null)}
        confirm={() => props.toggleActivity(confirm.id, confirm.dateString)}
      />
    </Modal>
  );
}

function ListItem(props) {
  return (
    <View style={styles.li}>
      <Text style={styles.liTxt}>{props.title}</Text>
      {props.completed ? (
        <Ionicons
          name={
            props.positive
              ? "md-checkmark-circle-outline"
              : "md-close-circle-outline"
          }
          style={styles.checkBox}
        />
      ) : (
        <FontAwesome name="circle-thin" style={styles.checkBox} />
      )}
      <Text style={styles.liPct}>{Math.round(100 * props.status)}%</Text>
      <View style={{ flex: 3, backgroundColor: "#0000" }}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#aaa8"
          onPress={() => {
            props.edit();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }}
          style={{
            flex: 1,
            alignItems: "center",
            borderRadius: 5,
            borderWidth: 1,
            padding: 2,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#0000",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {props.completed ? (
              <Ionicons
                name={
                  props.positive
                    ? "md-checkmark-circle-outline"
                    : "md-close-circle-outline"
                }
                style={{ flex: 1 }}
                size={12}
              />
            ) : (
              <FontAwesome name="circle-thin" style={{ flex: 1 }} size={12} />
            )}
            <Ionicons
              name="ios-arrow-round-forward"
              style={{ flex: 1 }}
              size={17}
            />
            {props.completed ? (
              <FontAwesome name="circle-thin" style={{ flex: 1 }} size={12} />
            ) : (
              <Ionicons
                name={
                  props.positive
                    ? "md-checkmark-circle-outline"
                    : "md-close-circle-outline"
                }
                style={{ flex: 1 }}
                size={12}
              />
            )}
          </View>
        </TouchableHighlight>
      </View>
    </View>
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
    padding: 5,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  body: {
    flex: 6,
    borderWidth: 1,
    minWidth: "100%",
    borderRadius: 3,
    padding: 1,
    marginBottom: 5,
    borderColor: "#aaa8",
  },
  li: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#aaa5",
    borderWidth: 1,
    borderColor: "#aaa9",
  },
  listHdr: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    paddingBottom: 5,
    margin: 5,
  },
  liTxt: {
    flex: 12,
    fontSize: 17,
  },
  liPct: {
    flex: 3,
    fontSize: 17,
  },
  checkBox: {
    flex: 3,
    fontSize: 20,
  },
  empty: {
    padding: 10,
    marginTop: 10,
    alignItems: "center",
  },
  emptyTxt: {
    fontSize: 17,
  },
});
