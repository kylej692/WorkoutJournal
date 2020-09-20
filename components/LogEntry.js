import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Text } from 'native-base';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import WorkoutListDisplay from './WorkoutListDisplay';

const LogEntry = ({ item, toggleInfoModal, toggleDateModal, unitSystem }) => {

    return (
        <View>
            <TouchableOpacity style={styles.dateTouchableOpacity} onPress={() => {
                toggleDateModal(item);
            }}>
                <Header style={styles.dateHeader}>
                    <Icon style={{ color: "white", paddingRight: 10 }} name="clock-o" size={18}/>
                    <Text style={styles.timeText}>{item.time.start + "-" + item.time.end}</Text>
                </Header>
            </TouchableOpacity>
            <WorkoutListDisplay
                item={item} 
                toggleInfoModal={toggleInfoModal}
                toggleDateModal={toggleDateModal}
                unitSystem={unitSystem}
                key={item.id} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    dateTouchableOpacity: {
        marginTop: 5
    },
    timeText: { 
        fontSize: 15, 
        marginRight: 10,
        color: "white" 
    },
    dateHeader: {
        height: 30, 
        alignItems: "center", 
        backgroundColor: "#2C95FF"
    }
  });

export default LogEntry;