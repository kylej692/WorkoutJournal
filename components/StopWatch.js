import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const StopWatch = () => {

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setIsActive(false);
  }

  useEffect(() => {
    let Interval = null;
    if (isActive) {
      if (seconds === 60) {
        setSeconds(0);
        setMinutes(minutes => minutes + 1);
      } if (minutes === 60) {
        setMinutes(0);
        setHours(hours => hours + 1);
      }
      Interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && (seconds !== 0 || minutes !== 0 || hours !== 0)) {
      clearInterval(Interval);
    }
    return () => { 
      clearInterval(Interval);
    }
  }, [isActive, seconds]);

  return (
      <View>
        <Text>{hours}h:{minutes}m:{seconds}s</Text>
        <View>
          <TouchableOpacity onPress={toggle}>
            <Text>{isActive ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset}>
            <Text>Reset</Text> 
          </TouchableOpacity>
        </View>
      </View>
    );
};

export default StopWatch;