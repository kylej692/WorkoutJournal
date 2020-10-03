import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'native-base';
import Header from './Header';
import SwipeListWorkoutView from './SwipeListWorkoutView';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

const ModifyLog = ({ itemId, workout, modifyWorkout, deleteWorkout, setInfoModalVisible, unitSystem }) => {
    const [newWorkout, setNewWorkout] = useState({...workout})

    return (
        <View>
            <Header title="Edit Log" />
            <SwipeListWorkoutView newWorkout={newWorkout} setNewWorkout={setNewWorkout} containsNotes={true} unitSystem={unitSystem}/>
            <View style={{ height: 50, backgroundColor: "#2C95FF" }}>
                <TouchableOpacity style={{ marginLeft: 10, width: 30 }} onPress={() => {
                                        deleteWorkout(itemId, newWorkout.id), 
                                        setInfoModalVisible(false)}}>
                    <Icon style={{ color: "white", marginTop: 15, marginLeft: 5 }} name="trash" size={20} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.doneBtn} onPress={() => {
                    if (newWorkout.sets.length == 0) {
                        Alert.alert("           At least 1 set is needed!")
                    } else {
                        setInfoModalVisible(false), 
                        modifyWorkout(itemId, newWorkout)
                    }
                }}>
                    <Text style={{color: "white", fontSize: 20 }}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    doneBtn: { 
        flexDirection: "row", 
        position: "absolute", 
        bottom: 10, 
        right: 15
    }
});

export default ModifyLog;