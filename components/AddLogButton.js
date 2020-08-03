import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { Button } from 'native-base';
import { Modal, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ToastAndroid } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Header from './Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { SwipeListView } from 'react-native-swipe-list-view';

const AddLogButton = ({ addLog }) => {
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
   const [workout, setWorkout] = useState(defaultWorkout);
   const [workoutList, setWList] = useState([]);
   const [setList, setSList] = useState([]);
   const [set, setSet] = useState(defaultSet);
   const [workoutId, setWorkoutId] = useState('');
   const [wName, setWName] = useState('');
   const [note, setNote] = useState('');
   const [rep, setRep] = useState('');
   const [weight, setWeight] = useState('');
   const [date, setDate] = useState(new Date());
   const [mode, setMode] = useState('date');
   const [show, setShow] = useState(false);
   const [isStart, setIsStart] = useState(true);
   const [selectedSetNumber, setSetNumber] = useState(1);
   const [displayDate, setDisplayDate] = useState(false);
   const [displayTime, setDisplayTime] = useState(false);
   const [displaySetWorkout, setDisplaySetWorkout] = useState(true);

   //Handles time attribute
   const onChangeDate = (dateValue) => setTime({...time, date: dateValue });
   const onChangeStart = (startValue) => setTime({...time, start: startValue });
   const onChangeEnd = (endValue) => setTime({...time, end: endValue });

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

   //For date and time picker
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

   const onChangeTime = (event, selectedDate) => {
      if(event.type === "set") {
         const currentDate = selectedDate || date;
         const currentDateTimeStr = currentDate.toString(0, 21);
         const monthDayStr = currentDateTimeStr.slice(4, 10);
         const yearStr = currentDateTimeStr.slice(11, 15);
         const dateStr = monthDayStr + ", " + yearStr;
         const timeStr = currentDateTimeStr.slice(16, 21);
         setShow(Platform.OS === 'ios');
         setDate(currentDate);
         onChangeDate(dateStr);
         setDisplayDate(true);
         if (mode == 'time') {
            if (isStart) {
               onChangeStart(timeConvertTo12(timeStr));
            } else {
               onChangeEnd(timeConvertTo12(timeStr));
            }
            setDisplayTime(true);
         }
      } else {
         setShow(Platform.OS === 'ios');
      }
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
            onRequestClose = {() => { toggleModal(!modalVisible) } }>
            
            <View style = {styles.modal}>
               <Header title='Add a Log'/>
               <SwipeListView 
                  data={setList}
                  keyboardShouldPersistTaps={'handled'}
                  ListHeaderComponent={
                     <View style={styles.workoutView}>
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
                                 onChange={onChangeTime}
                              />
                           )}
                        </View>
                        <View style={{borderColor: "#2C95FF", borderTopWidth: 1, marginTop: 20}}>
                           <TextInput placeholder="Enter Exercise Name" style={styles.input} onChangeText={onChangeName} value={wName} />
                        </View>
                     </View>
                  }
                  renderItem={(data, rowMap) => (
                        <View style={styles.setView} key={data.item.id}>
                           <Text style={styles.labelText}>{"Set " + data.item.num + ":"}</Text>
                           <Text style={styles.infoText}>Reps </Text>
                           <TextInput keyboardType="numeric" defaultValue={data.item.reps.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newReps) => modifyReps(newReps)} />
                           <Text style={styles.infoText}>Wt (lbs)</Text>
                           <TextInput keyboardType="numeric" defaultValue={data.item.weight.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newWeight) => modifyWeight(newWeight)} />  
                        </View>
                  )}
                  renderHiddenItem={ (data, rowMap) => (
                        <TouchableOpacity style={styles.deleteSetBtn} onPress={() => {
                           deleteSet(data.item.id)
                        }}>
                           <View style={styles.rowFront}>
                              <Icon style={styles.deleteIcon} name="closecircle" size={15} />    
                           </View>
                        </TouchableOpacity>  
                  )}
                  ListFooterComponent={
                     <View>
                        <View style={styles.workoutView}>
                           <View style={styles.repsWeightView}>
                              <Text style={styles.newSetText}>{"Set " + (setList.length + 1) + ": "}</Text>
                              <Text style={styles.infoText}>Reps </Text>
                              <TextInput keyboardType="numeric" style={styles.infoInput} onChangeText={onChangeReps} value={rep}/>
                              <Text style={styles.infoText}>Wt (lbs) </Text>
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
                        <TextInput placeholder="Notes" style={styles.input} onChangeText={onChangeNotes} value={note} />
                        <View style={styles.buttonView}>
                           {displaySetWorkout && 
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
                           <View style={styles.addedLogHeader}> 
                              <Text style={styles.addedLogHeaderText}>Log Preview</Text>
                           </View>
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
                                             <Text style={styles.logPreviewText}>{"reps: " + set.reps}</Text>
                                             <Text style={styles.logPreviewText}> {"weight (lbs): " + set.weight}</Text>
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
                     if(time.date == '' || time.start == '' || time.end == '' || workoutList.length == 0) {
                        Alert.alert("Please fill everything out!")
                     } else {
                        { addLog(time, workoutList), toggleModal(!modalVisible), setDisplayDate(false), setDisplayTime(false), setDate(new Date()) }
                     }}}>
                     <Text style={styles.finishText}>Finish</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancel} onPress={() => { 
                     toggleModal(!modalVisible), setDisplayDate(false), setDisplayTime(false), clearRep(), clearWeight(), clearName(), clearNote(), setDate(new Date())
                     }}>
                     <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

            </View>
         </Modal>
         
         <Button style={ styles.addButton } bordered primary onPress = {() => {
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
      backgroundColor: "#2C95FF",
      width: 70,
      height: 35,
      borderColor: "white",
      justifyContent: "center",
   },
   buttonView: {
      flexDirection: "row"
   },
   set: {
      alignSelf: "center",
      backgroundColor: "#2C95FF",
      height: 35,
      width: 88,
      padding: 5,
      borderRadius: 10,
      marginBottom: 10,
      marginTop: 5
   },
   time: {
      backgroundColor: "#2C95FF",
      marginHorizontal: 5,
      padding: 5,
      borderRadius: 10,
      bottom: -10
   },
   setWorkout: {
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      bottom: 5,
      left: 275,
   },
   updateWorkout: {
      backgroundColor: "#2C95FF",
      padding: 5,
      borderRadius: 8,
      bottom: 5,
      left: 185,
   },
   clearWorkout: {
      backgroundColor: "red",
      padding: 5,
      borderRadius: 8,
      bottom: 5,
      left: 10,
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
      color: "red",
      fontSize: 20
   },

   //styles for workout display
   addedLogHeader: {
      backgroundColor: "#7A9CC0"
   },
   dateHeaderView: {
      flexDirection: "row",
      backgroundColor: "#A4D1FF"
   },
   addedLogHeaderText: {
      textAlign: 'center',
      padding: 8,
      fontSize: 20,
      color: "white"
   },
   workoutDisplayView: {
      backgroundColor: "#C5E2FF",
      marginTop: 5,
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
      marginLeft: 260,
      marginRight: 10,
      fontSize: 16
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
})