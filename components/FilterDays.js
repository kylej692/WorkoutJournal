import React, {useState} from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import 'react-native-get-random-values';
import RangeSlider from 'rn-range-slider';

const FilterDays = ({ filter, selectedMonthValue, selectedYearValue, copyRangeLow, copyRangeHigh, setCopyRangeLow, setCopyRangeHigh, setRangeHigh, setRangeLow, setRangeModalVisible }) => {
    return(
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
                        setCopyRangeLow(low)
                        setCopyRangeHigh(high)
                    };
                }}
            />
            <TouchableOpacity style={styles.doneBtn} onPress={() => {
                setRangeLow(copyRangeLow),
                setRangeHigh(copyRangeHigh),
                filter(selectedMonthValue, selectedYearValue, copyRangeLow, copyRangeHigh),
                setRangeModalVisible(false)
            }}>
                <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
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

export default FilterDays;