import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-community/picker';
import Header from './Header';

const Settings = ({ unitSystem, setUnitSystem, setSettingsModalVisible }) => {

    return(
        <View>
            <View style={styles.unitSystemView}>
                <Header title="Settings"/>
                <Text style={styles.unitSystemText}>Unit System</Text>
                <Picker 
                    style={styles.unitSystemPicker}
                    mode={"dropdown"}
                    selectedValue={unitSystem}
                    onValueChange={(itemValue) => setUnitSystem(itemValue)}
                >
                    <Picker.Item label="Imperial" value="Imperial"/>
                    <Picker.Item label="Metric" value="Metric"/>
                </Picker>
            </View>
            <TouchableOpacity 
                style={styles.doneBtn} 
                onPress={() => setSettingsModalVisible(false)}
            >
                <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    unitSystemView: {
        marginBottom: 85,
        borderBottomWidth: 1,
        borderBottomColor: "#BDBDBD"
    },
    unitSystemText: {
        marginTop: 10,
        fontSize: 20,
        color: "black",
        alignSelf: "center"
    },
    unitSystemPicker: {
        alignSelf: "center",
        width: 140,
        marginLeft: 15
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
        fontSize: 16,
        color: "white"
    },
})

export default Settings;