import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Header, Card, CardItem, Text } from 'native-base';

const LogEntry = ({ item, toggleInfoModal, toggleDateModal }) => {
    var count = 0;

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
                        <CardItem bordered>
                            <Text>Set</Text>
                            <Text style={styles.cardText}>Reps</Text>
                            <Text style={styles.cardText}>Wt (lbs)</Text>
                        </CardItem>                           
                        {workout.sets.map((set) => {
                            count += 1;
                            return (
                            <CardItem bordered style={styles.cardInfoContainer} key={set.id}>
                                <View style={styles.cardItemBody}>
                                    <View style={styles.itemView}>
                                        <Text>{set.num}</Text>
                                    </View>
                                    <View style={styles.itemView}>
                                        <Text style={styles.repsNum}>{set.reps}</Text>
                                    </View>
                                    <View style={styles.itemView}>
                                        <Text style={styles.weightNum}>{set.weight}</Text>
                                    </View>   
                                </View>                                  
                            </CardItem>
                            )})
                        }
                    </Card>
                    )
                })
            }
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
    cardItemBody: {
        flex: 1, 
        alignSelf: "stretch", 
        flexDirection: "row"
    },
    itemView: { 
        flex: 1, 
        alignSelf: "stretch"
    },
    cardLabel: { 
        height: 40, 
        borderBottomWidth: 1, 
        borderColor: "black" 
    },
    cardText: {
        marginLeft: "auto"
    },
    repsNum: {
        marginLeft: 30
    },
    weightNum: {
        marginLeft: 70
    },
    weightNumType: {
        fontSize: 15
    },
    cardInfoContainer: { 
        height: 40 
    },
  });

export default LogEntry;