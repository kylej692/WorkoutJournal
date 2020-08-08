import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import StopWatch from './StopWatch';
import Timer from './Timer';

const TimeScreen = () => {
  return (
      <View>
        <StopWatch/>
        <Timer/>
      </View>
    );
};

export default TimeScreen;