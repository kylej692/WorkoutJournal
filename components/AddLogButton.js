import React, { useState } from 'react';
import { Content, Button } from 'native-base';
import { Modal, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Header from './Header';
import DateTimePicker from '@react-native-community/datetimepicker';

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
   //Handles time attribute
   const onChangeDate = (dateValue) => setTime({...time, date: dateValue });
   const onChangeStart = (startValue) => setTime({...time, start: startValue });
   const onChangeEnd = (endValue) => setTime({...time, end: endValue });
   //Handles workouts attribute
   const onChangeWorkoutID = (id) => setWorkout({...workout, id: id});
   const onChangeName = (nameValue) => setWorkout({...workout, name: nameValue });
   const addSetList = (setVal) => setSList(oldList => [...oldList, setVal]);
   const addWorkoutList = (setValue, workoutVal) => { workoutVal.sets = setValue, setWList(oldList => [...oldList, workoutVal]), setSList([]) };
   const onChangeSetID = (id) => setSet({...set, id: id });
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

   const timeConvertTo12 = (time) => {
      var hour = parseInt(time.slice(0, 2));
      var minute = time.slice(3, 5);
      var meridiem;
      
      if(hour == 12) {
          meridiem = "pm";
      } else if(hour == 0) {
          hour = 12;
          meridiem = "am";
      } else if (hour > 12) {
          hour = hour - 12;
          meridiem = "pm";
      } else {
          meridiem = "am";
      }

      return hour + ":" + minute + meridiem;
   };

   const [date, setDate] = useState(new Date(1598051730000));
   const [mode, setMode] = useState('date');
   const [show, setShow] = useState(false);
   const [isStart, setIsStart] = useState(true)

   const onChange = (event, selectedDate) => {
      const currentDate = selectedDate || date;
      const currentDateTimeStr = currentDate.toString(0, 21);
      const monthDayStr = currentDateTimeStr.slice(4, 10);
      const yearStr = currentDateTimeStr.slice(11, 15);
      const dateStr = monthDayStr + ", " + yearStr;
      const timeStr = currentDateTimeStr.slice(16, 21);
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
      onChangeDate(dateStr);
      if (mode == 'time') {
         if (isStart) {
            onChangeStart(timeConvertTo12(timeStr));
         } else {
            onChangeEnd(timeConvertTo12(timeStr));
         }
      }
      console.log(time);
   };

   const showMode = currentMode => {
      setShow(true);
      setMode(currentMode);
   };

   const showDatepicker = () => {
      showMode('date');
   };

   const showTimepicker = (isStart) => {
      showMode('time');
      setIsStart(isStart);
   };

   return (
      <View style = {styles.container}>
         <Modal animationType = {"slide"} transparent = {false}
            visible = {modalVisible}
            onRequestClose = {() => { toggleModal(!modalVisible) } }>
            
            <View style = {styles.modal}>
               <Header title='Add a Log'/>
               <Content>
                  <View>
                     <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.time} onPress={showDatepicker}>
                              <Text style={styles.buttonText}> Set Date</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.time} onPress={() => {showTimepicker(true)}}>
                              <Text style={styles.buttonText}> Set Start Time</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.time} onPress={() => {showTimepicker(false)}}>
                              <Text style={styles.buttonText}> Set End Time</Text>
                        </TouchableOpacity>
                        {show && (
                           <DateTimePicker
                              testID="dateTimePicker"
                              value={date}
                              mode={mode}
                              is24Hour={false}
                              display="default"
                              onChange={onChange}
                           />
                        )}
                     </View>
                     <Text style={styles.header}> Workout: </Text>
                     <TextInput placeholder="Enter Exercise Name" style={styles.input} onChangeText={onChangeName} />
                     <View style={{borderColor:'blue',borderBottomWidth:1,borderTopWidth:1}}>
                        <TextInput keyboardType="numeric" placeholder="Enter Number of Reps" style={styles.input} onChangeText={onChangeReps} />
                        <TextInput keyboardType="numeric" placeholder="Enter the Weight (lbs)" style={styles.input} onChangeText={onChangeWeight} />
                        <View style={styles.buttonView}>
                           <TouchableOpacity style={styles.set} onPress={() => { 
                              if (set.reps == '' || set.weight == '') {
                                 Alert.alert("Can't add a blank set")
                              } else {
                                 { onChangeSetID(uuid()), addSetList(set) }
                              }}}>
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
                     if(time.date == '' || time.start == '' || time.end == '' || workout.name == '' || workoutList.length == 0) {
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
      left: 315,
   },
   time: {
      backgroundColor: "#2C95FF",
      marginHorizontal: 5,
      padding: 5,
      borderRadius: 10,
      bottom: -10,
      left: 4,
   },
   workout: {
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      bottom: 5,
      left: 275,
   },
   cancel: {
      position: 'absolute',
      bottom: 15, 
      left: 10,
   },
   header: {
      marginTop: 20,
      fontSize: 20
   },
   buttonText: {
      marginLeft: 3,
      marginRight: 5,
      color: "white",
      fontSize: 19,
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