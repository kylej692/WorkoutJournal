import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'native-base';
import Header from '../Header';
import SwipeListWorkoutView from '../SwipeListWorkoutView';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';

const ModifyLog = ({ itemId, workout, modifyWorkout, deleteWorkout, setInfoModalVisible, unitSystem }) => {
    const [newWorkout, setNewWorkout] = useState({...workout})

    return (
        <View>
            <Header title="Edit Log" />
            <SwipeListWorkoutView 
                newWorkout={newWorkout} 
                setNewWorkout={setNewWorkout} 
                containsNotes={true} 
                unitSystem={unitSystem}
            />
            <View style={styles.footerView}>
                <TouchableOpacity 
                    style={styles.deleteBtn}
                    onPress={() => {
                        deleteWorkout(itemId, newWorkout.id), 
                        setInfoModalVisible(false)
                    }}>
                    <Icon style={styles.deleteIcon} name="trash" size={20} />
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.doneBtn} 
                    onPress={() => {
                        if (newWorkout.sets.length == 0) {
                            Alert.alert("           At least 1 set is needed!")
                        } else {
                            setInfoModalVisible(false), 
                            modifyWorkout(itemId, newWorkout)
                        }
                    }}>
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    footerView: {
        height: 50, 
        backgroundColor: "#2C95FF"
    },
    deleteBtn: {
        marginLeft: 10, 
        width: 30
    },
    deleteIcon: {
        color: "white", 
        marginTop: 15, 
        marginLeft: 5
    },
    doneBtn: { 
        flexDirection: "row", 
        position: "absolute", 
        bottom: 10, 
        right: 15
    },
    doneText: {
        color: "white", 
        fontSize: 20
    }
});

export default ModifyLog;