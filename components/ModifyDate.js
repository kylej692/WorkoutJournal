import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Content, Text } from 'native-base';
import Header from '../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';

const ModifyDate = ({ date, start, end, setDateModalVisible }) => {
    const [newDate, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [dateShow, setDateShow] = useState(false);

    const onChangeDateTime = (event, selectedDate) => {
        console.log(selectedDate.toString());
        const currentDate = selectedDate || newDate;
        setDateShow(Platform.OS === "ios");
        setDate(currentDate);
      };
    
      const showMode = currentMode => {
        setDateShow(true);
        setMode(currentMode);
      };
    
      const showDatePicker = () => {
        showMode("date");
      };
    
      const showTimePicker = () => {
        showMode("time");
      };    

    return (
        <View>
            <Header title="Edit Date" />
            <Content padder>
                <View style={styles.dateTimeView}>
                    <Text style={styles.dateTimeLabelText}>Date:</Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Text style={styles.dateTimeText}>{date}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.dateTimeView}>
                    <Text style={styles.dateTimeLabelText}>Time:</Text>
                    <TouchableOpacity onPress={showTimePicker}>
                        <Text style={styles.dateTimeText}>{start}</Text>
                    </TouchableOpacity>
                    <Text style={styles.hyphenText}>-</Text>
                    <TouchableOpacity onPress={showTimePicker}>
                        <Text style={styles.dateTimeText}>{end}</Text>
                    </TouchableOpacity>
                </View>
                {dateShow && (
                    <DateTimePicker 
                        testID="dateTimePicker"
                        timeZoneOffsetInMinutes={0}
                        value={newDate}
                        mode={mode}
                        is24Hour={false}
                        display="default"
                        onChange={onChangeDateTime}
                    />
                )}
            </Content>
            <TouchableOpacity style={styles.doneBtn} onPress={() => {setDateModalVisible(false)}}><Text style={styles.doneText}>Done</Text></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    dateTimeView: {
        flex: 1,
        flexDirection: "row",
        width: 370,
        padding: 5
    },
    dateTimePicker: {
        backgroundColor: "#2C95FF"
    },
    dateTimeLabelText: {
        fontSize: 25,
        marginLeft: 20
    },
    dateTimeText: {
        fontSize: 20,
        marginLeft: 10,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: "black",
    },
    hyphenText: {
        fontSize: 20,
        marginLeft: 10,
        marginTop: 5,
    },
    doneBtn: { 
        position: "absolute", 
        bottom: 10, 
        alignSelf: "center",
        backgroundColor: "#2C95FF",
        height: 35,
        width: 55,
        padding: 5,
        borderRadius: 8,
        flexWrap: "wrap",
        flexDirection: "row" 
    },
    doneText: {
        marginLeft: 3,
        color: "white"
    }
});

export default ModifyDate;