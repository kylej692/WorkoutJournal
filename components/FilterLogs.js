import React, {useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';

const FilterLogs = ({ filter, setSelectedMonthValue, setSelectedYearValue, setSelectedDayValue, selectedMonthValue, selectedDayValue, selectedYearValue }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currMonth = months.indexOf(selectedMonthValue);
    const currDay = parseInt(selectedDayValue);
    const currYear = parseInt(selectedYearValue);

    const [date, setDate] = useState(new Date(currYear, currMonth, currDay));
    const [show, setShow] = useState(false);
  
    const onChangeDate = (month, year, day) => {
        filter(month, year, day);
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

           setShow(Platform.OS === 'ios');
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
            <TouchableOpacity onPress={showDatepicker}>
                <Icon style={{ color: "white" }} name="calendar" size={25}/>
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
    )
}

const styles = StyleSheet.create({
    dropDownMonthsView: {
        flex: 1,
        position: 'absolute',
        padding: 10,
        marginTop: 7,
        marginLeft: 10
    }
});

export default FilterLogs;