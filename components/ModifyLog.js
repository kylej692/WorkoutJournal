import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Content, Text } from 'native-base';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const ModifyLog = ({ workout, modifyWorkout, deleteItem, setInfoModalVisible }) => {
    
    const [selectedSetNumber, setSetNumber] = useState(1); 

    const [newWorkout, setNewWorkout] = useState(JSON.parse(JSON.stringify(workout)))

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
                    <TextInput defaultValue={workout.name} style={styles.nameInput} onChangeText={onChangeName} />
                </View>
                {workout.sets.map((set) => {
                    return (
                        <View style={styles.setView} key={set.id}>
                            <Text style={styles.labelText}>{"Set " + set.num + ":"}</Text>
                            <Text style={styles.infoText}>{"Reps "}</Text>
                            <TextInput keyboardType="numeric" defaultValue={set.reps.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(set.num)} onChangeText={(newReps) => onChangeReps(newReps)} />
                            <Text style={styles.infoText}>{"Weight "}</Text>
                            <TextInput keyboardType="numeric" defaultValue={set.weight.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(set.num)} onChangeText={(newWeight) => onChangeWeight(newWeight)} />        
                        </View>
                    )})
                }
                <View style={styles.notesView}>
                    <Text style={styles.labelText}>Notes</Text>
                    <TextInput placeholder="Write here..." defaultValue={workout.notes} multiline={true} style={styles.notesInput} onChangeText={onChangeNotes} />
                </View>
            </Content>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => {
                                    deleteItem(workout.id), 
                                    setInfoModalVisible(false)}}>
                <Icon style={styles.deleteIcon} name="delete" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneBtn} onPress={() => {setInfoModalVisible(false), modifyWorkout(newWorkout)}}><Text style={styles.doneText}>Done</Text></TouchableOpacity>
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
        flex: 1
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
        marginLeft: 15,
        flex: 1,
        flexDirection: "row"
    },
    labelText: {
        alignSelf: "center",
        fontSize: 20,
        padding: 10
    },
    infoText: {
        alignSelf: "center",
        fontSize: 15,
        padding: 5
    },
    deleteBtn: { 
        bottom: 10, 
        left: 10 
    },
    deleteIcon: { 
        color: "red" 
    },
    doneBtn: { 
        position: "absolute", 
        bottom: 10, 
        right: 10 ,
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