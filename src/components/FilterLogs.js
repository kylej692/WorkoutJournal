import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import 'react-native-get-random-values';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import DateTimePicker from '@react-native-community/datetimepicker';

const FilterLogs = ({ filter, setSelectedMonthValue, setSelectedYearValue, setSelectedDayValue, selectedMonthValue, selectedDayValue, selectedYearValue }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months.indexOf(selectedMonthValue);
    const day = parseInt(selectedDayValue);
    const year = parseInt(selectedYearValue);
    
    const [date, setDate] = useState(new Date(year, month, day));
    const [show, setShow] = useState(false);

    const onChangeDate = (month, year, day) => {
        if(selectedMonthValue != month || selectedDayValue != day || selectedYearValue != year) {
            filter(month, year, day);
        }
    };

    const onChangeDateTime = (event, selectedDate) => {
        if(event.type === "set") {
           const currentDate = selectedDate || date;
           const currentDateTimeStr = currentDate.toString(0, 21);
           const monthStr = currentDateTimeStr.slice(4, 7);
           const dayStr = currentDateTimeStr.slice(8, 10);
           const yearStr = currentDateTimeStr.slice(11, 15);
           setShow(Platform.OS === 'ios');
            
           setSelectedMonthValue(monthStr);
           setSelectedYearValue(yearStr);
           setSelectedDayValue(dayStr);

           setDate(currentDate);
           onChangeDate(monthStr, yearStr, dayStr);
           
        } else {
           setShow(Platform.OS === 'ios');
        }
     };
  
     const showMode = currentMode => {
        setShow(true);
     };
  
     const showDatepicker = () => {
        showMode('date');
     };


    return (
        <View style={styles.filterCalendarView}>
            <View style={styles.calendarFilterBtn}>
                <TouchableOpacity onPress={showDatepicker}>
                    <Icon style={styles.calendarIcon} name="calendar-alt" size={25}/>
                </TouchableOpacity>
                {show && (
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={date}
                        mode={"date"}
                        is24Hour={false}
                        display="default"
                        onChange={onChangeDateTime}
                    />
                )}
            </View>
            <View style={styles.dateView}>
                <Icon style={styles.leftCircle} name="circle" size={11}/>
                <TouchableOpacity 
                    onPress={() => {
                        var currDate = new Date();
                        var currMonth = months[currDate.getMonth()];
                        var currYear = currDate.getFullYear().toString();
                        var currDay = currDate.getDate().toString();
                        if(currDay.length == 1) {
                            currDay = "0" + currDay
                          }
                        if(currMonth != selectedMonthValue || currDay != selectedDayValue || currYear != selectedYearValue) {
                            setSelectedMonthValue(currMonth);
                            setSelectedDayValue(currDay);
                            setSelectedYearValue(currYear);
                            setDate(currDate);
                            filter(currMonth, currYear, currDay);
                        }
                    }
                }>
                    <Text style={styles.dateText}>{selectedMonthValue + " " + selectedDayValue + ", " + selectedYearValue}</Text>
                </TouchableOpacity>
                <Icon style={styles.rightCircle} name="circle" size={11}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    filterCalendarView: {
        flex: 1,
        position: "absolute",
        padding: 10,
        marginTop: 7
    },
    dateView: { 
        flexDirection: "row",
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#9AC2FF", 
        height: 35,
        width: "139%",
        marginTop: 16,
        marginLeft: -10
    },
    calendarFilterBtn: {
        marginLeft: 10 
    },
    calendarIcon: { 
        color: "white" 
    },
    leftCircle: {  
        alignSelf: "flex-start",
        right: 150,
        top: 12,
        color: "black" 
    },
    rightCircle: { 
        alignSelf: "flex-end",
        left: 110,
        bottom: 12,
        color: "black" 
    },
    dateText: { 
        right: 15,
        fontSize: 17 
    }
});

export default FilterLogs;