import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import StopWatch from './StopWatch';
import Timer from './Timer';

const TimeScreen = () => {
  return (
      <View style={{backgroundColor: '#C8DEFF', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StopWatch/>
        <Timer/>
      </View>
    );
};

export default TimeScreen;