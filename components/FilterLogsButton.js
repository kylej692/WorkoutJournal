import React, {useState} from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-community/picker';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';

const FilterLogsButton = ({ months, years, filter }) => {
    const [selectedMonthValue, setSelectedMonthValue] = useState("None");
    const [selectedYearValue, setSelectedYearValue] = useState("None");

    return (
        <View style={styles.dropDownMonthsView}>
            <Text style={styles.filterText}>Filter</Text>
            <Text style={styles.monthText}>Month</Text>
            <Picker
                selectedValue={selectedMonthValue}
                mode="dropdown"
                style={{ height: 30, width: 102, bottom:6, left: 98 }}
                onValueChange={(itemValue) => {setSelectedMonthValue(itemValue), filter(itemValue, selectedYearValue)}}
            >
                {months.map((month) => { 
                    return (
                        <Picker.Item key={uuid()} label={month.label} value={month.label}/>
                        )
                })}

            </Picker>
            <Text style={styles.yearText}>Year</Text>
            <Picker
                selectedValue={selectedYearValue}
                mode="dropdown"
                style={{ height: 30, width: 102, bottom: 6, left: 103 }}
                onValueChange={(itemValue) => {setSelectedYearValue(itemValue), filter(selectedMonthValue, itemValue)}}
            >
                {years.map((year) => {
                    return (
                    <Picker.Item key={uuid()} label={year.label} value={year.label}/>
                    )
                })}

            </Picker>
        </View>
    )
}

const styles = StyleSheet.create({
    dropDownMonthsView: {
        flex: 1,
        flexDirection: 'row',
        position: 'absolute',
        top: 60,
        height: 40,
        padding: 10,
        width: 500,
        backgroundColor: '#9AC2FF'
    },
    filterText: {
        fontSize: 15,
        bottom: 1,
        left: 5,
        color: 'black'
    },
    monthText: {
        fontSize: 14,
        bottom: 1,
        left: 88
    },
    yearText: {
        fontSize: 14,
        bottom: 1,
        left: 98
    }
});

export default FilterLogsButton;