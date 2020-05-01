import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import Header from './components/Header';
import ListItem from './components/ListItem';
import AddItem from './components/AddItem';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const App = () => {
  const [items, setItems] = useState([
    {id: uuid(), text: 'Bench Press'},
    {id: uuid(), text: 'Squats'},
    {id: uuid(), text: 'Deadlift'},
    {id: uuid(), text: 'Overhead Press'}
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
