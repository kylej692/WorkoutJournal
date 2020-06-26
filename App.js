import React, {useState} from 'react';
import {View, StyleSheet, Alert } from 'react-native';
import { Content } from 'native-base';
import Header from './components/Header';
import LogEntry from './components/LogEntry';
import AddLogButton from './components/AddLogButton';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import AsyncStorage from '@react-native-community/async-storage';

const App = () => {

  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e);
    }
  }

  const getData = async (key) => {
    try {
      var jsonValue = await AsyncStorage.getItem(key);
      return JSON.parse(jsonValue);
    } catch(e) {
      console.log(e);
    }
  }

  const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch(e) {
      console.log(e);
    }
  }

  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      console.log(e);
    }
  
    console.log('Done.');
  }

  const log = {
    id: '',
    time: {}, 
    workouts: [],
  };

  const [items, setItems] = useState([]);

  if(items.length == 0) {
    getAllKeys().then(keys => {
      keys.map((key) => {
        getData(key).then(val => { 
          setItems(prevItems => {
            return [ val, ...prevItems ];
          }) 
        });
      })
    })
  }

  const sortItems = (items) => {
    const sorted = [...items].sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month1 = months.indexOf(a.time.date.slice(0, 3));
      const day1 = a.time.date.slice(4, 6);
      const year1 = a.time.date.slice(8, 12);
      const month2 = months.indexOf(b.time.date.slice(0, 3));
      const day2 = b.time.date.slice(4, 6);
      const year2 = b.time.date.slice(8, 12);
      
      var date1 = month1 + "/" + day1 + "/" + year1;
      var date2 = month2 + "/" + day2 + "/" + year2; 

      const timeStr1 = a.time.start;
      const timeStr2 = b.time.start;

      var hour1 = "";
      var minute1 = "";
      var meridiem1 = "";
      if (timeStr1.length == 7) {
        hour1 = timeStr1.slice(0, 2);
        minute1 = timeStr1.slice(3, 5);
        meridiem1 = timeStr1.slice(5, 7);
      } else {
        hour1 = timeStr1.slice(0, 1);
        minute1 = timeStr1.slice(2, 4);
        meridiem1 = timeStr1.slice(4, 6);
      }

      var hour2 = "";
      var minute2 = "";
      var meridiem2 = "";
      if (timeStr2.length == 7) {
        hour2 = timeStr2.slice(0, 2);
        minute2 = timeStr2.slice(3, 5);
        meridiem2 = timeStr2.slice(5, 7);
      } else {
        hour2 = timeStr2.slice(0, 1);
        minute2 = timeStr2.slice(2, 4);
        meridiem2 = timeStr2.slice(4, 6);
      }

      const time1 = hour1 + ":" + minute1 + ":" + "00 " + meridiem1;
      const time2 = hour2 + ":" + minute2 + ":" + "00 " + meridiem2;

      const aDate = new Date(date1 + " " + time1);
      const bDate = new Date(date2 + " " + time2);
      
      return bDate - aDate;
    })

    return sorted;
  }

  const deleteWorkout = (id) => {
    setItems(prevItems => {
      var emptyItemId = null;
      prevItems.map((item) => {
        item.workouts = item.workouts.filter(workout => workout.id != id);
        storeData(item.id, item);
        if(item.workouts.length == 0) {
          emptyItemId = item.id;
          removeValue(item.id);
        };
      });
      return prevItems.filter(item => item.id != emptyItemId);
    });
  };

  const addItem = (time, workouts) => {
    if(!time || !workouts) {
      Alert.alert("Please enter a workout!")
    } else {
      setItems(prevItems => {
        var newItem = {id: uuid(), time: time, workouts: workouts};
        storeData(newItem.id, newItem);
        return [ newItem, ...prevItems ];
      })
    }
  }

  const modifyWorkout = (modifiedWorkout) => {
    setItems(prevItems => {
      for(var i = 0; i < prevItems.length; i++) {
        for(var j = 0; j < prevItems[i].workouts.length; j++) {
          if(prevItems[i].workouts[j].id == modifiedWorkout.id) {
            prevItems[i].workouts[j] = modifiedWorkout
            storeData(prevItems[i].id, prevItems[i]);
          }
        }
      }
      return prevItems;
    })
  }

  const modifyDateTime = (itemId, date, start, end) => {
    setItems(prevItems => {
      for(var i = 0; i < prevItems.length; i++) {
        if(prevItems[i].id == itemId) {
          prevItems[i].time.date = date;
          prevItems[i].time.start = start;
          prevItems[i].time.end = end;
          storeData(prevItems[i].id, prevItems[i]);
        }
      }
      return sortItems(prevItems);
    })
  }

  return (
    <View style={styles.container}>
      <Header title='Workout Journal'/>
      <Content padder>
        {sortItems(items).map((item) => {
          return (
            <LogEntry item={item} deleteWorkout={deleteWorkout} modifyWorkout={modifyWorkout} modifyDateTime={modifyDateTime} key={item.id} />
          )
        })}
      </Content>
      <View style={styles.button}>
        <AddLogButton addLog={addItem}/>
      </View>
    </View>
  );
  };

  const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    top: 12, 
    right: 5,
  },
});

export default App;
