import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import SwipeListWorkoutView from './SwipeListWorkoutView';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const AddRoutineWorkout = ({ setRoutineModalVisible, unitSystem, addRoutineWorkout }) => {
    const [newWorkout, setNewWorkout] = useState({id: uuid(), name: "", sets: [{id: uuid(), num: 1, reps: 0, weight: 0}], notes:""})

    return(
        <View>
            <Header title="Add New Workout"/>
            <SwipeListWorkoutView newWorkout={newWorkout} setNewWorkout={setNewWorkout} containsNotes={false} unitSystem={unitSystem}/>
            <View style={styles.footerView}>
                <TouchableOpacity 
                    style={styles.doneBtn}
                    onPress={() => {
                        if(newWorkout.name == "") {
                            Alert.alert("Please fill in workout name!");
                        } else {
                            addRoutineWorkout(newWorkout);
                            setRoutineModalVisible(false);
                        };
                    }}
                >
                    <Text style={styles.label}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => {
                        setRoutineModalVisible(false);
                    }}
                >
                    <Text style={styles.label}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    footerView: {
        flexDirection: "row",
        height: 50,
        backgroundColor: "#2C95FF"
    },
    doneBtn: { 
        flexDirection: "row", 
        position: "absolute", 
        bottom: 10, 
        right: 15
    },
    label: {
        color: "white", 
        fontSize: 20
    },
    deleteBtn: {
        marginLeft: 10, 
        top: 13,
        left: 5
    },
})

export default AddRoutineWorkout;