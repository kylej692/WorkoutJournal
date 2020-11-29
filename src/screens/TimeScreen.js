import React from 'react';
import { View } from 'react-native';
import StopWatch from '../components/TimerComponents/StopWatch';
import Timer from '../components/TimerComponents/Timer';

const TimeScreen = () => {
  return (
      <View style={{backgroundColor: '#C8DEFF', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StopWatch/>
        <Timer/>
      </View>
    );
};

export default TimeScreen;