import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Modal from 'react-native-modal';
import RangeSlider from 'rn-range-slider';

const FilterLogs = ({ months, years, filter, setSelectedMonthValue, setSelectedYearValue, selectedMonthValue, selectedYearValue }) => {

    const [isRangeModalVisible, setRangeModalVisible] = useState(false);

    const toggleRangeModal = () => {
        setRangeModalVisible(!isRangeModalVisible);
    }

    return (
        <View style={styles.dropDownMonthsView}>
            <Text style={styles.monthText}>Month</Text>
            <Picker
                selectedValue={selectedMonthValue}
                mode="dropdown"
                style={{ height: 30, width: 102, bottom:6, left: 8 }}
                onValueChange={(itemValue) => {setSelectedMonthValue(itemValue), filter(itemValue, selectedYearValue)}}
            >
                {months.map((month) => { 
                    return (
                        <Picker.Item key={uuid()} label={month.label} value={month.label}/>
                        )
                })}

            </Picker>
            <Text style={styles.daysText}>Days</Text>
            <TouchableOpacity onPress={toggleRangeModal}>
                <Text style={styles.daysRange}>0 - 31</Text>
            </TouchableOpacity>
            <Text style={styles.yearText}>Year</Text>
            <Picker
                selectedValue={selectedYearValue}
                mode="dropdown"
                style={{ height: 30, width: 102, bottom: 6, left: 38 }}
                onValueChange={(itemValue) => {setSelectedYearValue(itemValue), filter(selectedMonthValue, itemValue)}}
            >
                {years.map((year) => {
                    return (
                    <Picker.Item key={uuid()} label={year.label} value={year.label}/>
                    )
                })}

            </Picker>
            <Modal onRequestClose={() => {setRangeModalVisible(!isRangeModalVisible)}} isVisible={ isRangeModalVisible } style={styles.rangeModal}>
                <View>
                    <RangeSlider
                    style={{width: 180, height: 80}}
                    gravity={'center'}
                    min={1}
                    max={31}
                    step={1}
                    selectionColor="#2C95FF"
                    blankColor="#f618"
                    />
                </View>
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
        marginBottom: 350,
        backgroundColor: "white", 
        flex: 1,
        alignItems: "center"
    }
});

export default FilterLogs;