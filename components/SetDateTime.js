import React, { useState } from 'react';
import {  Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';
import DateTimePicker from '@react-native-community/datetimepicker';
import { timeConvertTo12 } from '../utils';

const SetDateTime = ({ date, setDate, time, setTime, setDisplayDate, setDisplayTime }) => {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState('date');
    const [isStart, setIsStart] = useState(true);

    const onChangeDate = (dateValue) => setTime({...time, date: dateValue });
    const onChangeStart = (startValue) => setTime({...time, start: startValue });
    const onChangeEnd = (endValue) => setTime({...time, end: endValue });

    const onChangeTime = (event, selectedDate) => {
        if(event.type === "set") {
           const currentDate = selectedDate || date;
           const currentDateTimeStr = currentDate.toString(0, 21);
           const monthDayStr = currentDateTimeStr.slice(4, 10);
           const yearStr = currentDateTimeStr.slice(11, 15);
           const dateStr = monthDayStr + ", " + yearStr;
           const timeStr = currentDateTimeStr.slice(16, 21);
           setShow(Platform.OS === 'ios');
           setDate(currentDate);
           onChangeDate(dateStr);
           setDisplayDate(true);
           if (mode == 'time') {
              if (isStart) {
                 onChangeStart(timeConvertTo12(timeStr));
              } else {
                 onChangeEnd(timeConvertTo12(timeStr));
              }
              setDisplayTime(true);
           }
        } else {
           setShow(Platform.OS === 'ios');
        }
     };
  
     const showMode = currentMode => {
        setShow(true);
        setMode(currentMode);
     };
  
     const showDatepicker = () => {
        showMode('date');
     };
  
     const showTimepicker = (isStart) => {
        showMode('time');
        setIsStart(isStart);
     };

    return (
        <View style={styles.buttonView}>
            <TouchableOpacity style={styles.time} onPress={showDatepicker}>
                <Text style={styles.buttonText}> Set Date</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.time} onPress={() => {showTimepicker(true)}}>
                <Text style={styles.buttonText}> Set Start Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.time} onPress={() => {showTimepicker(false)}}>
                <Text style={styles.buttonText}> Set End Time</Text>
            </TouchableOpacity>
            {show && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={false}
                    display="default"
                    onChange={onChangeTime}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create ({
    buttonView: {
        alignSelf: "center",
        flexDirection: "row",
        marginTop: 5,
        marginBottom: 20
     },
     time: {
        backgroundColor: "#2C95FF",
        marginHorizontal: 5,
        padding: 5,
        borderRadius: 10,
        top: 10
     },
     buttonText: {
        marginLeft: 4,
        marginRight: 5,
        color: "white",
        fontSize: 19,
     },
})

export default SetDateTime;