import React, { useState } from 'react';
import { Content, Button } from 'native-base';
import { Modal, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Header from './Header';

const AddLogButton = ({ addLog }) => {
   const [modalVisible, setModal] = useState(false);
   const defaultTime = {
      date: '',
      start: '',
      end: '',
   };
   const defaultWorkout = {
      id: uuid(),
      name: '', 
      sets: [],
      notes: '',
   };
   const defaultSet = {
      id: uuid(),
      reps: '',
      weight: '',
   };
   const [time, setTime] = useState(defaultTime);
   const [workout, setWorkout] = useState(defaultWorkout);
   const [workoutList, setWList] = useState([]);
   const [setList, setSList] = useState([]);
   const [set, setSet] = useState(defaultSet);
   //Handles time attribute
   const onChangeDate = (dateValue) => setTime({...time, date: dateValue });
   const onChangeStart = (startValue) => setTime({...time, start: startValue });
   const onChangeEnd = (endValue) => setTime({...time, end: endValue });
   //Handles workouts attribute
   const onChangeWorkoutID = (id) => setWorkout({...workout, id: id});
   const onChangeName = (nameValue) => setWorkout({...workout, name: nameValue});
   const addSetList = (setVal) => setSList(oldList => [...oldList, setVal]);
   const addWorkoutList = (setValue, workoutVal) => { workoutVal.sets = setValue, setWList(oldList => [...oldList, workoutVal]), setSList([]) };
   const onChangeSetID = (id) => setSet({...set, id: id});
   const onChangeReps = (repValue) => setSet({...set, reps: repValue });
   const onChangeWeight = (weightValue) => setSet({...set, weight: weightValue });
   const onChangeNotes = (note) => setWorkout({...workout, notes: note});

   const toggleModal = (visible) => {
      setModal(visible);
   };

   return (
      <View style = {styles.container}>
         <Modal animationType = {"slide"} transparent = {false}
            visible = {modalVisible}
            onRequestClose = {() => { toggleModal(!modalVisible) } }>
            
            <View style = {styles.modal}>
               <Header title='Add a Log'/>
               <Content>
                  <Text style={styles.header}> Time: </Text>
                  <TextInput placeholder="Set Date: [Month] [Day], [Year]..." style={styles.input} onChangeText={onChangeDate} />
                  <TextInput placeholder="Set Start Time: ..." style={styles.input} onChangeText={onChangeStart} />
                  <TextInput placeholder="Set End Time..." style={styles.input} onChangeText={onChangeEnd} />

                  <Text style={styles.header}> Workout: </Text>
                  <TextInput placeholder="Enter Exercise Name..." style={styles.input} onChangeText={onChangeName} />
                  <TextInput keyboardType="numeric" placeholder="Enter Number of Reps..." style={styles.input} onChangeText={onChangeReps} />
                  <TextInput keyboardType="numeric" placeholder="Enter the Weight..." style={styles.input} onChangeText={onChangeWeight} />
                  <TextInput placeholder="Notes..." style={styles.input} onChangeText={onChangeNotes} />
                  <View style={styles.buttonView}>
                     <TouchableOpacity style={styles.set} onPress={() => { 
                        onChangeSetID(uuid()),
                        addSetList(set),
                        console.log(set) }}>
                        <Text style={styles.buttonText}>Add Set</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.workout} onPress={() => {
                        onChangeWorkoutID(uuid()), 
                        addWorkoutList(setList, workout),
                        console.log(workout) }}>
                        <Text style={styles.buttonText}>Set Workout</Text>
                     </TouchableOpacity>
                  </View>
               </Content>

               <TouchableOpacity style={styles.finish} onPress={() => {
                  if((time.date == '' && time.start == '' && time.end == '') || (workout.name == '' && workout.sets == [])) {
                     Alert.alert("Please fill everything out!")
                  } else {
                     { addLog(time, workoutList), toggleModal(!modalVisible) }
                  }}}>
                  <Text style={styles.header}>Finish</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.cancel} onPress={() => { toggleModal(!modalVisible) }}>
                  <Text style={styles.cancelText}>Cancel</Text>
               </TouchableOpacity>
            </View>
         </Modal>
         
         <Button style={ styles.addButton } bordered primary onPress = {() => {toggleModal(true), setWorkout(defaultWorkout), setSet(defaultSet), setTime(defaultTime), setSList([]), setWList([])}}>
            <Text style={styles.title}>Add</Text>
         </Button>
      </View>
   );
};

export default AddLogButton;

const styles = StyleSheet.create ({
   container: {
      flex: 1
   },
   input: {
      height: 60,
      padding: 8,
      fontSize: 16,
   },
   modal: {
      flex: 1,
   },
   finish: {
      position: 'absolute',
      bottom: 10, 
      right: 10,
   },
   addButton: {
      backgroundColor: "#2C95FF",
      width: 70,
      height: 35,
      borderColor: "white",
      justifyContent: "center",
   },
   buttonView: {
      flexDirection: "row",
   },
   set: {
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      left: 10,
   },
   workout: {
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      left: 90,
   },
   setList:{
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      left: 55,
   },
   cancel: {
      position: 'absolute',
      bottom: 10, 
      left: 10,
   },
   header: {
      marginTop: 10,
      fontSize: 20
   },
   buttonText: {
      marginLeft: 3,
      marginRight: 3,
      color: "white",
      fontSize: 20,
   },
   icon: {
      padding: 20,
   },
   title: {
      color: '#fff',
      fontSize: 20,
   },
   cancelText: {
      marginTop: 10,
      fontSize: 20,
      color: 'red',
   }
})