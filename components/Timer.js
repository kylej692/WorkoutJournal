import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

const Timer = () => {

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
      <View>
        <Text>{seconds}</Text>
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

export default Timer;