import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

const Timer = () => {

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  };

  function reset() {
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setIsActive(false);
  };

  useEffect(() => {
    let Interval = null;
    if (isActive && seconds === 0 && minutes === 0 && hours === 0) {
      clearInterval(Interval);
      setIsActive(false);
    } else if (isActive) {
        if (seconds === 0 && minutes !== 0) {
          setSeconds(59);
          setMinutes(minutes => minutes - 1);
      } if (minutes === 0 && hours !== 0) {
          if (seconds == 0) {
            setSeconds(59);
          }
          setMinutes(59);
          setHours(hours => hours - 1);
      }
      Interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (!isActive && (seconds !== 0 || minutes !== 0 || hours !== 0)) {
      clearInterval(Interval);
    }
    return () => { 
      clearInterval(Interval);
    }
  }, [isActive, seconds]);

  return (
      <View style={{position: 'absolute', borderTopWidth: 1, top: 335, alignSelf: "center"}}>
        <Text style={{fontSize: 20, top: 60, textAlign: 'center'}}>Timer</Text>
        <Text style={{textDecorationLine: 'underline', top: 90, fontSize: 40, textAlign: "center"}} >{hours}h:{minutes}m:{seconds}s</Text>
        <View style={{flexDirection:"row", marginTop: 100}}>
          <NumericInput initValue={0} minValue={0} value={hours} onChange={setHours} />
          <NumericInput initValue={0} minValue={0} value={minutes} onChange={setMinutes} />
          <NumericInput initValue={0} minValue={0} value={seconds} onChange={setSeconds} />
        </View>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity style={{margin:5, marginHorizontal: 110, marginTop: 10}} onPress={toggle}>
            <Icon name={isActive ? 'pause' : 'play'} size={30} color={'grey'} />
          </TouchableOpacity>
          <TouchableOpacity style={{margin:5, fontSize: 35, marginTop: 10}} onPress={reset}>
            <Icon name={'redo'} size={30} color={'grey'} />
          </TouchableOpacity>
        </View>
      </View>
    );
};

export default Timer;