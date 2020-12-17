import React from 'react';
import { View, ScrollView } from 'react-native';
import StopWatch from '../components/TimerComponents/StopWatch';
import Timer from '../components/TimerComponents/Timer';

const TimeScreen = () => {
  return (
    <ScrollView style={{backgroundColor: '#C8DEFF' }}>
      <View style={{backgroundColor: '#C8DEFF', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <StopWatch/>
        <Timer/>
      </View>
    </ScrollView>
    );
};

export default TimeScreen;