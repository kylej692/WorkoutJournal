import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

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
      <View style={styles.container}>
        <Text style={styles.header}>StopWatch</Text>
        <Text style={styles.display}>{hours}h:{minutes}m:{seconds}s</Text>
        <View style={styles.button}>
          <TouchableOpacity style={styles.start} onPress={toggle}>
            <Icon name={isActive ? 'pause' : 'play'} size={30} color={'black'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.reset} onPress={reset}>
            <Icon name={'redo'} size={30} color={'black'} /> 
          </TouchableOpacity>
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: { 
    alignSelf: "center",
  },
  header: {
    color: 'black', 
    fontSize: 20, 
    marginBottom: 40, 
    textAlign: 'center',
  },
  display: {
    color: 'black', 
    textDecorationLine: 'underline', 
    fontSize: 40, 
    textAlign: "center",
  },
  button: {
    flexDirection:"row",
  },
  start: {
    margin:10, 
    marginRight: 10,
  },
  reset: {
    margin:10, 
    marginLeft: 90,
  }
});

export default StopWatch;