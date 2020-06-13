import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import Header from './components/Header';
import LogEntry from './components/LogEntry';
import AddLogButton from './components/AddLogButton';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const App = () => {
  const log = {
    id: '',
    time: {}, 
    workouts: [],
  };

  const [items, setItems] = useState([]);

  const deleteItem = (id) => {
    setItems(prevItems => {
      return prevItems.filter(item => item.id != id);
    });
  };

  const addItem = (time, workouts) => {
    if(!time || !workouts) {
      Alert.alert("Please enter a workout!")
    } else {
      setItems(prevItems => {
        return [ {id: uuid(), time: time, workouts: workouts}, ...prevItems];
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
