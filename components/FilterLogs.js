import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-community/picker';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Modal from 'react-native-modal';
import RangeSlider from 'rn-range-slider';

const FilterLogs = ({ months, years, filter, setSelectedMonthValue, setSelectedYearValue, selectedMonthValue, selectedYearValue, rangeLow, rangeHigh, setRangeLow, setRangeHigh }) => {

    const [isRangeModalVisible, setRangeModalVisible] = useState(false);
    const [copyRangeLow, setCopyRangeLow] = useState(rangeLow);
    const [copyRangeHigh, setCopyRangeHigh] = useState(rangeHigh);
    
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
            <Text style={styles.daysRange}>{rangeLow + " - " + rangeHigh}</Text>
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
                    <View style={styles.header}>
                        <Text style={styles.headerText}>Filter Days</Text>
                    </View>
                    <View style={styles.rangeTextView}>
                        <Text style={styles.rangeLowText}>{copyRangeLow}</Text>
                        <Text style={styles.rangeHighText}>{copyRangeHigh}</Text>
                    </View>
                    <RangeSlider
                    style={{width: 230, height: 80, marginLeft: 65, bottom: 5 }}
                    gravity={'center'}
                    min={1}
                    max={31}
                    initialLowValue={copyRangeLow}
                    initialHighValue={copyRangeHigh}
                    step={1}
                    labelStyle="none"
                    selectionColor="#2C95FF"
                    blankColor="#90DDFF"
                    onValueChanged = {(low, high, fromUser) => {
                        if(fromUser) {
                            console.log('got here')
                            setCopyRangeLow(low)
                            setCopyRangeHigh(high)
                        };
                    }}
                    />
                    <TouchableOpacity style={styles.doneBtn} onPress={() => {
                        setRangeLow(copyRangeLow),
                        setRangeHigh(copyRangeHigh),
                        setRangeModalVisible(false)
                    }}>
                        <Text style={styles.doneText}>Done</Text>
                     </TouchableOpacity>
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
        marginBottom: 315,
        backgroundColor: "white", 
        flex: 1,
        alignItems: "center"
    },
    header: {
        height: 40,
        padding: 15,
        width: 370,
        alignItems: "center",
        backgroundColor: '#2C95FF',
        bottom: 33
    },
    headerText: {
        color: '#fff',
        fontSize: 20,
        bottom: 10,
        textAlign: 'center'
    },
    rangeTextView: {
        flexDirection: "row"
    },
    rangeLowText: {
        position: "absolute",
        fontSize: 20,
        left: 64
    },
    rangeHighText: {
        position: "absolute",
        fontSize: 20,
        left: 274
    },
    doneBtn: { 
        position: "absolute", 
        right: 160,
        top: 110,
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
        fontSize: 17,
        color: "white"
    }
});

export default FilterLogs;