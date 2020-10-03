import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import WorkoutListDisplay from './WorkoutListDisplay'
import Icon from 'react-native-vector-icons/dist/Ionicons';

const Routine = ({ routine, setRoutine, setRoutineModalVisible, toggleInfoModal, routineName, unitSystem, lbToKg, kgToLb, db }) => {

    useEffect(() => {
        db.findOne({ routineName: routineName }, function(err, doc) {
            if(doc.unitSystem == "Metric" && unitSystem == "Imperial") {
                doc.workouts.map((workout) => {
                    workout.sets.map((set) => {
                        set.weight = kgToLb(set.weight);
                    })
                })
                db.update({ id: doc.id }, { $set: { workouts: doc.workouts} });
                db.update({ id: doc.id }, { $set: { unitSystem: "Imperial"} });
            } else if(doc.unitSystem == "Imperial" && unitSystem == "Metric") {
                doc.workouts.map((workout) => {
                    workout.sets.map((set) => {
                        set.weight = lbToKg(set.weight);
                    })
                })
                db.update({ id: doc.id }, { $set: { workouts: doc.workouts} });
                db.update({ id: doc.id }, { $set: { unitSystem: "Metric"} });
            } 
            setRoutine(doc)
        });
    }, [routineName])

    return(
        <View>
             <TouchableOpacity onPress={() => {setRoutineModalVisible(true)}} style={styles.addWorkout}>
                    <Icon color="white" name="ios-add" size={35} />
            </TouchableOpacity>  
            <View style={styles.workoutsView}>
                <WorkoutListDisplay 
                    item={routine} 
                    toggleInfoModal={toggleInfoModal}
                    unitSystem={unitSystem}
                    key={uuid()} 
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    workoutsView: {
        marginTop: -10,
        marginLeft: 5,
        marginRight: 5,
        height: 565
    },
    addWorkout: {
        alignSelf: "flex-end",
        bottom: 88,
        right: 15
    }
})

export default Routine;