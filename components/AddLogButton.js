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
      num: 1,
      reps: '',
      weight: '',
   };
   const [time, setTime] = useState(defaultTime);
   const [workout, setWorkout] = useState(defaultWorkout);
   const [workoutList, setWList] = useState([]);
   const [setList, setSList] = useState([]);
   const [set, setSet] = useState(defaultSet);
   //const [setCount, setSetCount] = useState(0);
   //Handles time attribute
   const onChangeDate = (dateValue) => setTime({...time, date: dateValue });
   const onChangeStart = (startValue) => setTime({...time, start: startValue });
   const onChangeEnd = (endValue) => setTime({...time, end: endValue });
   //Handles workouts attribute
   const onChangeWorkoutID = (id) => setWorkout({...workout, id: id});
   const onChangeName = (nameValue) => setWorkout({...workout, name: nameValue});
   const addSetList = (setVal) => setSList(oldList => [...oldList, setVal]);
   const addWorkoutList = (setValue, workoutVal) => { workoutVal.sets = setValue, setWList(oldList => [...oldList, workoutVal]), setSList([]) };
   const onChangeSetID = (id, count) => setSet({...set, id: id, num: count});
   const onChangeReps = (repValue) => setSet({...set, reps: repValue });
   const onChangeWeight = (weightValue) => setSet({...set, weight: weightValue });
   const onChangeNotes = (note) => setWorkout({...workout, notes: note});

   const toggleModal = (visible) => {
      setModal(visible);
   };

   const setSetCount = (workoutList) => {
      for(var j = 0; j < workoutList.length; j++) {
         for (var i = 0; i < workoutList[j].sets.length; i++) {
            workoutList[j].sets[i].num = i + 1;
         }
      }
   }

   return (
      <View style = {styles.container}>
         <Modal animationType = {"slide"} transparent = {false}
            visible = {modalVisible}
            onRequestClose = {() => { toggleModal(!modalVisible) } }>
            
            <View style = {styles.modal}>
               <Header title='Add a Log'/>
               <Content>
                  <Text style={styles.header}> Time: </Text>
                  <TextInput placeholder="Set Date: [Month] [Day], [Year]" style={styles.input} onChangeText={onChangeDate} />
                  <TextInput placeholder="Start Time: (e.g. 9:00am)" style={styles.input} onChangeText={onChangeStart} />
                  <TextInput placeholder="End Time: (e.g. 10:00am)" style={styles.input} onChangeText={onChangeEnd} />

                  <View style={{borderColor:'black',borderBottomWidth:1,borderTopWidth:1}}>
                     <Text style={styles.header}> Workout: </Text>
                     <TextInput placeholder="Enter Exercise Name" style={styles.input} onChangeText={onChangeName} />
                     <View style={{borderColor:'blue',borderBottomWidth:1,borderTopWidth:1}}>
                        <TextInput keyboardType="numeric" placeholder="Enter Number of Reps" style={styles.input} onChangeText={onChangeReps} />
                        <TextInput keyboardType="numeric" placeholder="Enter the Weight (lbs)" style={styles.input} onChangeText={onChangeWeight} />
                        <View style={styles.buttonView}>
                           <TouchableOpacity style={styles.set} onPress={() => { 
                              onChangeSetID(uuid()),   
                              addSetList(set) }}>
                              <Text style={styles.buttonText}>Add Set</Text>
                           </TouchableOpacity>
                        </View>
                     </View> 
                     <TextInput placeholder="Notes" style={styles.input} onChangeText={onChangeNotes} />
                     <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.workout} onPress={() => {
                           if (setList.length == 0) {
                              Alert.alert("Please add one or more sets for your workout!")
                           } else {
                              { onChangeWorkoutID(uuid()), addWorkoutList(setList, workout) }
                           }}}>
                           <Text style={styles.buttonText}>Set Workout</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </Content>
                  
               <Header/>
                  <TouchableOpacity style={styles.finish} onPress={() => {
                     if(time.date == '' || time.start == '' || time.end == '' || workout.name == '' || workoutList.length == 0 || workout.notes == '') {
                        Alert.alert("Please fill everything out!")
                     } else {
                        { setSetCount(workoutList), addLog(time, workoutList), toggleModal(!modalVisible) }
                     }}}>
                     <Text style={styles.finishText}>Finish</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancel} onPress={() => { 
                     toggleModal(!modalVisible) }}>
                     <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

            </View>
         </Modal>
         
         <Button style={ styles.addButton } bordered primary onPress = {() => {
            toggleModal(true), 
            setWorkout(defaultWorkout), 
            setSet(defaultSet), 
            setTime(defaultTime), 
            setSList([]), 
            setWList([]) }}>
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
      bottom: 15, 
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
      borderRadius: 10,
      bottom: 5,
      left: 310,
   },
   workout: {
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      bottom: 5,
      left: 270,
   },
   cancel: {
      position: 'absolute',
      bottom: 15, 
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
      color: 'white',
   },
   finishText: {
      marginTop: 10,
      fontSize: 20,
      color: 'white',
   }
})