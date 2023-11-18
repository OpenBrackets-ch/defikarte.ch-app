import 'intl-pluralrules';
import React from 'react';
import { StatusBar } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ErrorBoundary from './src/components/ErrorBoundary';
import { Provider as DefibrillatorProvider } from './src/context/DefibrillatorContext';
import { Provider as InfoProvider } from './src/context/InfoContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import './src/i18n/i18n';
import AboutScreen from './src/screens/AboutScreen';
import CreateScreen from './src/screens/CreateScreen';
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import MainScreen from './src/screens/MainScreen';

const navigator = createStackNavigator({
  Main: { screen: MainScreen, navigationOptions: { title: 'Karte', headerShown: false } },
  List: { screen: ListScreen, navigationOptions: { title: 'In deiner Nähe', headerShown: true } },
  Create: { screen: CreateScreen, navigationOptions: { title: 'Defibrillator melden', headerShown: true } },
  Detail: { screen: DetailScreen, navigationOptions: { title: 'Detailansicht', headerShown: true } },
  About: { screen: AboutScreen, navigationOptions: { title: 'About', headerShown: true } },
}, {
  initialRouteName: 'Main',
  defaultNavigationOptions: {
    title: 'Defikarte.ch',
    headerShown: false,
  }
});

const App = createAppContainer(navigator);

export default () => {
  return (
    <DefibrillatorProvider>
      <LocationProvider>
        <InfoProvider>
          <SafeAreaProvider>
            <StatusBar backgroundColor='rgba(255, 255, 255, 0)' barStyle={'dark-content'} />
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </SafeAreaProvider>
        </InfoProvider>
      </LocationProvider>
    </DefibrillatorProvider>
  );
};
