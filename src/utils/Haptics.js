import * as React from 'react';
import {Vibration, Platform} from 'react-native';

export function impact() {
  if (Platform.OS !== 'ios') {
    Vibration.vibrate(25);
  } else {
  }
}

export function warn() {
  if (Platform.OS !== 'ios') {
    Vibration.vibrate([0, 30, 50, 30, 50, 30]);
  } else {
  }
}
