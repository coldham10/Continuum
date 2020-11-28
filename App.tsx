import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {Colors} from './src/utils/Constants';
import {Provider} from 'react-redux';
import RootNavigator from './src/navigation/BottomTabNavigator';
import store from './src/store/Store';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: Colors.badge,
  },
};

const persistor = persistStore(store);

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer theme={theme}>
            <RootNavigator />
            <StatusBar backgroundColor={Colors.statusBar} />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
