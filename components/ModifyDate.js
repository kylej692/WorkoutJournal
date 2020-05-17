import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Content, Text } from 'native-base';
import Header from '../components/Header';
import DateTimePicker from '@react-native-community/datetimepicker';

const ModifyDate = ({ item, modifyDateTime, setDateModalVisible }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currMonth = months.indexOf(item.time.date.slice(0, 3));
    const currDay = parseInt(item.time.date.slice(4, 6));
    const currYear = parseInt(item.time.date.slice(8, 12));

    const timeConvertTo24 = (time) => {
        var newTime = {};

        var hour;
        var minute;
        var meridiem;

        if(time.length == 6) {
            hour = parseInt(time.slice(0, 1));
            minute = parseInt(time.slice(2, 4));
            meridiem = time.slice(4, 6);
        } else {
            hour = parseInt(time.slice(0, 2));
            minute = parseInt(time.slice(3, 5));
            meridiem = time.slice(5, 7);
        }
        
        if(meridiem === "pm" && hour < 12) {
            hour = hour + 12;
        } else if(meridiem === "am" && hour == 12) {
            hour = 0;
        }

        newTime.minute = minute;
        newTime.hour = hour;

        return newTime;
    };

    const currStartHour = timeConvertTo24(item.time.start);
    const currStartMinute = timeConvertTo24(item.time.start);
    
    const [newDate, setDate] = useState(new Date(currYear, currMonth, currDay));
    const [newDateStr, setDateStr] = useState(item.time.date);
    const [newStart, setStart] = useState(item.time.start);
    const [newEnd, setEnd] = useState(item.time.end);
    const [mode, setMode] = useState("date");
    const [isStart, setIsStart] = useState(true)
    const [dateShow, setDateShow] = useState(false);

    const onChangeDateTime = (event, selectedDate) => {
        const currentDate = selectedDate || newDate;
        if(event.type === "set") {
            const currentDateTimeStr = currentDate.toString(0, 21);
            const monthDayStr = currentDateTimeStr.slice(4, 10);
            const yearStr = currentDateTimeStr.slice(11, 15);
            const dateStr = monthDayStr + ", " + yearStr;
            setDateShow(Platform.OS === 'ios');
            setDateStr(dateStr);
            const timeStr = currentDateTimeStr.slice(16, 21);
            if(mode === "time") {
                if (isStart) {
                    setStart(timeStr);
                } else {
                    setEnd(timeStr);
                }
            }
            setDate(currentDate);

        } else {
            setDateShow(Platform.OS === 'ios');
            setDate(currentDate);
        }
      };
    
      const showMode = currentMode => {
        setDateShow(true);
        setMode(currentMode);
      };
    
      const showDatePicker = () => {
        showMode("date");
      };
    
      const showTimePicker = (isStart) => {
        showMode("time");
        setIsStart(isStart);
      };    

    return (
        <View>
            <Header title="Edit Date" />
            <Content padder>
                <View style={styles.dateTimeView}>
                    <Text style={styles.dateTimeLabelText}>Date:</Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Text style={styles.dateTimeText}>{newDateStr}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.dateTimeView}>
                    <Text style={styles.dateTimeLabelText}>Time:</Text>
                    <TouchableOpacity onPress={() => {showTimePicker(true)}}>
                        <Text style={styles.dateTimeText}>{newStart}</Text>
                    </TouchableOpacity>
                    <Text style={styles.hyphenText}>-</Text>
                    <TouchableOpacity onPress={() => {showTimePicker(false)}}>
                        <Text style={styles.dateTimeText}>{newEnd}</Text>
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
            <TouchableOpacity style={styles.doneBtn} onPress={() => {
                modifyDateTime(item.id, newDateStr, newStart, newEnd),
                setDateModalVisible(false)
            }}>
                <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
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