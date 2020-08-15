import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'native-base';
import Header from '../components/Header';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { SwipeListView } from 'react-native-swipe-list-view';

const ModifyLog = ({ itemId, workout, modifyWorkout, deleteWorkout, setInfoModalVisible }) => {
    const [selectedSetNumber, setSetNumber] = useState(1); 

    const [newWorkout, setNewWorkout] = useState({...workout})

    const deleteCopySet = (setId) => {
        var copyWorkout = JSON.parse(JSON.stringify(newWorkout));
        copyWorkout.sets = copyWorkout.sets.filter(set => set.id != setId);
        for (var i = 0; i < copyWorkout.sets.length; i++) {
            copyWorkout.sets[i].num = i + 1;
        }
        setNewWorkout(copyWorkout);
    }

    const addNewSet = () => {
        var copyWorkout = {...newWorkout};
        copyWorkout.sets = [...copyWorkout.sets, {id: uuid(), num: copyWorkout.sets.length + 1, reps: 0, weight: 0}];
        setNewWorkout(copyWorkout);
    }

    const onChangeName = (newName) => {
        newWorkout.name = newName;
        setNewWorkout(newWorkout);
    };

    const onChangeReps = (newReps) => {
        newWorkout.sets[selectedSetNumber - 1].reps = newReps;
        setNewWorkout(newWorkout);
    };

    const onChangeWeight = (newWeight) => {
        newWorkout.sets[selectedSetNumber - 1].weight = newWeight;
        setNewWorkout(newWorkout);
    };

    const onChangeNotes = (newNotes) => {
        newWorkout.notes = newNotes;
        setNewWorkout(newWorkout);
    };

    return (
        <View>
            <Header title="Edit Log" />
                <SwipeListView 
                    data={newWorkout.sets}
                    keyboardShouldPersistTaps={'handled'}
                    ListHeaderComponent={              
                        <View style={styles.nameView}>                  
                            <Text style={styles.name}>Name</Text>
                            <TextInput defaultValue={newWorkout.name} style={styles.nameInput} onChangeText={onChangeName} />
                        </View>
                    }
                    renderItem={(data, rowMap) => (
                        <View style={styles.setView} key={data.item.id}>
                            <Text style={styles.labelText}>{"Set " + data.item.num + ":"}</Text>
                            <Text style={styles.infoText}>Reps </Text>
                            <TextInput keyboardType="numeric" defaultValue={data.item.reps.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newReps) => onChangeReps(newReps)} />
                            <Text style={styles.infoText}>Wt (lbs)</Text>
                            <TextInput keyboardType="numeric" defaultValue={data.item.weight.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newWeight) => onChangeWeight(newWeight)} />  
                        </View>
                    )}
                    renderHiddenItem={ (data, rowMap) => (
                        <TouchableOpacity style={styles.deleteSetBtn} onPress={() => {
                            deleteCopySet(data.item.id)
                        }}>
                            <View style={styles.rowFront}>
                                <Icon style={styles.deleteIcon} name="closecircle" size={15} />    
                            </View>
                        </TouchableOpacity>  
                    )}
                    ListFooterComponent={
                        <View style={styles.notesView}>
                            <TouchableOpacity style={styles.addSetBtn} onPress={addNewSet}>
                                <Text style={styles.addSetText}>Add Set</Text>
                            </TouchableOpacity>
                            <Text style={styles.notesText}><Icon style={styles.notesIcon} name="form" size={15}/>  Notes</Text>
                            <TextInput placeholder="Write here..." defaultValue={newWorkout.notes} multiline={true} style={styles.notesInput} onChangeText={onChangeNotes} />
                        </View>
                    }
                    disableRightSwipe={true}
                    rightOpenValue={-75}
                    removeClippedSubviews={false}
                />
            <TouchableOpacity style={styles.deleteWorkoutBtn} onPress={() => {
                                    deleteWorkout(itemId, newWorkout.id), 
                                    setInfoModalVisible(false)}}>
                <Icon style={styles.deleteIcon} name="delete" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneBtn} onPress={() => {
                if (newWorkout.sets.length == 0) {
                    Alert.alert("           At least 1 set is needed!")
                } else {
                    setInfoModalVisible(false), 
                    modifyWorkout(itemId, newWorkout)
                }
            }}>
                <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    rowFront: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 25,
        marginLeft: 270
    },
    nameView: {
        marginBottom: 10,
        flexWrap: "wrap",
        width: 370,
        flexDirection: "row",
    },
    infoView: {
        flex: 1,
        marginBottom: 100,
        marginTop: 25,
    },
    notesView: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        padding: 5,
        paddingRight: 10,
        marginTop: 45,
        marginLeft: 20
    },
    nameInput: {
        height: 32,
        width: 237,
        padding: 8,
        fontSize: 16,
        marginTop: 43,
        paddingBottom: 1,
        borderRadius: 8,
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
    infoInput: {
        textAlignVertical: "bottom",
        height: 35,
        width: 50,
        borderRadius: 8,
        margin: 10,
        paddingBottom: 1,
        borderBottomColor: "black",
        borderBottomWidth: 1
    },
    notesInput: {
        textAlignVertical: "top",
        alignItems: "flex-start",
        marginLeft: 25,
        height: "auto",
        width: 300
    },
    setView: {
        marginBottom: 15,
        marginLeft: 15,
        backgroundColor: "white",
        flex: 1,
        flexDirection: "row"
    },
    labelText: {
        alignSelf: "center",
        fontSize: 20,
        padding: 10,
        marginTop: 10
    },
    notesText: {
        alignSelf: "center",
        flexDirection: "row",
        fontSize: 20,
        padding: 10,
        marginTop: 40
    },
    infoText: {
        alignSelf: "center",
        fontSize: 15,
        marginTop: 10
    },
    deleteSetBtn: {
        top: 18
    },
    deleteWorkoutBtn: { 
        bottom: 10, 
        left: 10 
    },
    deleteIcon: { 
        color: "red",
        fontSize: 20
    },
    addSetBtn: {
        position: "absolute", 
        backgroundColor: "#2C95FF",
        padding: 5,
        marginLeft: 140,
        marginBottom: 40,
        borderRadius: 8
    },
    addSetText: {
        marginLeft: 3,
        marginRight: 3,
        color: "white"
    },
    doneBtn: { 
        position: "absolute", 
        bottom: 10, 
        right: 10,
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
        color: "white"
    }
});

export default ModifyLog;