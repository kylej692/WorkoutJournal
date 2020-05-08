import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import Header from './components/Header';
import LogEntry from './components/LogEntry';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const App = () => {
  const [items, setItems] = useState([
    {id: uuid(), time: {date: "May 2, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Bench Press', sets: [{id: uuid(), reps: 10, weight: 20}, {id: uuid(), reps: 8, weight: 30}, {id: uuid(), reps: 6, weight: 35}]}, {id: uuid(), name: 'Inclined Bench Press', sets: [{id: uuid(), reps: 10, weight: 35}, {id: uuid(), reps: 10, weight: 35}]}]},
    {id: uuid(), time: {date: "May 4, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Bicep Curls', sets: [{id: uuid(), reps: 10, weight: 20}, {id: uuid(), reps: 8, weight: 30}, {id: uuid(), reps: 6, weight: 35}]}, {id: uuid(), name: 'Tricep Extensions', sets: [{id: uuid(), reps: 12, weight: 25}, {id: uuid(), reps: 10, weight: 20}]}]},
    {id: uuid(), time: {date: "May 6, 2020", start: "12:00pm", end: "1:00pm"}, workouts: [{id: uuid(), name: 'Pull-ups', sets: [{id: uuid(), reps: 10, weight: 20}, {id: uuid(), reps: 8, weight: 30}]}]}
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

  return (
    <View style={styles.container}>
      <Header title='Workout Journal'/>
      <FlatList 
        data={items} 
        renderItem={({item}) => <LogEntry item={item} deleteItem={deleteItem} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
