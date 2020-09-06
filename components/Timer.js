import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import NumericInput from 'react-native-numeric-input';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

const Sound = require('react-native-sound');
Sound.setCategory('Playback');

const bell = new Sound('boxing_bell.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load sound', error);
    return;
  }

  console.log('duration in seconds: ' + bell.getDuration() + 'number of channels: ' + bell.getNumberOfChannels());

});

const Timer = () => {

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [defaultTimer, setDefaultTimer] = useState(true);

  function toggle() {
    setIsActive(!isActive);
  };

  function reset() {
    setDefaultTimer(true);
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setIsActive(false);
  };

  useEffect(() => {
    let Interval = null;
    if (isActive) {
      if (seconds !== 0 || minutes !== 0 || hours !== 0) {
        setDefaultTimer(false);
      }
      if (seconds === 0 && minutes === 0 && hours === 0) {
        if (!defaultTimer) {
          bell.play((success) => {
            if (success) {
              console.log('successfully finished playing');
              setDefaultTimer(true);
            } else {
              console.log('playback failed due to audio decoding errors');
            }
          });
        }
        clearInterval(Interval);
        setIsActive(false);
      } if (seconds === 0 && minutes !== 0) {
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
  }, [isActive, seconds, minutes, hours]);

  return (
      <View style={styles.container}>
        <Text style={styles.header}>Timer</Text>
        <Text style={styles.display} >{hours}h:{minutes}m:{seconds}s</Text>
        <View style={styles.numericInput}>
          <NumericInput 
            borderColor='black' 
            rightButtonBackgroundColor='#2C95FF' 
            leftButtonBackgroundColor='#2C95FF'
            iconColorinitValue={0} 
            initValue={0}
            minValue={0} value={hours} 
            onChange={setHours} />
          <NumericInput 
            borderColor='black' 
            rightButtonBackgroundColor='#2C95FF' 
            leftButtonBackgroundColor='#2C95FF'
            initValue={0} 
            minValue={0} 
            value={minutes} 
            onChange={setMinutes} />
          <NumericInput 
            borderColor='black' 
            rightButtonBackgroundColor='#2C95FF' 
            leftButtonBackgroundColor='#2C95FF'
            initValue={0} 
            minValue={0} 
            value={seconds} 
            onChange={setSeconds} />
        </View>
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

const styles = StyleSheet.create ({
  container: {
    borderTopWidth: 1, 
    marginTop: 50,
    alignSelf: 'center',
  },
  header: {
    color: 'black',
    fontSize: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  display: {
    color: 'black',
    textDecorationLine: 'underline',
    marginTop: 10,
    fontSize: 40,
    textAlign: 'center',
  },
  numericInput: {
    flexDirection:"row", 
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
  },
  start: {
    margin:5, 
    marginHorizontal: 110, 
    marginTop: 10,
  },
  reset: {
    margin:5, 
    fontSize: 35, 
    marginTop: 10,
  }
});

export default Timer;

