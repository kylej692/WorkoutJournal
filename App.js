import React, {useState} from 'react';
import {View, StyleSheet, Alert } from 'react-native';
import { Content } from 'native-base';
import Header from './components/Header';
import LogEntry from './components/LogEntry';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const App = () => {
  const [items, setItems] = useState([
    {id: uuid(), time: {date: "May 02, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Bench Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Inclined Bench Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 35}, {id: uuid(), num: 2, reps: 10, weight: 35}], notes: ""}]},
    {id: uuid(), time: {date: "May 04, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Bicep Curls', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Tricep Extensions', sets: [{id: uuid(), num: 1, reps: 12, weight: 25}, {id: uuid(), num: 2, reps: 10, weight: 20}], notes: ""}]},
    {id: uuid(), time: {date: "May 06, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Overhead Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Military Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}]},
    {id: uuid(), time: {date: "May 08, 2020", start:"1:00pm", end:"2:00pm"}, workouts:[{id: uuid(), name: 'Squats', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Front Squats', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}]}
  ]);

  const sortItems = (items) => {
    const sorted = [...items].sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month1 = months.indexOf(a.time.date.slice(0, 3));
      const day1 = parseInt(a.time.date.slice(4, 6));
      const year1 = parseInt(a.time.date.slice(8, 12));
      const month2 = months.indexOf(b.time.date.slice(0, 3));
      const day2 = parseInt(b.time.date.slice(4, 6));
      const year2 =parseInt(b.time.date.slice(8, 12));
      
      var date1 = new Date(year1, month1, day1);
      var date2 = new Date(year2, month2, day2);

      if (date1 < date2) {
        return 1;
      } else if (date1 == date2) {

        const time1 = a.time.start;
        const time2 = b.time.start;
        if (time1.includes("am") && time2.includes("pm")){
          return 1;
        } else if((time1.includes("am") && time2.includes("am")) || (time1.includes("pm") && time2.includes("pm"))) {
          var hour1 = parseInt(time1.slice(0, 2));
          var minute1 = parseInt(time1.slice(3, 5));
          var hour2 = parseInt(time2.slice(0, 2));
          var minute2 = parseInt(time2.slice(3, 5));
  
          if (hour1 < hour2){
            return 1;
          } else if (hour1 == hour2) {
            if (minute1 < minute2) {
              return 1;
            } else if (minute1 == minute2) {
              return 0;
            } else {
              return -1;
            }
          } else {
            return -1;
          }
  
        } else {
          return -1;
        }

      } else {
        return -1;
      }
    })
    return sorted;
  }

  const deleteWorkout = (id) => {
    setItems(prevItems => {
      var emptyItemId = null;
      prevItems.map((item) => {
        item.workouts = item.workouts.filter(workout => workout.id != id);
        if(item.workouts.length == 0) {
          emptyItemId = item.id;
        };
      });
      return prevItems.filter(item => item.id != emptyItemId);
    });
  };

  const addItem = (text) => {
    if(!text) {
      Alert.alert("Please enter a workout!")
    } else {
      setItems(prevItems => {
        return [{id: uuid(), text}, ...prevItems];
      })
    }
  }

  const modifyWorkout = (modifiedWorkout) => {
    setItems(prevItems => {
      for(var i = 0; i < prevItems.length; i++) {
        for(var j = 0; j < prevItems[i].workouts.length; j++) {
          if(prevItems[i].workouts[j].id == modifiedWorkout.id) {
            prevItems[i].workouts[j] = modifiedWorkout
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
