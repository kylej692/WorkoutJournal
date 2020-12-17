import React from 'react';
import { View, ScrollView } from 'react-native';
import StopWatch from '../components/TimerComponents/StopWatch';
import Timer from '../components/TimerComponents/Timer';

const TimeScreen = () => {
  return (
    <ScrollView style={{backgroundColor: '#C8DEFF' }} contentContainerStyle={{paddingBottom: 50}}>
        <StopWatch/>
        <Timer/>
    </ScrollView>
    );
};

export default TimeScreen;