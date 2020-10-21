import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import Colors from './src/utils/Colors';

import Navigator from './src/navigation/BottomTabNavigator';

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Navigator />
        <StatusBar backgroundColor={Colors.tint} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
