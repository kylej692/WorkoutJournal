import React, { useState } from 'react';
import { Content, Button } from 'native-base';
import { Modal, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, ToastAndroid } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Header from './Header';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { SwipeListView } from 'react-native-swipe-list-view';

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
   const [wName, setWName] = useState('');
   const [note, setNote] = useState('');
   const [rep, setRep] = useState();
   const [weight, setWeight] = useState();
   const [date, setDate] = useState(new Date());
   const [mode, setMode] = useState('date');
   const [show, setShow] = useState(false);
   const [isStart, setIsStart] = useState(true);
   const [showDisplay, setShowDisplay] = useState(false);

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
         return prevSets.filter(set => set.id != setId);
      });
  }

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
                        <TextInput placeholder="Enter Exercise Name" style={styles.input} onChangeText={onChangeName} value={wName} />
                     </View>
                  }
                  renderItem={(data, rowMap) => (
                        <View style={styles.setView} key={data.item.id}>
                           <Text style={styles.labelText}>{"Set " + data.item.num + ":"}</Text>
                           <Text style={styles.infoText}>Reps </Text>
                           <TextInput keyboardType="numeric" defaultValue={data.item.reps.toString()} style={styles.infoInput} />
                           <Text style={styles.infoText}>Wt (lbs)</Text>
                           <TextInput keyboardType="numeric" defaultValue={data.item.weight.toString()} style={styles.infoInput} />  
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
                           <TextInput keyboardType="numeric" placeholder="Enter Number of Reps" style={styles.input} onChangeText={onChangeReps} value={rep}/>
                           <TextInput keyboardType="numeric" placeholder="Enter the Weight (lbs)" style={styles.input} onChangeText={onChangeWeight} value={weight}/>
                           <View style={styles.buttonView}>
                              <TouchableOpacity style={styles.set} onPress={() => { 
                                 if (set.reps == '' || set.weight == '') {
                                    Alert.alert("Can't add a blank set")
                                 } else {
                                    { onChangeSetID(uuid()), addSetList(set), notifyMessage("Added set"), clearRep(), clearWeight() }
                                 }}}>
                                 <Text style={styles.buttonText}>Add Set</Text>
                              </TouchableOpacity>
                           </View>   
                        </View>
                        <TextInput placeholder="Notes" style={styles.input} onChangeText={onChangeNotes} value={note} />
                        <View style={styles.buttonView}>
                           <TouchableOpacity style={styles.workout} onPress={() => {
                              if (setList.length == 0) {
                                 Alert.alert("Please add one or more sets for your workout!")
                              } else {
                                 { onChangeWorkoutID(uuid()), addWorkoutList(setList, workout), notifyMessage("Added workout"), clearName(), clearNote() }
                              }}}>
                              <Text style={styles.buttonText}>Set Workout</Text>
                           </TouchableOpacity>
                        </View>
                        <View style={styles.workoutDisplayView}>
                           <Text style={styles.workoutDisplayHeaderText}>Added Workouts</Text>
                           {workoutList.map((workout) => {
                              return (
                                 <View key={workout.id}>
                                    <Text style={styles.workoutDisplayText}>{workout.name}</Text>
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
                     if(time.date == '' || time.start == '' || time.end == '' || workout.name == '' || workoutList.length == 0) {
                        Alert.alert("Please fill everything out!")
                     } else {
                        { addLog(time, workoutList), toggleModal(!modalVisible) }
                     }}}>
                     <Text style={styles.finishText}>Finish</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancel} onPress={() => { 
                     toggleModal(!modalVisible), clearRep(), clearWeight(), clearName(), clearNote()
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
      color: "white",
   },
   finishText: {
      marginTop: 10,
      fontSize: 20,
      color: "white",
   },
   workoutView: {
      borderColor: "#2C95FF",
      borderBottomWidth: 1,
   },

   //styles for swipeable list
   setView: {
      marginBottom: 15,
      marginLeft: 15,
      backgroundColor: "white",
      flex: 1,
      flexDirection: "row"
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
      marginTop: 10
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
   workoutDisplayView: {
      borderColor: "#2C95FF",
      borderTopWidth: 1
   },
   workoutDisplayText: {
      padding: 8,
      fontSize: 16,
      color: "black"
   },
   workoutDisplayHeaderText: {
      textAlign: 'center',
      padding: 8,
      fontSize: 16,
      color: "black"
   }
})