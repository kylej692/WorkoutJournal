import React, { useState, useEffect } from 'react';
import { Text, Modal, View, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Header from './Header';
import WorkoutListDisplay from './WorkoutListDisplay'
import ModifyLog from './ModifyLog'

const Routine = ({ routineName, unitSystem, db }) => {
    const [routine, setRoutine] = useState({})
    const [isInfoModalVisible, setInfoModalVisible] = useState(false);
    const [selectedWorkout, setWorkout] = useState({});
    const [selectedItemId, setSelectedItemId] = useState();

    useEffect(() => {
        db.findOne({ routineName: routineName }, function(err, doc) {
            setRoutine(doc)
        })
    }, [routineName])

    const toggleInfoModal = (routineId, workout) => {
        setInfoModalVisible(!isInfoModalVisible);
        setWorkout(workout);
        setSelectedItemId(routineId);
    }

    const deleteWorkout = (routineId, workoutId) => {
        db.findOne({ id: routineId }, function(err, doc) {
            doc.workouts = doc.workouts.filter(workout => workout.id != workoutId);
            db.update({ id: routineId }, { $set: { workouts: doc.workouts} });
            var newRoutine = routine
            newRoutine.workouts = doc.workouts
            setRoutine({...newRoutine});
        })
    };

    const modifyWorkout = (routineId, modifiedWorkout) => {
        db.findOne({ id: routineId }, function(err, doc) {
            for (var i = 0; i < doc.workouts.length; i++){
                if(doc.workouts[i].id == modifiedWorkout.id) {
                    doc.workouts[i] = modifiedWorkout;
                    db.update({ id: routineId }, { $set: { workouts: doc.workouts} });
                }
            };
            var newRoutine = routine
            newRoutine.workouts = doc.workouts
            setRoutine({...newRoutine});
        });
    };
    
    return(
        <View style={styles.workoutsView}>
            {!isInfoModalVisible &&
                <WorkoutListDisplay 
                    item={routine} 
                    toggleInfoModal={toggleInfoModal}
                    unitSystem={unitSystem}
                    key={uuid()} 
                />
            }
            {isInfoModalVisible &&
                <ModifyLog 
                    itemId={selectedItemId} 
                    workout={selectedWorkout} 
                    modifyWorkout={modifyWorkout} 
                    deleteWorkout={deleteWorkout} 
                    setInfoModalVisible={setInfoModalVisible} 
                    unitSystem={unitSystem}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    workoutsView: {
        marginTop: 15,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 10
    },
    infoModal: { 
        position: "relative",
        marginTop: 50,
        marginBottom: 50,
        backgroundColor: "white", 
        flex: 1,
        alignItems: "center"
    },
})

export default Routine;