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
      <View style={{bottom: 90, alignSelf: "center"}}>
        <Text style={{fontSize: 20, bottom: 40, textAlign: 'center'}}>StopWatch</Text>
        <Text style={{textDecorationLine: 'underline', fontSize: 40, textAlign: "center"}}>{hours}h:{minutes}m:{seconds}s</Text>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={toggle}>
            <Text style={{margin:5, marginRight: 70, fontSize: 35}}>{isActive ? 'Stop' : 'Start'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset}>
            <Text style={{margin:5, marginRight: 10, fontSize: 35}}>Reset</Text> 
          </TouchableOpacity>
        </View>
      </View>
    );
};

export default StopWatch;