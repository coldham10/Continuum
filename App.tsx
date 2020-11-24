import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {Colors} from './src/utils/Constants';
import {Provider} from 'react-redux';
import RootNavigator from './src/navigation/BottomTabNavigator';
import store from './src/store/Store';

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar backgroundColor={Colors.tint} />
        </NavigationContainer>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
