import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Modal from 'react-native-modal';
import FilterDays from '../components/FilterDays';

const FilterLogs = ({ months, years, filter, setSelectedMonthValue, setSelectedYearValue, selectedMonthValue, selectedYearValue, rangeLow, rangeHigh, setRangeLow, setRangeHigh }) => {

    const [isRangeModalVisible, setRangeModalVisible] = useState(false);
    const [copyRangeLow, setCopyRangeLow] = useState(rangeLow);
    const [copyRangeHigh, setCopyRangeHigh] = useState(rangeHigh);
    
    const toggleRangeModal = () => {
        setRangeModalVisible(!isRangeModalVisible);
    };

    return (
        <View style={styles.dropDownMonthsView}>
            <Text style={styles.monthText}>Month</Text>
            <Picker
                selectedValue={selectedMonthValue}
                mode="dropdown"
                style={{ height: 30, width: 102, bottom:6, left: 8 }}
                onValueChange={(itemValue) => {setSelectedMonthValue(itemValue), filter(itemValue, selectedYearValue, rangeLow, rangeHigh)}}
            >
                {months.map((month) => { 
                    return (
                        <Picker.Item key={uuid()} label={month.label} value={month.label}/>
                        )
                })}

            </Picker>
            <Text style={styles.daysText}>Days</Text>
            <TouchableOpacity onPress={toggleRangeModal}>
                <Text style={styles.daysRange}>{rangeLow + " - " + rangeHigh}</Text>
            </TouchableOpacity>
            <Text style={styles.yearText}>Year</Text>
            <Picker
                selectedValue={selectedYearValue}
                mode="dropdown"
                style={{ height: 30, width: 102, bottom: 6, left: 38 }}
                onValueChange={(itemValue) => {setSelectedYearValue(itemValue), filter(selectedMonthValue, itemValue, rangeLow, rangeHigh)}}
            >
                {years.map((year) => {
                    return (
                    <Picker.Item key={uuid()} label={year.label} value={year.label}/>
                    )
                })}

            </Picker>
            <Modal 
                onRequestClose={() => {
                    setRangeModalVisible(!isRangeModalVisible),
                    setCopyRangeLow(rangeLow),
                    setCopyRangeHigh(rangeHigh)
                }} 
                isVisible={ isRangeModalVisible } style={styles.rangeModal}
            >
                <FilterDays 
                    filter={filter}
                    selectedMonthValue={selectedMonthValue}
                    selectedYearValue={selectedYearValue}
                    copyRangeLow={copyRangeLow} 
                    copyRangeHigh={copyRangeHigh} 
                    setCopyRangeLow={setCopyRangeLow} 
                    setRangeLow={setRangeLow}
                    setRangeHigh={setRangeHigh}
                    setCopyRangeHigh={setCopyRangeHigh} 
                    setRangeModalVisible={setRangeModalVisible} 
                />
            </Modal>
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
    monthText: {
        fontSize: 14,
        bottom: 0,
        left: 5
    },
    daysText: {
        fontSize: 14,
        bottom: 0,
        left: 18
    },
    daysRange: {
        fontSize: 15,
        color: 'black',
        bottom: 0,
        marginLeft: 25
    },
    yearText: {
        fontSize: 14,
        bottom: 0,
        left: 35
    },
    rangeModal: {
        position: "relative",
        marginTop: 250,
        marginBottom: 315,
        backgroundColor: "white", 
        flex: 1,
        alignItems: "center"
    }
});

export default FilterLogs;