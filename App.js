import React, {useState} from 'react';
import {View, StyleSheet, Alert } from 'react-native';
import { Content } from 'native-base';
import Header from './components/Header';
import LogEntry from './components/LogEntry';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const App = () => {
  const [items, setItems] = useState([
    {id: uuid(), time: {date: "May 2, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Bench Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Inclined Bench Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 35}, {id: uuid(), num: 2, reps: 10, weight: 35}], notes: ""}]},
    {id: uuid(), time: {date: "May 4, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Bicep Curls', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Tricep Extensions', sets: [{id: uuid(), num: 1, reps: 12, weight: 25}, {id: uuid(), num: 2, reps: 10, weight: 20}], notes: ""}]},
    {id: uuid(), time: {date: "May 6, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Overhead Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Military Press', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}]},
    {id: uuid(), time: {date: "May 8, 2020", start:"1:00pm", end:"2:00pm"}, workouts:[{id: uuid(), name: 'Squats', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}, {id: uuid(), name: 'Front Squats', sets: [{id: uuid(), num: 1, reps: 10, weight: 20}, {id: uuid(), num: 2, reps: 8, weight: 30}, 
      {id: uuid(), num: 3, reps: 6, weight: 35}], notes: ""}]}
  ]);

  const deleteItem = (id) => {
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

  return (
    <View style={styles.container}>
      <Header title='Workout Journal'/>
      <Content padder>
        {items.map((item) => {
          return (
            <LogEntry item={item} deleteItem={deleteItem} modifyWorkout={modifyWorkout} key={item.id} />
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
