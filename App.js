import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import Header from './components/Header';
import ListItem from './components/ListItem';
import AddItem from './components/AddItem';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const App = () => {
  const [items, setItems] = useState([
    {id: uuid(), workouts: [{name: 'Bench Press', sets: [{reps: 10, weight: 20}, {reps: 8, weight: 30}, {reps: 6, weight: 35}]}, {name: 'Inclined Bench Press', sets: [{reps: 10, weight: 35}, {reps: 10, weight: 35}]}]},
    {id: uuid(), workouts: [{name: 'Bench Press', sets: [{reps: 10, weight: 20}, {reps: 8, weight: 30}, {reps: 6, weight: 35}]}]},
    {id: uuid(), workouts: [{name: 'Bench Press', sets: [{reps: 10, weight: 20}, {reps: 8, weight: 30}]}]}
  ]);

  const deleteItem = (id) => {
    setItems(prevItems => {
      return prevItems.filter(item => item.id != id);
    });
  };

  const addItem = (text) => {
    if(!text) {
      Alert.alert('Please enter a workout!')
    } else {
      setItems(prevItems => {
        return [{id: uuid(), text}, ...prevItems];
      })
    }
  }

  return (
    <View style={styles.container}>
      <Header title='Workout Journal'/>
      <AddItem addItem={addItem} />
      <FlatList 
        data={items} 
        renderItem={({item}) => <ListItem item={item} deleteItem={deleteItem} />}
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
