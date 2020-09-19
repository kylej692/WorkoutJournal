import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { Modal, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ToastAndroid } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Header from './Header';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { SwipeListView } from 'react-native-swipe-list-view';
import AddLogPicker from './AddLogPicker';
import SetDateTime from './SetDateTime'

const AddLogButton = ({ addLog, addRoutine, unitSystem, db }) => {
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

   const [modalVisible, setModal] = useState(false);
   const [time, setTime] = useState(defaultTime);
   const [date, setDate] = useState(new Date());
   const [workout, setWorkout] = useState(defaultWorkout);
   const [workoutList, setWList] = useState([]);
   const [setList, setSList] = useState([]);
   const [set, setSet] = useState(defaultSet);
   const [workoutId, setWorkoutId] = useState('');
   const [wName, setWName] = useState('');
   const [note, setNote] = useState('');
   const [rep, setRep] = useState('');
   const [weight, setWeight] = useState('');
   const [selectedSetNumber, setSetNumber] = useState(1);
   const [displayDate, setDisplayDate] = useState(false);
   const [displayTime, setDisplayTime] = useState(false);
   const [displaySetWorkout, setDisplaySetWorkout] = useState(true);
   const [createRoutine, setCreateRoutine] = useState(false);
   const [pressedRoutine, setPressedRoutine] = useState(false);
   const [routineName, setRoutineName] = useState('');

   //Handles workouts attribute
   const onChangeWorkoutID = (id) => setWorkout({...workout, id: id});

   const onChangeName = (nameValue) => { 
      setWorkout({...workout, name: nameValue });
      setWName(nameValue);
   };

   const addSetList = (setVal) => setSList(oldList => [...oldList, setVal]);

   const addWorkoutList = (setValue, workoutVal) => { 
      workoutVal.sets = setValue;
      setWList(oldList => [...oldList, workoutVal]);
      setSList([]); 
   };

   const onChangeSetID = (id) => setSet({...set, id: id });

   const onChangeReps = (repValue) => { 
      setSet({...set, num: setList.length + 1, reps: repValue });
      setRep(repValue);
   };

   const onChangeWeight = (weightValue) => { 
      setSet({...set, weight: weightValue });
      setWeight(weightValue);
   };

   const onChangeNotes = (note) => { 
      setWorkout({...workout, notes: note});
      setNote(note);
   };
   
   //For text inputs
   const clearName = () => {
      setWName('');
   };
   const clearNote = () => {
      setNote('');
   };
   const clearRep = () => {
      setRep('');
   };
   const clearWeight = () => {
      setWeight('');
   };

   const toggleModal = (visible) => {
      setModal(visible);
   };

   const notifyMessage = (msg) => {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
   };

   const deleteSet = (setId) => {
      setSList(prevSets => {
         var newSets = prevSets.filter(set => set.id != setId);
         for (var i = 0; i < newSets.length; i++) {
            newSets[i].num = i + 1;
         }
         return newSets;
      });
  };

   const modifyWorkoutList = (workoutId, workoutList) => {
      for(var i = 0; i < workoutList.length; i++) {
         if (workoutList[i].id == workoutId) {
            workoutList[i].name = wName;
            workoutList[i].sets = setList;
            workoutList[i].notes = note;
         }
      }
      setWList(workoutList);
   };

   const modifyReps = (newReps) => {
      setList[selectedSetNumber - 1].reps = newReps;
   };

   const modifyWeight = (newWeight) => {
      setList[selectedSetNumber - 1].weight = newWeight;
   };

   const alternatingColors = ["#D7EBFF", "#C1D4E6"];
   return (
      <View style = {styles.container}>
         <Modal animationType = {"slide"} transparent = {false}
            visible = {modalVisible}
            onRequestClose = {() => { toggleModal(!modalVisible) } 
         }>  
            <View style = {styles.modal}>
               <AddLogPicker setCreateRoutine={setCreateRoutine} setPressedRoutine={setPressedRoutine} db={db} />
               <SwipeListView 
                  data={setList}
                  keyboardShouldPersistTaps={'handled'}
                  ListHeaderComponent={
                     <View style={styles.workoutView}>
                        {!createRoutine &&
                           <SetDateTime date={date} setDate={setDate} time={time} setTime={setTime} setDisplayDate={setDisplayDate} setDisplayTime={setDisplayTime} />
                        }
                        <View style={{ marginTop: 10 }}>
                           {createRoutine && <TextInput placeholder="Enter Routine Name" style={styles.routineNameInput} onChangeText={setRoutineName} />}
                           <TextInput placeholder="Enter Exercise Name" style={styles.input} onChangeText={onChangeName} value={wName} />
                        </View>
                     </View>
                  }
                  renderItem={(data, rowMap) => (
                        <View style={styles.setView} key={data.item.id}>
                           <Text style={styles.labelText}>{"SET " + data.item.num + ":"}</Text>
                           <Text style={styles.infoText}>Reps </Text>
                           <TextInput keyboardType="numeric" defaultValue={data.item.reps.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newReps) => modifyReps(newReps)} />
                           {unitSystem == "Imperial" && <Text style={styles.infoText}>Wt (lbs)</Text>}
                           {unitSystem == "Metric" && <Text style={styles.infoText}>Wt (kgs)</Text>}
                           <TextInput keyboardType="numeric" defaultValue={data.item.weight.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newWeight) => modifyWeight(newWeight)} />  
                        </View>
                  )}
                  renderHiddenItem={ (data, rowMap) => (
                        <TouchableOpacity style={styles.deleteSetBtn} onPress={() => {
                           deleteSet(data.item.id)
                        }}>
                           <View style={styles.rowFront}>
                              <Icon style={styles.deleteIcon} name="times" size={20} />    
                           </View>
                        </TouchableOpacity>  
                  )}
                  ListFooterComponent={
                     <View>
                        <View style={styles.workoutView}>
                           <View style={styles.repsWeightView}>
                              <Text style={styles.newSetText}>{"SET " + (setList.length + 1) + ": "}</Text>
                              <Text style={styles.infoText}>Reps </Text>
                              <TextInput keyboardType="numeric" style={styles.infoInput} onChangeText={onChangeReps} value={rep}/>
                              {unitSystem == "Imperial" && <Text style={styles.infoText}>Wt (lbs)</Text>}
                              {unitSystem == "Metric" && <Text style={styles.infoText}>Wt (kgs)</Text>}
                              <TextInput keyboardType="numeric" style={styles.infoInput} onChangeText={onChangeWeight} value={weight}/>
                           </View>
                           <TouchableOpacity style={styles.set} onPress={() => { 
                                 if (rep == '' || weight == '') {
                                    Alert.alert("Can't add a blank set")
                                 } else {
                                    { onChangeSetID(uuid()), addSetList(set), notifyMessage("Added set"), clearRep(), clearWeight() }
                                 }}}>
                                 <Text style={styles.buttonText}>Add Set</Text>
                           </TouchableOpacity>
                        </View>
                        <TextInput placeholder="Notes" multiline={true} style={styles.input} onChangeText={onChangeNotes} value={note} />
                        <View style={{ top: 10, borderBottomWidth: 2 }}>
                        {displaySetWorkout && 
                           <View style={styles.buttonView}>
                              <TouchableOpacity style={styles.setWorkout} 
                                 onPress={() => {
                                    if (setList.length == 0) {
                                       Alert.alert("Please add one or more sets for your workout!")
                                    } else {
                                       { onChangeWorkoutID(uuid()), addWorkoutList(setList, workout), notifyMessage("Added workout"), setWorkout(defaultWorkout), clearRep(), clearWeight(), clearName(), clearNote(), Keyboard.dismiss() }
                                    }
                                 }
                              }>
                                 <Text style={styles.buttonText}>Set Workout</Text>
                              </TouchableOpacity>
                           </View>
                        }
                        {!displaySetWorkout && 
                           <View style={styles.buttonView}>
                              <TouchableOpacity style={styles.clearWorkout} 
                                 onPress={() => {
                                    setWorkout(defaultWorkout), 
                                    setSList([]), 
                                    clearRep(), 
                                    clearWeight(), 
                                    clearName(), 
                                    clearNote(), 
                                    setDisplaySetWorkout(true), 
                                    Keyboard.dismiss() 
                                 }
                              }>
                                 <Text style={styles.buttonText}>Clear</Text>
                              </TouchableOpacity>
                              <TouchableOpacity style={styles.updateWorkout} 
                                 onPress={() => {
                                    if (setList.length == 0) {
                                       Alert.alert("Please add one or more sets for your workout!")
                                    } else {
                                       { modifyWorkoutList(workoutId, workoutList), notifyMessage("Updated workout"), setWorkout(defaultWorkout), setSList([]), clearRep(), clearWeight(), clearName(), clearNote(), setDisplaySetWorkout(true), Keyboard.dismiss() }
                                    }
                                 }
                              }>
                              <Text style={styles.buttonText}>Update Workout</Text>
                              </TouchableOpacity>
                           </View>
                        }
                        </View>
                        <View style={styles.workoutDisplayView}>
                           {(displayDate || displayTime) && 
                              <View style={styles.dateHeaderView}> 
                                 {displayDate && 
                                 <Text style={styles.dateHeaderText}>{time.date}</Text>
                                 }
                                 {displayTime && 
                                 <Text style={styles.timeHeaderText}>{time.start + " - " + time.end}</Text>
                                 }
                              </View>
                           }
                           {workoutList.map((workout, index) => {
                              return (
                                 <View style={{ backgroundColor: alternatingColors[index % alternatingColors.length] }} key={workout.id}>
                                    <TouchableOpacity 
                                       onPress={() => {
                                          setWorkoutId(workout.id);
                                          setWName(workout.name);
                                          setSList(workout.sets);
                                          setNote(workout.notes);
                                          setDisplaySetWorkout(false);
                                       }
                                    }>
                                       <Text style={styles.workoutDisplayText}>{workout.name}</Text>
                                    </TouchableOpacity>
                                    {workout.sets.map((set) => {
                                       return (
                                          <View style={{ flexDirection: "row", borderTopWidth: 1, borderColor: "#5782AB" }} key={set.id}>
                                             <Text style={styles.logPreviewHeaderText}>{"Set " + set.num + ": "}</Text>
                                             <Text style={styles.logPreviewText}>{"Reps: " + set.reps}</Text>
                                             <Text style={styles.logPreviewText}> {"Weight (lbs): " + set.weight}</Text>
                                          </View>
                                       )
                                    })}
                                    <View style={{ borderTopColor: "#5782AB", borderTopWidth: 1, borderBottomWidth: 2 }}>
                                       <Text style={styles.logPreviewHeaderText}>Notes:</Text>
                                       <Text style={styles.logPreviewText}>{workout.notes}</Text>
                                    </View>
                                 </View>
                              )
                           })}
                        </View>
                     </View>
                  }
                  disableRightSwipe={true}
                  rightOpenValue={-75}
                  removeClippedSubviews={false}
               />
               <Header/>
                  <TouchableOpacity style={styles.finish} onPress={() => {
                     if(!createRoutine){
                        if(time.date == '' || time.start == '' || time.end == '' || workoutList.length == 0) {
                           Alert.alert("Please fill everything out!")
                        } else {
                           { addLog(time, workoutList), toggleModal(!modalVisible), setDisplaySetWorkout(true), setDisplayDate(false), setDisplayTime(false), setDate(new Date()), setCreateRoutine(false) }
                        } 
                     } else if(createRoutine){
                        if(routineName == '' || workoutList.length == 0) {
                           Alert.alert("Please fill everything out!")
                        } else {
                           { addRoutine(routineName, workoutList), toggleModal(!modalVisible), setDisplaySetWorkout(true), setDisplayDate(false), setDisplayTime(false), setDate(new Date()), setCreateRoutine(false) }
                        }
                     }
                     }}>
                     <Text style={styles.finishText}>Finish</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancel} onPress={() => { 
                     toggleModal(!modalVisible), setDisplaySetWorkout(true), setDisplayDate(false), setDisplayTime(false), clearRep(), clearWeight(), clearName(), clearNote(), setDate(new Date()), setCreateRoutine(false)
                     }}>
                     <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

            </View>
         </Modal>
         
         <TouchableOpacity style={ styles.addButton } onPress = {() => {
            toggleModal(true);
            setWorkout(defaultWorkout);
            setSet(defaultSet);
            setTime(defaultTime);
            setSList([]);
            setWList([]); 
            clearRep();
            clearWeight();
            clearName();
            clearNote();
            }}>
            <Icon style={{ color: "white" }} name="plus-square" size={25} />   
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create ({
   container: {
      flex: 1
   },
   routineNameInput: {
      height: 60,
      padding: 8,
      fontSize: 16,
      left: 5,
      borderColor: "#BDBDBD",
      borderBottomWidth: 1
   },
   input: {
      height: 60,
      padding: 8,
      fontSize: 16,
      left: 5
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
   buttonView: {
      alignSelf: "center",
      flexDirection: "row",
      marginTop: 5
   },
   set: {
      backgroundColor: "#2C95FF",
      height: 35,
      width: 88,
      padding: 5,
      borderRadius: 10,
      marginBottom: 10,
      marginTop: 5,
      left: 310
   },
   setWorkout: {
      backgroundColor: "#2C95FF",
      height: 35,
      width: 125,
      padding: 5,
      borderRadius: 10,
      marginBottom: 10,
      marginTop: 5,
      left: 130
   },
   updateWorkout: {
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      bottom: 5,
      left: 85,
   },
   clearWorkout: {
      backgroundColor: "#9A9A9A",
      padding: 5,
      borderRadius: 8,
      bottom: 5,
      right: 85
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
   buttonText: {
      marginLeft: 4,
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
      color: "white",
   },
   finishText: {
      marginTop: 10,
      fontSize: 20,
      color: "white",
   },
   workoutView: {
      borderColor: "#2C95FF",
      borderBottomWidth: 1
   },
   repsWeightView: {
      flex: 1,
      flexDirection: "row"
   },
   newSetText: {
      fontSize: 20,
      padding: 10,
      marginLeft: 20,
      marginTop: 10
   },

   //styles for swipeable list
   setView: {
      flex: 1,
      flexDirection: "row",
      paddingLeft: 20,
      backgroundColor: "#C5E2FF",
      borderColor: "#2C95FF",
      borderBottomWidth: 1,
  },
   labelText: {
      alignSelf: "center",
      fontSize: 20,
      padding: 10,
      marginTop: 10
  },
   infoText: {
      alignSelf: "center",
      fontSize: 15,
      marginTop: 10,
      paddingLeft: 15
   },
   infoInput: {
      textAlignVertical: "bottom",
      height: 35,
      width: 50,
      borderRadius: 8,
      margin: 10,
      paddingBottom: 1,
      borderBottomColor: "black",
      borderBottomWidth: 1
   },
   deleteSetBtn: {
      top: 18,
      left: 365
   },
   deleteIcon: { 
      color: "#BD0000",
      fontSize: 20
   },

   //styles for workout display
   dateHeaderView: {
      flexDirection: "row",
      alignItems: "stretch",
      backgroundColor: "#A4D1FF"
   },
   workoutDisplayView: {
      backgroundColor: "#C5E2FF",
      marginTop: 10,
   },
   workoutDisplayText: {
      padding: 8,
      marginLeft: 10,
      fontSize: 18,
      color: "black"
   },
   dateHeaderText: {
      padding: 8,
      marginLeft: 10,
      fontSize: 16
   },
   timeHeaderText: {
      position: "absolute",
      padding: 8,
      fontSize: 16,
      right: 10
   },
   logPreviewHeaderText: {
      padding: 8, 
      marginLeft: 10, 
      fontSize: 18
   },
   logPreviewText: {
      padding: 8, 
      marginLeft: 10, 
      fontSize: 16
   }
});

export default AddLogButton;