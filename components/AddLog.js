import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import 'react-native-get-random-values';
import Header from './Header';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import AddLogPicker from './AddLogPicker';
import SetDateTime from './SetDateTime'
import Routine from './Routine'
import AddLogSetWorkoutView from './AddLogSetWorkoutView';
import { db } from '../Database.js';

const AddLog = ({ routine, setRoutine, pressedRoutine, setPressedRoutine, setRoutineModalVisible, toggleInfoModal, addLog, addRoutine, unitSystem }) => {
   
   const defaultTime = {
      date: '',
      start: '',
      end: '',
   };

   const [modalVisible, setModal] = useState(false);
   const [time, setTime] = useState(defaultTime);
   const [date, setDate] = useState(new Date());
   const [workoutList, setWList] = useState([]);
   const [setList, setSList] = useState([]);
   const [note, setNote] = useState('');
   const [displayDate, setDisplayDate] = useState(false);
   const [displayTime, setDisplayTime] = useState(false);
   const [displaySetWorkout, setDisplaySetWorkout] = useState(true);
   const [createRoutine, setCreateRoutine] = useState(false);
   const [routineName, setRoutineName] = useState('');
   
   const clearNote = () => {
      setNote('');
   };
   const toggleModal = (visible) => {
      setModal(visible);
   };
   
   return (
      <View style = {styles.container}>
         <Modal 
            animationType = {"slide"} 
            transparent = {false}
            visible = {modalVisible}
            onRequestClose = {() => { 
               toggleModal(!modalVisible)
               setCreateRoutine(false)
               setPressedRoutine(false) 
            } 
         }>  
            <View style = {styles.modal}>
               <AddLogPicker 
                  setCreateRoutine={setCreateRoutine} 
                  setPressedRoutine={setPressedRoutine} 
                  setRoutineName={setRoutineName}
               />
               {(!createRoutine || pressedRoutine) &&
                  <SetDateTime 
                     date={date} 
                     setDate={setDate} 
                     time={time} 
                     setTime={setTime} 
                     setDisplayDate={setDisplayDate} 
                     setDisplayTime={setDisplayTime} 
                  />
               }
               {pressedRoutine &&
                  <View>
                     <View style={styles.dateHeaderRoutineView}> 
                        <Text style={styles.dateHeaderTitle}>DATE:</Text>
                        {displayDate && 
                           <Text style={styles.dateHeaderText}>{time.date}</Text>
                        }
                        {displayTime && 
                           <Text style={styles.timeHeaderText}>{time.start + " - " + time.end}</Text>
                        }
                     </View>
                     <Routine 
                        setModal={setModal}
                        routine={routine} 
                        setPressedRoutine={setPressedRoutine}
                        setRoutine={setRoutine} 
                        routineName={routineName} 
                        toggleInfoModal={toggleInfoModal} 
                        setRoutineModalVisible={setRoutineModalVisible}
                        unitSystem={unitSystem} 
                     />
                  </View>
               }
               {!pressedRoutine &&
                  <AddLogSetWorkoutView 
                     setList={setList}
                     setSList={setSList}
                     note={note}
                     displaySetWorkout={displaySetWorkout}
                     workoutList={workoutList}
                     setWList={setWList}
                     setNote={setNote}
                     createRoutine={createRoutine}
                     unitSystem={unitSystem}
                     displayDate={displayDate}
                     displayTime={displayTime}
                     time={time}
                     setDisplaySetWorkout={setDisplaySetWorkout}
                     setRoutineName={setRoutineName}
                  />
               }
               <View style={styles.footer}>
                  <Header/>
                     <TouchableOpacity style={styles.finish} onPress={() => {
                        if(!createRoutine && !pressedRoutine){
                           if(time.date == '' || time.start == '' || time.end == '' || workoutList.length == 0) {
                              Alert.alert("Please fill everything out!")
                           } else {
                              { 
                                 addLog(time, workoutList); 
                                 toggleModal(!modalVisible); 
                                 setDisplaySetWorkout(true); 
                                 setDisplayDate(false);
                                 setDisplayTime(false); 
                                 setDate(new Date()); 
                              }
                           } 
                        } else if(createRoutine){
                           db.findOne({ routineName: routineName }, function(err, doc) {
                              if(doc != null && createRoutine) {
                                 Alert.alert("Routine name already exists!");
                              } else if(routineName == '' || workoutList.length == 0) {
                                 Alert.alert("Please fill everything out!")
                              } else {
                                 { 
                                    addRoutine(routineName, workoutList); 
                                    toggleModal(!modalVisible); 
                                    setDisplaySetWorkout(true); 
                                    setDisplayDate(false); 
                                    setDisplayTime(false); 
                                    setDate(new Date()); 
                                    setCreateRoutine(false);
                                 }
                              }
                           })
                        } else if(pressedRoutine) {
                           if(time.date == '' || time.start == '' || time.end == '' || routine.workouts.length == 0) {
                              Alert.alert("Please fill everything out!")
                           } else {
                              { 
                                 addLog(time, routine.workouts);
                                 toggleModal(!modalVisible); 
                                 setDisplaySetWorkout(true); 
                                 setDisplayDate(false); 
                                 setDisplayTime(false); 
                                 setDate(new Date()); 
                                 setPressedRoutine(false); 
                              }
                           } 
                        }
                        }}>
                        <Text style={styles.finishText}>Finish</Text>
                     </TouchableOpacity>
                     <TouchableOpacity 
                        style={styles.cancel} 
                        onPress={() => { 
                              toggleModal(!modalVisible); 
                              setDisplaySetWorkout(true); 
                              setDisplayDate(false); 
                              setDisplayTime(false);
                              clearNote();
                              setDate(new Date()); 
                              setCreateRoutine(false); 
                              setPressedRoutine(false);
                           }
                        }
                     >
                        <Text style={styles.cancelText}>Cancel</Text>
                     </TouchableOpacity>
               </View>
            </View>
         </Modal>
         
         <TouchableOpacity 
            style={ styles.addButton } 
            onPress = {() => {
                  toggleModal(true); 
                  setTime(defaultTime);
                  setSList([]);
                  setWList([]); 
                  clearNote();
               }
            }
         >
            <Icon style={styles.addLogIcon} name="plus-square" size={25} />   
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create ({
   container: {
      flex: 1
   },
   addLogIcon: { 
      color: "white" 
   },
   modal: {
      flex: 1,
   },
   finish: {
      position: "absolute",
      bottom: 15, 
      right: 10,
   },
   addButton: {
      marginTop: 7,
      marginRight: 10
   },
   cancel: {
      position: "absolute",
      bottom: 15, 
      left: 10,
   },
   header: {
      marginTop: 20,
      fontSize: 20,
      color: "black"
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
      color: "white",
   },
   finishText: {
      marginTop: 10,
      fontSize: 20,
      color: "white",
   },
   dateHeaderRoutineView: {
      position: "absolute",
      flexDirection: "row",
      alignItems: "stretch",
      backgroundColor: "#A4D1FF",
      height: 40,
      width: 415
   },
   dateHeaderTitle: {
      color: "black",
      padding: 8,
      marginLeft: 10,
      fontSize: 16
   },
   dateHeaderText: {
      padding: 8,
      marginLeft: 5,
      fontSize: 16
   },
   timeHeaderText: {
      position: "absolute",
      padding: 8,
      fontSize: 16,
      right: 10
   },
   footer: { 
      position: 'absolute', 
      height: 60, 
      width: 412, 
      bottom: 0 
   }
});

export default AddLog;