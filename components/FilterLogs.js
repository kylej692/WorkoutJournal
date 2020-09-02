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
        <View style={styles.dropDownMonthsView}>
            <View style={{ marginLeft: 10 }}>
                <TouchableOpacity onPress={showDatepicker}>
                    <Icon style={{ color: "white" }} name="calendar-alt" size={25}/>
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
                <Icon style={{ position: "absolute", right: 20, color: "black" }}name="circle" size={11}/>
                <TouchableOpacity 
                    onPress={() => {
                        var currDate = new Date();
                        var currMonth = months[currDate.getMonth()];
                        var currYear = currDate.getFullYear().toString();
                        var currDay = currDate.getDate().toString();
                        if(currMonth != selectedMonthValue || currDay != selectedDayValue || currYear != selectedYearValue) {
                            setSelectedMonthValue(currMonth);
                            setSelectedDayValue(currDay);
                            setSelectedYearValue(currYear);
                            setDate(currDate);
                            filter(currMonth, currYear, currDay);
                        }
                    }
                }>
                    <Text style={{ fontSize: 17 }}>{selectedMonthValue + " " + selectedDayValue + ", " + selectedYearValue}</Text>
                </TouchableOpacity>
                <Icon style={{ position: "absolute", left: 13, color: "black" }}name="circle" size={11}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    dropDownMonthsView: {
        flex: 1,
        position: "absolute",
        padding: 10,
        marginTop: 7
    },
    dateView: { 
        flex: 1,
        flexDirection: "row",
        position: "absolute",
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: "#9AC2FF", 
        height: 35,
        width: 420,
        marginTop: 52,
    },
});

export default FilterLogs;