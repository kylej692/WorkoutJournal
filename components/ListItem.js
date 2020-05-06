import React from 'react';
import { Header, Content, Card, CardItem, Text, Body } from 'native-base';

const LogEntry = ({ item, deleteItem }) => {
    var count = 0;
    return (
            <Content padder>
                <Header style={{ height: 30, alignItems: "center", flexDirection: "row", backgroundColor: "#C1C1C1" }}>
                    <Text style={{ fontSize: 17, marginRight: "auto" }}>{item.time.date + "    "}</Text>
                    <Text style={{ fontSize: 15 }}>{item.time.start + "-" + item.time.end}</Text>
                </Header>
                {item.workouts.map((workout) => {
                    count = 0;
                    return (
                        <Card>
                            <CardItem header bordered style={{ height: 40 }}>
                                <Text style={{ color:"black", fontWeight: "bold" }}>{workout.name}</Text>
                            </CardItem>
                                {workout.sets.map((set) => {
                                    count += 1;
                                    return (
                                    <CardItem bordered style={{ height: 40 }}>
                                        <Body style={{ flexDirection:"row" }}>
                                            <Text style={{ fontWeight: "bold" }}>{"Set " + count + "    "}</Text>
                                            <Text>
                                                {"Reps: " + set.reps + "    " + "Weight: " + set.weight}
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