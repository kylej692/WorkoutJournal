import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Header from '../components/Header';
import SwipeListWorkoutView from './SwipeListWorkoutView';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const AddRoutineWorkout = ({ routine, unitSystem, db }) => {
    const [newWorkout, setNewWorkout] = useState({id: uuid(), name: "", sets: [{id: uuid(), num: 1, reps: 0, weight: 0}], notes:""})

    return(
        <View>
            <Header title="Add New Workout"/>
            <SwipeListWorkoutView newWorkout={newWorkout} setNewWorkout={setNewWorkout} containsNotes={false} unitSystem={unitSystem}/>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default AddRoutineWorkout;