import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Header, Content, Card, CardItem, Text, Body } from 'native-base';
import Modal from 'react-native-modal';
import ModifyLog from '../components/ModifyLog';

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
                <Header style={{ height: 30, alignItems: "center", flexDirection: "row", backgroundColor: "#2C95FF" }}>
                    <Text style={{ fontSize: 17, marginRight: "auto", color: "white" }}>{item.time.date + "    "}</Text>
                    <Text style={{ fontSize: 13, color: "white" }}>{item.time.start + "-" + item.time.end}</Text>
                </Header>
                {item.workouts.map((workout) => {
                    count = 0;
                    return (
                        <Card key={workout.id}>
                            <CardItem header bordered style={{ height: 45, borderBottomWidth: 1, borderColor: "black" }}>  
                                <TouchableOpacity onPress={() => {
                                    toggleModal(workout);
                                }}>
                                    <Text style={{ color:"black", fontWeight: "bold", fontSize: 19 }}>{workout.name}</Text>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem bordered style={{ height: 40, borderBottomWidth: 1, borderColor: "black" }}>
                                <Text style={{ color:"black" }}>{"Set"}</Text>
                                <Text style={{ color:"black", marginLeft: 130 }}>{"Reps"}</Text>
                                <Text style={{ color:"black", marginLeft: "auto" }}>{"Weight"}</Text>
                            </CardItem>                            
                            {workout.sets.map((set) => {
                                count += 1;
                                return (
                                <CardItem bordered style={{ height: 40 }} key={set.id}>
                                    <Body style={{ flexDirection:"row" }}>
                                        <Text>{count}</Text>
                                        <Text style={{ marginLeft: "auto" }}>{set.reps}</Text>
                                        <Text style={{ marginLeft: "auto" }}>{set.weight}</Text>
                                    </Body>
                                </CardItem>
                                )})
                            }
                            <Modal isVisible={ isModalVisible } style={{ backgroundColor: "white", height: 50, alignItems: "center" }}>
                                <ModifyLog workout={selectedWorkout} />
                                <TouchableOpacity style={{ padding: 10 }} onPress={() => {
                                    deleteItem(selectedWorkout.id)}}>
                                    <Text style={{ color: "red" }}>Delete</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ padding: 10 }} onPress={toggleModal}><Text>Cancel</Text></TouchableOpacity>
                            </Modal>
                        </Card>
                        )
                    })
                }
            </Content>
    );
}

export default LogEntry;