import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Content, Text } from 'native-base';
import Header from '../components/Header';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const ModifyLog = ({ workout, modifyWorkout, deleteWorkout, setInfoModalVisible }) => {
    const [selectedSetNumber, setSetNumber] = useState(1); 

    const [newWorkout, setNewWorkout] = useState({...workout})

    const deleteCopySet = (setId) => {
        var copyWorkout = {...newWorkout};
        copyWorkout.sets = copyWorkout.sets.filter(set => set.id != setId);
        for (var i = 0; i < copyWorkout.sets.length; i++) {
            copyWorkout.sets[i].num = i + 1;
        }
        setNewWorkout(copyWorkout);
    }

    const addNewSet = () => {
        var copyWorkout = {...newWorkout};
        copyWorkout.sets = [...copyWorkout.sets, {id: uuid(), num: copyWorkout.sets.length + 1, reps: 0, weight: 0}];
        setNewWorkout(copyWorkout);
    }

    const onChangeName = (newName) => {
        newWorkout.name = newName;
        setNewWorkout(newWorkout);
    };

    const onChangeReps = (newReps) => {
        newWorkout.sets[selectedSetNumber - 1].reps = newReps;
        setNewWorkout(newWorkout);
    };

    const onChangeWeight = (newWeight) => {
        newWorkout.sets[selectedSetNumber - 1].weight = newWeight;
        setNewWorkout(newWorkout);
    };

    const onChangeNotes = (newNotes) => {
        newWorkout.notes = newNotes;
        setNewWorkout(newWorkout);
    };

    return (
        <View>
            <Header title="Edit Log" />
            <Content padder>
                <View style={styles.nameView}>                  
                    <Text style={styles.name}>Name</Text>
                    <TextInput defaultValue={newWorkout.name} style={styles.nameInput} onChangeText={onChangeName} />
                </View>
                {newWorkout.sets.map((set) => {
                    return (
                        <View style={styles.setView} key={set.id}>
                            <Text style={styles.labelText}>{"Set " + set.num + ":"}</Text>
                            <Text style={styles.infoText}>Reps </Text>
                            <TextInput keyboardType="numeric" defaultValue={set.reps.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(set.num)} onChangeText={(newReps) => onChangeReps(newReps)} />
                            <Text style={styles.infoText}>Wt (lbs)</Text>
                            <TextInput keyboardType="numeric" defaultValue={set.weight.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(set.num)} onChangeText={(newWeight) => onChangeWeight(newWeight)} />  
                            <TouchableOpacity style={styles.deleteSetBtn} onPress={() => {
                                deleteCopySet(set.id)
                            }}>
                                <Icon style={styles.deleteSetIcon} name="close" size={15} />    
                            </TouchableOpacity>  
                        </View>
                    )})
                }
                <View style={styles.notesView}>
                    <TouchableOpacity style={styles.addSetBtn} onPress={() => {addNewSet()}}>
                        <Text style={styles.addSetText}>Add Set</Text>
                    </TouchableOpacity>
                    <Text style={styles.notesText}><Icon style={styles.notesIcon} name="form" size={15}/>  Notes</Text>
                    <TextInput placeholder="Write here..." defaultValue={newWorkout.notes} multiline={true} style={styles.notesInput} onChangeText={onChangeNotes} />
                </View>
            </Content>
            <TouchableOpacity style={styles.deleteWorkoutBtn} onPress={() => {
                                    deleteWorkout(newWorkout.id), 
                                    setInfoModalVisible(false)}}>
                <Icon style={styles.deleteWorkoutIcon} name="delete" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneBtn} onPress={() => {
                if (newWorkout.sets.length == 0) {
                    Alert.alert("           At least 1 set is needed!")
                } else {
                    setInfoModalVisible(false), 
                    modifyWorkout(newWorkout)
                }
            }}>
                <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    nameView: {
        marginBottom: 15,
        flexWrap: "wrap",
        width: 370,
        flexDirection: "row",
    },
    infoView: {
        flex: 1,
        marginBottom: 100,
        marginTop: 25,
    },
    notesView: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        padding: 5,
        paddingRight: 10,
        marginTop: 40,
        marginLeft: 20
    },
    nameInput: {
        height: 32,
        width: 237,
        padding: 8,
        fontSize: 16,
        marginTop: 43,
        borderRadius: 8,
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
    infoInput: {
        textAlignVertical: "bottom",
        height: 35,
        width: 50,
        borderRadius: 8,
        margin: 10,
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
    notesInput: {
        textAlignVertical: "top",
        alignItems: "flex-start",
        marginLeft: 25,
        height: "auto",
        width: 300
    },
    setView: {
        marginBottom: 15,
        marginLeft: 7,
        flex: 1,
        flexDirection: "row"
    },
    labelText: {
        alignSelf: "center",
        fontSize: 20,
        padding: 10
    },
    notesText: {
        alignSelf: "center",
        flexDirection: "row",
        fontSize: 20,
        padding: 10,
        marginTop: 40
    },
    infoText: {
        alignSelf: "center",
        fontSize: 15
    },
    deleteSetBtn: {
        top: 18
    },
    deleteWorkoutBtn: { 
        bottom: 10, 
        left: 10 
    },
    deleteWorkoutIcon: { 
        color: "red" 
    },
    addSetBtn: {
        position: "absolute", 
        backgroundColor: "#2C95FF",
        padding: 5,
        marginLeft: 140,
        marginBottom: 40,
        borderRadius: 8
    },
    addSetText: {
        marginLeft: 3,
        marginRight: 3,
        color: "white"
    },
    doneBtn: { 
        position: "absolute", 
        bottom: 10, 
        right: 10,
        backgroundColor: "#2C95FF",
        height: 35,
        width: 55,
        padding: 5,
        borderRadius: 8,
        flexWrap: "wrap",
        flexDirection: "row" 
    },
    doneText: {
        marginLeft: 3,
        color: "white"
    }
});

export default ModifyLog;