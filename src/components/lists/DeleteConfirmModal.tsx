/*Small modal that confirms a habit deletion within either habit list page */

import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

function DeleteConfirmModal(props) {
  return (
    <Modal
      isVisible={props.visible}
      onBackButtonPress={() => props.close()}
      backdropOpacity={0.5}
      hasBackdrop={true}
      swipeDirection="down"
      swipeThreshold={80}
      onSwipeComplete={() => props.close()}
      onBackdropPress={() => props.close()}
      useNativeDriver={true}
      animationInTiming={500}
      animationOutTiming={500}
      scrollOffset={100}
      style={{flex: 1}}>
      <View style={styles.spacer} />
      <View style={styles.container}>
        <View style={styles.oval} />
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Confirm Delete: {props.name}</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancel}
                onPress={() => {
                  props.close();
                }}>
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.del}
                onPress={() => {
                  props.confirm();
                  props.close();
                }}>
                <Text style={styles.delTxt}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.spacer} />
    </Modal>
  );
}

const mapStateToProps = (state, ownProps) => {
  let list = ownProps.positive ? state.positiveList : state.negativeList;
  let index = list.findIndex((h) => h.id === ownProps.id);
  return {name: index >= 0 ? list[index].name : ''};
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let prefix = ownProps.positive ? 'positive/' : 'negative/';
  return {
    confirm: () => dispatch({type: prefix + 'remove', payload: ownProps.id}),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteConfirmModal);

const styles = StyleSheet.create({
  spacer: {
    flex: 3,
    opacity: 0,
  },
  container: {
    flex: 3,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  oval: {
    width: 15,
    height: 4,
    backgroundColor: '#aaa8',
    margin: 4,
    borderRadius: 3,
  },
  content: {
    alignItems: 'center',
    flex: 1,
  },
  header: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  body: {
    flex: 3,
  },
  buttonContainer: {
    flex: 1,
    minWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  cancel: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },
  cancelTxt: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
  del: {
    padding: 12,
    borderRadius: 5,
    backgroundColor: '#c00d',
  },
  delTxt: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
