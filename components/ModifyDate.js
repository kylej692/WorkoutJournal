import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Content, Text } from 'native-base';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

const ModifyDate = ({ item, modifyDateTime, setDateModalVisible }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currMonth = months.indexOf(item.time.date.slice(0, 3));
    const currDay = parseInt(item.time.date.slice(4, 6));
    const currYear = parseInt(item.time.date.slice(8, 12));

    const timeConvertTo12 = (time) => {
        var hour = parseInt(time.slice(0, 2));
        var minute = time.slice(3, 5);
        var meridiem;
        
        if(hour == 12) {
            meridiem = "pm";
        } else if(hour == 0) {
            hour = 12;
            meridiem = "am";
        } else if (hour > 12) {
            hour = hour - 12;
            meridiem = "pm";
        } else {
            meridiem = "am";
        }

        return hour + ":" + minute + meridiem;
    };
    
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
                    setStart(timeConvertTo12(timeStr));
                } else {
                    setEnd(timeConvertTo12(timeStr));
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
            <Header title="Edit Date/Time" />
            <Content padder>
                <View style={styles.dateTimeView}>
                    <Icon style={styles.calendarIcon} name="calendar" size={20}/>
                    <Text style={styles.dateTimeLabelText}>Date:</Text>
                    <TouchableOpacity onPress={showDatePicker}>
                        <Text style={styles.dateTimeText}>{newDateStr}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.dateTimeView}>
                    <Icon style={styles.timeIcon} name="clock-o" size={20}/>
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
                if (newDateStr != item.time.date || newStart != item.time.start || newEnd != item.time.end) {
                    modifyDateTime(item.id, newDateStr, newStart, newEnd);
                }
                setDateModalVisible(false);
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
        marginLeft: 7
    },
    dateTimeText: {
        fontSize: 20,
        marginLeft: 10,
        marginTop: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#B4B4B4",
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
    },
    calendarIcon: {
        marginLeft: 10,
        marginTop: 7,
        color: "#0061C1"
    },
    timeIcon: {
        marginLeft: 10,
        marginTop: 7,
        color: "black"
    }
});

export default ModifyDate;