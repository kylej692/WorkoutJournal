import React from 'react';
import { Container, Header, Content, Card, CardItem, Text, Body } from 'native-base';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const LogEntry = ({ item, deleteItem }) => {
    var today = new Date();
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    var date = (months[today.getMonth()])+' '+today.getDate()+', '+today.getFullYear();
    var count = 0;
    return (
            <Content padder>
                <Header style={{ backgroundColor: "#AB96FF" }}><Text>{date}</Text></Header>
                    {item.workouts.map((workout) => {
                        return (
                            <Card>
                                <CardItem header bordered>
                                    <Text>{workout.name}</Text>
                                </CardItem>
                                    {workout.sets.map((set) => {
                                        return (
                                        <CardItem bordered>
                                            <Body>
                                                <Text>
                                                    {"Reps: " + set.reps + "     " + "Weight: " + set.weight}
                                                </Text>
                                            </Body>
                                        </CardItem>
                                        )})
                                    }
                            </Card>
                            )
                        })
                    }
            </Content>
    );
}

export default LogEntry;