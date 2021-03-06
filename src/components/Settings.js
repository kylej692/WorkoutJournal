import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {Picker} from '@react-native-community/picker';
import Header from './Header';
import { db } from '../Database.js';
import { lbToKg, kgToLb } from '../utils';

const Settings = ({ items, unitSystem, setUnitSystem }) => {
    
    return(
        <View>
            <View style={styles.unitSystemView}>
                <Header title="Settings"/>
                <Text style={styles.unitSystemText}>Unit System</Text>
                <Picker 
                    style={styles.unitSystemPicker}
                    mode={"dropdown"}
                    selectedValue={unitSystem}
                    onValueChange={(itemValue) => {
                            setUnitSystem(itemValue)
                            if(itemValue == "Imperial") {
                                db.update({ unitSystem: "Metric" }, { unitSystem: "Imperial" })
                                items.map((item) => {
                                    item.workouts.map((workout) => {
                                        workout.sets.map((set) => {
                                            if(set.weightLbs == '') {
                                                set.weightLbs = kgToLb(set.weightKgs);
                                            }
                                        })
                                    })
                                    db.update({ id: item.id }, { $set: { workouts: item.workouts} });
                                    db.update({ id: item.id }, { $set: { unitSystem: "Imperial"} });
                                })
                            } else {
                                db.update({ unitSystem: "Imperial" }, { unitSystem: "Metric" })
                                items.map((item) => {
                                    item.workouts.map((workout) => {
                                        workout.sets.map((set) => {
                                            if(set.weightKgs == '') {
                                                set.weightKgs = lbToKg(set.weightLbs);
                                            }
                                        })
                                    })
                                    db.update({ id: item.id }, { $set: { workouts: item.workouts} });
                                    db.update({ id: item.id }, { $set: { unitSystem: "Metric"} });
                                })
                            }
                        }
                    }
                >
                    <Picker.Item label="Imperial" value="Imperial"/>
                    <Picker.Item label="Metric" value="Metric"/>
                </Picker>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    unitSystemView: {
        marginBottom: 75,
        borderBottomWidth: 1,
        borderBottomColor: "#BDBDBD"
    },
    unitSystemText: {
        marginTop: 10,
        marginLeft: 20,
        fontSize: 20,
        color: "black"
    },
    unitSystemPicker: {
        width: 140,
        marginLeft: 10
    }
})

export default Settings;