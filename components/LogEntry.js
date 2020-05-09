import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Content, Card, CardItem, Text, Body } from 'native-base';
import Modal from 'react-native-modal';
import ModifyLog from '../components/ModifyLog';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const LogEntry = ({ item, deleteItem }) => {
    var count = 0;

    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedWorkout, setWorkout] = useState({});
    
    const toggleModal = (workout) => {
        setModalVisible(!isModalVisible);
        setWorkout(workout)
    }

    return (
            <Content padder>
                <Header style={styles.dateHeader}>
                    <Text style={styles.dateText}>{item.time.date + "    "}</Text>
                    <Text style={styles.timeText}>{item.time.start + "-" + item.time.end}</Text>
                </Header>
                {item.workouts.map((workout) => {
                    count = 0;
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
                                        <Text>{count}</Text>
                                        <Text style={styles.cardText}>{set.reps}</Text>
                                        <Text style={styles.cardText}>{set.weight}</Text>
                                    </Body>
                                </CardItem>
                                )})
                            }
                            <Modal scrollOffset={0} onRequestClose={() => {setModalVisible(!isModalVisible)}} isVisible={ isModalVisible } style={styles.modal}>
                                <ModifyLog workout={selectedWorkout} />
                                <TouchableOpacity style={styles.deleteBtn} onPress={() => {
                                    deleteItem(selectedWorkout.id), 
                                    setModalVisible(!isModalVisible)}}>
                                    <Icon style={styles.deleteIcon} name="delete" size={20} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => {setModalVisible(!isModalVisible)}}><Text>Cancel</Text></TouchableOpacity>
                            </Modal>
                        </Card>
                        )
                    })
                }
            </Content>
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
        flexDirection: "row", 
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
    },
    deleteBtn: { 
        position: 'absolute', 
        bottom: 10, 
        right: 10 
    },
    deleteIcon: { 
        color: "red" 
    },
    cancelBtn: { 
        position: 'absolute', 
        bottom: 10, 
        left: 10 
    }
  });

export default LogEntry;