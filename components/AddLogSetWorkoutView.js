import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Alert, ToastAndroid, Keyboard } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { SwipeListView } from 'react-native-swipe-list-view';

const AddLogSetWorkoutView = ({ setList, setSList, note, displaySetWorkout, setWList, workoutList, setNote, createRoutine, unitSystem, displayDate, displayTime, time, setDisplaySetWorkout, setRoutineName }) => {
    
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
        weightLbs: '',
        weightKgs: ''
    };

    const [workout, setWorkout] = useState(defaultWorkout);
    const [wName, setWName] = useState('');
    const [set, setSet] = useState(defaultSet);
    const [workoutId, setWorkoutId] = useState('');
    const [selectedSetNumber, setSetNumber] = useState(1);
    const [rep, setRep] = useState('');
    const [weight, setWeight] = useState('');

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
       if(unitSystem == "Metric") {
          setSet({...set, weightKgs: weightValue });
       } else if (unitSystem == "Imperial") {
          setSet({...set, weightLbs: weightValue });
       }
       setWeight(weightValue);
    };
 
    const onChangeNotes = (note) => { 
       setWorkout({...workout, notes: note});
       setNote(note);
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
        if(unitSystem == "Metric") {
           setList[selectedSetNumber - 1].weightKgs = newWeight;
        } else if (unitSystem == "Imperial") {
           setList[selectedSetNumber - 1].weightLbs = newWeight;
        }
     };

    const alternatingColors = ["#D7EBFF", "#C1D4E6"];
    return (
        <SwipeListView 
            data={setList}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={
            <View style={styles.workoutView}>
                <View style={styles.routineHeader}>
                    {createRoutine && <TextInput placeholder="Enter Routine Name" style={styles.routineNameInput} onChangeText={setRoutineName} />}
                    <TextInput placeholder="Enter Exercise Name" style={styles.input} onChangeText={onChangeName} value={wName} />
                </View>
            </View>
            }
            renderItem={(data, rowMap) => (
                <View style={styles.setView} key={data.item.id}>
                    <Text style={styles.labelText}>{"SET " + data.item.num + ":"}</Text>
                    <Text style={styles.infoText}>Reps </Text>
                    <TextInput 
                        keyboardType="numeric" 
                        defaultValue={data.item.reps.toString()} 
                        style={styles.infoInput} 
                        onTouchStart={() => setSetNumber(data.item.num)} 
                        onChangeText={(newReps) => modifyReps(newReps)} 
                    />
                    {unitSystem == "Imperial" && <Text style={styles.infoText}>Wt (lbs)</Text>}
                    {unitSystem == "Metric" && <Text style={styles.infoText}>Wt (kgs)</Text>}
                    {unitSystem == "Imperial" && 
                        <TextInput 
                        keyboardType="numeric" 
                        defaultValue={data.item.weightLbs.toString()} 
                        style={styles.infoInput} 
                        onTouchStart={() => setSetNumber(data.item.num)} 
                        onChangeText={(newWeight) => modifyWeight(newWeight)} 
                        />
                    }
                    {unitSystem == "Metric" && 
                        <TextInput 
                        keyboardType="numeric" 
                        defaultValue={data.item.weightKgs.toString()} 
                        style={styles.infoInput} 
                        onTouchStart={() => setSetNumber(data.item.num)} 
                        onChangeText={(newWeight) => modifyWeight(newWeight)} 
                        />
                    }  
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
                            { 
                                onChangeSetID(uuid()); 
                                addSetList(set); 
                                notifyMessage("Added set"); 
                                setRep(''); 
                                setWeight('');
                            }
                        }}}>
                        <Text style={styles.buttonText}>Add Set</Text>
                    </TouchableOpacity>
                </View>
                <TextInput placeholder="Notes" multiline={true} style={styles.input} onChangeText={onChangeNotes} value={note} />
                <View style={styles.setWorkoutBtnView}>
                    {displaySetWorkout && 
                        <View style={styles.buttonView}>
                        <TouchableOpacity style={styles.setWorkout} 
                            onPress={() => {
                                if (setList.length == 0) {
                                    Alert.alert("Please add one or more sets for your workout!")
                                } else {
                                    { 
                                    onChangeWorkoutID(uuid()); 
                                    addWorkoutList(setList, workout); 
                                    notifyMessage("Added workout"); 
                                    setWorkout({id: uuid()}); 
                                    setRep(''); 
                                    setWeight(''); 
                                    setWName(''); 
                                    setNote(''); 
                                    Keyboard.dismiss(); 
                                    }
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
                                setWorkout({id: uuid()}); 
                                setSList([]); 
                                setRep(''); 
                                setWeight(''); 
                                setWName(''); 
                                setNote(''); 
                                setDisplaySetWorkout(true); 
                                Keyboard.dismiss();
                            }
                        }>
                            <Text style={styles.buttonText}>Clear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.updateWorkout} 
                            onPress={() => {
                                if (setList.length == 0) {
                                    Alert.alert("Please add one or more sets for your workout!")
                                } else {
                                    { 
                                    modifyWorkoutList(workoutId, workoutList); 
                                    notifyMessage("Updated workout"); 
                                    setWorkout({id: uuid()});
                                    setSList([]); 
                                    setRep(''); 
                                    setWeight(''); 
                                    setWName(''); 
                                    setNote(''); 
                                    setDisplaySetWorkout(true); 
                                    Keyboard.dismiss(); 
                                    }
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
                                    <View style={styles.displaySetsView} key={set.id}>
                                    <Text style={styles.logPreviewHeaderText}>{"Set " + set.num + ": "}</Text>
                                    <Text style={styles.logPreviewText}>{"Reps: " + set.reps}</Text>
                                    {unitSystem == "Imperial" && <Text style={styles.logPreviewText}> {"Weight (lbs): " + set.weightLbs}</Text>}
                                    {unitSystem == "Metric" && <Text style={styles.logPreviewText}> {"Weight (kgs): " + set.weightKgs}</Text>}
                                    </View>
                                )
                            })}
                            <View style={styles.displayNotesView}>
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
    )
}

const styles = StyleSheet.create ({
    routineNameInput: {
       height: 60,
       padding: 8,
       fontSize: 16,
       left: 5,
       borderColor: "#BDBDBD",
       borderBottomWidth: 1
    },
    routineHeader: { 
       marginTop: 10 
    },
    input: {
       height: 50,
       padding: 8,
       fontSize: 16,
       left: 5
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
    buttonText: {
       marginLeft: 4,
       marginRight: 5,
       color: "white",
       fontSize: 19,
    },
    workoutView: {
       borderColor: "#2C95FF",
       borderBottomWidth: 1,
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
    setWorkoutBtnView: { 
       top: 10, 
       borderBottomWidth: 2 
    }, 
    displaySetsView: { 
       flexDirection: "row", 
       borderTopWidth: 1, 
       borderColor: "#5782AB" 
    },
    displayNotesView: { 
       borderTopColor: "#5782AB", 
       borderTopWidth: 1, 
       borderBottomWidth: 2 
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
       marginLeft: 5,
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

export default AddLogSetWorkoutView;