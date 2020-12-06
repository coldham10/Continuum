import * as React from 'react';
import {ImageBackground} from 'react-native';
import HabitList from '../components/lists/HabitList';

export default function NegativeScreen(props) {
  return (
    <ImageBackground
      style={{width: '100%', height: '100%'}}
      source={require('../../assets/images/backgrounds/andrea-zanenga-pI_rKZJcEXI-unsplash.jpg')}>
      <HabitList positive={false} {...props} />
    </ImageBackground>
  );
}
