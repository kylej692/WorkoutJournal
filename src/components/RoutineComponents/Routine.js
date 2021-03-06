import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Spinner } from 'native-base';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import WorkoutListDisplay from '../WorkoutListDisplay';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import Icon2 from 'react-native-vector-icons/dist/FontAwesome5';
import { db } from '../../Database.js';
import { lbToKg, kgToLb } from '../../utils';

const Routine = ({ setModal, routine, setPressedRoutine, setRoutine, setRoutineModalVisible, toggleInfoModal, routineName, unitSystem }) => {
    
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
          setIsLoading(false)
        }, 200);
    }, [])

    useEffect(() => {
        setIsLoading(true);
        db.findOne({ routineName: routineName }, function(err, doc) {
            if(doc.unitSystem == "Metric" && unitSystem == "Imperial") {
                doc.workouts.map((workout) => {
                    workout.sets.map((set) => {
                        if(set.weightLbs == '') {
                            set.weightLbs = kgToLb(set.weightKgs);
                        }
                    })
                })
                db.update({ id: doc.id }, { $set: { workouts: doc.workouts} });
                db.update({ id: doc.id }, { $set: { unitSystem: "Imperial"} });
            } else if(doc.unitSystem == "Imperial" && unitSystem == "Metric") {
                doc.workouts.map((workout) => {
                    workout.sets.map((set) => {
                        if(set.weightKgs == '') {
                            set.weightKgs = lbToKg(set.weightLbs);
                        }
                    })
                })
                db.update({ id: doc.id }, { $set: { workouts: doc.workouts} });
                db.update({ id: doc.id }, { $set: { unitSystem: "Metric"} });
            } 
            setRoutine(doc);
        });

        setTimeout(() => {
            setIsLoading(false)
        }, 200);

    }, [routineName])

    return(
            <View>
                <TouchableOpacity 
                    onPress={() => {setRoutineModalVisible(true)}} 
                    style={styles.addWorkout}
                >
                        <Icon color="white" name="ios-add" size={35} />
                </TouchableOpacity>    
                <TouchableOpacity 
                    onPress={() => {
                        db.remove({ id: routine.id }, {}, function() {
                            setModal(false);
                            setPressedRoutine(false);
                        });
                    }}
                    style={styles.deleteRoutine}
                >
                    <Icon2 color="white" name="trash" size={20} />
                </TouchableOpacity>   
                {isLoading && <Spinner style={styles.spinner} color={"#2C95FF"} />}
                {!isLoading &&
                    <View style={styles.workoutsView}>
                        <WorkoutListDisplay 
                            item={routine} 
                            toggleInfoModal={toggleInfoModal}
                            unitSystem={unitSystem}
                            key={uuid()} 
                        />
                    </View>
                }
            </View>
    )
}

const styles = StyleSheet.create({ 
    workoutsView: {
        bottom: 16,
        marginLeft: 5,
        marginRight: 5,
        height: 525
    },
    addWorkout: {
        alignSelf: "flex-end",
        bottom: 108,
        right: 15
    },
    deleteRoutine: {
        alignSelf: "flex-start",
        bottom: 135,
        left: 15
    },
    spinner: { 
        marginTop: 30 
    },
})

export default Routine;