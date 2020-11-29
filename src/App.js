import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ProgressScreen from './screens/ProgressScreen';
import TimeScreen from './screens/TimeScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home';
            } else if (route.name === 'Progress') {
              iconName = focused ? 'linechart' : 'linechart';
            } else if (route.name === 'Time') {
              iconName = focused ? 'clockcircleo' : 'clockcircleo';
            }

            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'black',
          inactiveTintColor: 'white',
          showLabel: false,
          style: {backgroundColor: '#2C95FF', height: 45}
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Progress" component={ProgressScreen} />
        <Tab.Screen name="Time" component={TimeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
