import React, { PureComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Header, Card, CardItem, Text } from 'native-base';

class LogEntry extends PureComponent {

    constructor(props) {
        super(props);
        this.count = 0;
    };

    render() {
        return (
            <View>
                <TouchableOpacity style={styles.dateTouchableOpacity} onPress={() => {
                    this.props.toggleDateModal(this.props.item);
                }}>
                    <Header style={styles.dateHeader}>
                        <Text style={styles.dateText}>{this.props.item.time.date + "    "}</Text>
                        <Text style={styles.timeText}>{this.props.item.time.start + "-" + this.props.item.time.end}</Text>
                    </Header>
                </TouchableOpacity>
                <FlatList 
                    data={this.props.item.workouts}
                    renderItem={(workoutData) => (
                        <Card key={workoutData.item.id} style={styles.card}>
                            <CardItem header bordered style={styles.cardHeader}>  
                                <TouchableOpacity onPress={() => {
                                    this.props.toggleInfoModal(workoutData.item);
                                }}>
                                    <Text style={styles.workoutName}>{workoutData.item.name}</Text>
                                </TouchableOpacity>
                            </CardItem>
                            <CardItem bordered>
                                <Text>Set</Text>
                                <Text style={styles.cardText}>Reps</Text>
                                <Text style={styles.cardText}>Wt (lbs)</Text>
                            </CardItem>  
                            <FlatList 
                                data={workoutData.item.sets}
                                renderItem={(setData) => {
                                    this.count += 1;
                                    return (
                                        <CardItem bordered style={styles.cardInfoContainer} key={setData.item.id}>
                                            <View style={styles.cardItemBody}>
                                                <View style={styles.itemView}>
                                                    <Text>{setData.item.num}</Text>
                                                </View>
                                                <View style={styles.itemView}>
                                                    <Text style={styles.repsNum}>{setData.item.reps}</Text>
                                                </View>
                                                <View style={styles.itemView}>
                                                    <Text style={styles.weightNum}>{setData.item.weight}</Text>
                                                </View>   
                                            </View>                                  
                                        </CardItem>
                                    )
                                }}
                            />                         
                        </Card>
                    )}
                />
            </View>
        );
    }
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