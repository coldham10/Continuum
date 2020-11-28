import * as React from 'react';
import {Vibration, Platform} from 'react-native';

export function impact() {
  if (Platform.OS !== 'ios') {
    Vibration.vibrate(200);
  } else {
    Vibration.vibrate();
  }
}

export function warn() {
  if (Platform.OS !== 'ios') {
    Vibration.vibrate([200, 200, 200, 200, 200]);
  } else {
    Vibration.vibrate([400, 400, 400]);
  }
}
