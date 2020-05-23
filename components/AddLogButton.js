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
      id: '',
      name: '', 
      sets: [],
   };
   const defaultSet = {
      id: '',
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
   const onChangeWorkoutID = () => setWorkout({...workout, id: uuid()});
   const onChangeName = (nameValue) => setWorkout({...workout, name: nameValue});
   const addSetList = (setVal) => setSList(oldList => [...oldList, setVal]);
   const addWorkoutList = (workoutVal) => setWList(oldList => [...oldList, workoutVal]);
   const onChangeSet = (setValue) => setWorkout({...workout, sets: setValue });
   const onChangeSetID = () => setSet({...set, id: uuid()});
   const onChangeReps = (repValue) => setSet({...set, reps: repValue });
   const onChangeWeight = (weightValue) => setSet({...set, weight: weightValue });

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
                  <Text style={styles.buttonText}>Time: </Text>
                  <TextInput placeholder="Set Date..." style={styles.input} onChangeText={onChangeDate} />
                  <TextInput placeholder="Set Start Time..." style={styles.input} onChangeText={onChangeStart} />
                  <TextInput placeholder="Set End Time..." style={styles.input} onChangeText={onChangeEnd} />

                  <Text style={styles.buttonText}>Workout: </Text>
                  <TextInput placeholder="Enter Exercise Name..." style={styles.input} onChangeText={onChangeName} />
                  <TextInput placeholder="Enter Number of Reps..." style={styles.input} onChangeText={onChangeReps} />
                  <TextInput placeholder="Enter the Weight..." style={styles.input} onChangeText={onChangeWeight} />
                  <View style={styles.buttonView}>
                     <TouchableOpacity style={styles.set} onPress={() => { 
                        onChangeSetID,
                        addSetList(set),
                        onChangeSet(setList) }}>
                        <Text style={styles.buttonText}><Icon name="pluscircle" size={25} />Finish Set</Text>
                     </TouchableOpacity>
                     <TouchableOpacity style={styles.workout} onPress={() => { 
                        onChangeWorkoutID, 
                        addWorkoutList(workout) }}>
                        <Text style={styles.buttonText}><Icon name="pluscircle" size={25} />Set Workout</Text>
                     </TouchableOpacity>
                  </View>
               </Content>

               <TouchableOpacity style={styles.finish} onPress={() => {
                  if( time.date == '' && time.start == '' && time.end == '' ) {
                     Alert.alert("Can't add a blank log!")
                  } else {
                     { console.log(setList, workoutList), addLog(time, workoutList), toggleModal(!modalVisible) }
                  }}}>
                  <Text style={styles.buttonText}><Icon name="pluscircle" size={25} />Finish</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.cancel} onPress={() => { toggleModal(!modalVisible) }}>
                  <Text style={styles.buttonText}><Icon name="closecircle" size={25} />Cancel</Text>
               </TouchableOpacity>
            </View>
         </Modal>
         
         <Button style={ styles.addButton } bordered primary onPress = {() => {toggleModal(true), setTime(defaultTime), setSList([])}}>
            <Text style={styles.text}>Add</Text>
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
      left: 10,
   },
   workout: {
      left: 155,
   },
   cancel: {
      position: 'absolute',
      bottom: 10, 
      left: 10,
   },
   text: {
      color: '#fff',
      fontSize: 20,
   },
   buttonText: {
      marginTop: 10,
      fontSize: 20
   },
   icon: {
      margin: 20,
   }
})