import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Card, CardItem, Text, Body } from 'native-base';
import Modal from 'react-native-modal';
import ModifyLog from '../components/ModifyLog';
import ModifyDate from '../components/ModifyDate';

const LogEntry = ({ item, deleteWorkout, modifyWorkout, modifyDateTime }) => {
    var count = 0;

    const [isInfoModalVisible, setInfoModalVisible] = useState(false);
    const [isDateModalVisible, setDateModalVisible] = useState(false);
    const [selectedWorkout, setWorkout] = useState({});
    const [selectedItem, setItem] = useState({});

    const toggleInfoModal = (workout) => {
        setInfoModalVisible(!isInfoModalVisible);
        setWorkout(workout)
    }

    const toggleDateModal = (item) => {
        setDateModalVisible(!isDateModalVisible);
        setItem(item);
    }

    return (
            <View>
                <TouchableOpacity style={styles.dateTouchableOpacity} onPress={() => {
                    toggleDateModal(item);
                }}>
                    <Header style={styles.dateHeader}>
                        <Text style={styles.dateText}>{item.time.date + "    "}</Text>
                        <Text style={styles.timeText}>{item.time.start + "-" + item.time.end}</Text>
                    </Header>
                </TouchableOpacity>
                {item.workouts.map((workout) => {
                    return (
                        <Card key={workout.id} style={styles.card}>
                            <CardItem header bordered style={styles.cardHeader}>  
                                <TouchableOpacity onPress={() => {
                                    toggleInfoModal(workout);
                                }}>
                                    <Text style={styles.workoutName}>{workout.name}</Text>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem bordered style={styles.cardLabelContainer}>
                                <Text>{"Set"}</Text>
                                <Text style={styles.cardText}>{"Reps"}</Text>
                                <Text style={styles.cardText}>{"Weight"}</Text>
                            </CardItem>                            
                            {workout.sets.map((set) => {
                                count += 1;
                                return (
                                <CardItem bordered style={styles.cardInfoContainer} key={set.id}>
                                    <Body style={styles.cardBody}>
                                        <Text>{set.num}</Text>
                                        <Text style={styles.cardText}>{set.reps}</Text>
                                        <Text style={styles.cardText}>{set.weight}</Text>
                                    </Body>
                                </CardItem>
                                )})
                            }
                        </Card>
                        )
                    })
                }
                <Modal onRequestClose={() => {setInfoModalVisible(!isInfoModalVisible)}} isVisible={ isInfoModalVisible } style={styles.infoModal}>
                    <ModifyLog workout={selectedWorkout} modifyWorkout={modifyWorkout} deleteWorkout={deleteWorkout} setInfoModalVisible={setInfoModalVisible}/>
                </Modal>
                <Modal onRequestClose={() => {setDateModalVisible(!isDateModalVisible)}} isVisible={ isDateModalVisible } style={styles.dateModal}>
                    <ModifyDate item={selectedItem} modifyDateTime={modifyDateTime} setDateModalVisible={setDateModalVisible}/>
                </Modal>
            </View>
    );
}

const styles = StyleSheet.create({
    dateTouchableOpacity: {
        marginTop: 5
    },
    dateText: { 
        fontSize: 17, 
        marginRight: "auto", 
        color: "white" 
    },
    timeText: { 
        fontSize: 13, 
        color: "white" 
    },
    dateHeader: {
        height: 30, 
        alignItems: "center", 
        backgroundColor: "#2C95FF"
    },
    cardHeader: {
        height: 45, 
        borderBottomWidth: 1, 
        borderColor: "black"
    },
    workoutName: {
        color:"black", 
        fontWeight: "bold", 
        fontSize: 19
    },
    cardLabel: { 
        height: 40, 
        borderBottomWidth: 1, 
        borderColor: "black" 
    },
    cardText: {
        marginLeft: "auto",
    },
    cardBody: { 
        flexDirection:"row" 
    },
    cardInfoContainer: { 
        height: 40 
    },
    infoModal: { 
        position: "relative",
        marginTop: 50,
        marginBottom: 50,
        backgroundColor: "white", 
        flex: 1,
        alignItems: "center"
    },
    dateModal: {
        position: "relative",
        marginTop: 250,
        marginBottom: 250,
        backgroundColor: "white", 
        flex: 1,
        alignItems: "center"
    }
  });

export default LogEntry;