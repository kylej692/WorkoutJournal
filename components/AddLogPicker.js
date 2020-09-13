import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import { Picker } from '@react-native-community/picker';

const AddLogPicker = ({ setCreateRoutine }) => {
    const [routines, setRoutines] = useState(["Routine 1", "Routine 2"]);
    const [selectedValue, setSelectedValue] = useState("Add a Log");

    return (
        <View style={styles.pickerView}>
            <Picker
            selectedValue={selectedValue}
            mode={"dropdown"}
            style={styles.pickerStyle}
            itemStyle={styles.pickerItemStyle}
            onValueChange={(itemValue) => {
                setSelectedValue(itemValue);
                if(itemValue == "Add Routine") {
                    setCreateRoutine(true);
                } else {
                    setCreateRoutine(false);
                }
            }}
            >
            <Picker.Item label="Add a Log" value="Add a Log" />
            {routines.map((routine) => {
                return <Picker.Item key={uuid()} label={routine} value={routine} />
            })}
            <Picker.Item label="Add Routine" value="Add Routine" />
            </Picker>
        </View>
    )
}

const styles = StyleSheet.create ({
    container: {
       flex: 1
    },
    pickerView: {
       height: 60, 
       padding: 15, 
       backgroundColor: '#2C95FF'
    },
    pickerStyle: {
       alignSelf: "center",
       color: "white",
       height: 30,
       width: 155, 
       marginLeft: 60,
       transform: [
          { scaleX: 1.4 }, 
          { scaleY: 1.4 },
       ]
    },
    pickerItemStyle: {
       fontSize: 23,
       textAlign: 'center'
    },
});

export default AddLogPicker;