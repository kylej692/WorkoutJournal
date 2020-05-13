import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Content, Card, CardItem, Text, Body } from 'native-base';
import Modal from 'react-native-modal';
import ModifyLog from '../components/ModifyLog';

const LogEntry = ({ item, deleteItem, modifyWorkout }) => {
    var count = 0;

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setWorkout] = useState({});

    const toggleModal = (workout) => {
        setModalVisible(!isModalVisible);
        setWorkout(workout)
    }

    return (
            <View>
                <Header style={styles.dateHeader}>
                    <Text style={styles.dateText}>{item.time.date + "    "}</Text>
                    <Text style={styles.timeText}>{item.time.start + "-" + item.time.end}</Text>
                </Header>
                {item.workouts.map((workout) => {
                    return (
                        <Card key={workout.id}>
                            <CardItem header bordered style={styles.cardHeader}>  
                                <TouchableOpacity onPress={() => {
                                    toggleModal(workout);
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
                <Modal onRequestClose={() => {setModalVisible(!isModalVisible)}} isVisible={ isModalVisible } style={styles.modal}>
                    <ModifyLog workout={selectedWorkout} modifyWorkout={modifyWorkout} deleteItem={deleteItem} setModalVisible={setModalVisible}/>
                </Modal>
            </View>
    );
}

const styles = StyleSheet.create({
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
    modal: { 
        backgroundColor: "white", 
        height: 50, 
        alignItems: "center"
    }
  });

export default LogEntry;