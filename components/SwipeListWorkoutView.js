import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { Text } from 'native-base';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import { SwipeListView } from 'react-native-swipe-list-view';

const SwipeListWorkoutView = ({ newWorkout, setNewWorkout, containsNotes, lbToKg, kgToLb, unitSystem }) => {
    const [selectedSetNumber, setSetNumber] = useState(1); 

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
        copyWorkout.sets = [...copyWorkout.sets, {id: uuid(), num: copyWorkout.sets.length + 1, reps: 0, weightLbs: 0, weightKgs: 0}];
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
        if(unitSystem == "Imperial") {
            newWorkout.sets[selectedSetNumber - 1].weightLbs = newWeight;
            newWorkout.sets[selectedSetNumber - 1].weightKgs = lbToKg(newWeight);
        } else if(unitSystem == "Metric") {
            newWorkout.sets[selectedSetNumber - 1].weightKgs = newWeight;
            newWorkout.sets[selectedSetNumber - 1].weightLbs = kgToLb(newWeight);
        }
        setNewWorkout(newWorkout);
    };

    const onChangeNotes = (newNotes) => {
        newWorkout.notes = newNotes;
        setNewWorkout(newWorkout);
    };

    return (
        <SwipeListView 
            data={newWorkout.sets}
            keyboardShouldPersistTaps={'handled'}
            ListHeaderComponent={              
                <View style={styles.nameView}>    
                    <Icon style={styles.workoutIcon} name="dumbbell" size={20} />              
                    <TextInput defaultValue={newWorkout.name} style={styles.nameInput} onChangeText={onChangeName} />
                </View>
            }
            renderItem={(data, rowMap) => (
                <View style={styles.setView} key={data.item.id}>
                    <Icon style={{ color: "#2C95FF", top: 22 }} name="angle-right" size={20}/>
                    <Text style={styles.labelText}>{"SET " + data.item.num + ":"}</Text>
                    <Text style={styles.infoText}>Reps </Text>
                    <TextInput keyboardType="numeric" defaultValue={data.item.reps.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newReps) => onChangeReps(newReps)} />
                    {unitSystem == "Imperial" && <Text style={styles.infoText}>Wt (lbs)</Text>}
                    {unitSystem == "Metric" && <Text style={styles.infoText}>Wt (kgs)</Text>}
                    {unitSystem == "Imperial" && <TextInput keyboardType="numeric" defaultValue={data.item.weightLbs.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newWeight) => onChangeWeight(newWeight)} />}
                    {unitSystem == "Metric" && <TextInput keyboardType="numeric" defaultValue={data.item.weightKgs.toString()} style={styles.infoInput} onTouchStart={() => setSetNumber(data.item.num)} onChangeText={(newWeight) => onChangeWeight(newWeight)} />}  
                </View>
            )}
            renderHiddenItem={ (data, rowMap) => (
                <TouchableOpacity style={{ top: 18 }} onPress={() => {
                    deleteCopySet(data.item.id)
                }}>
                    <View style={styles.rowFront}>
                        <Icon style={{ color: "#BD0000" }} name="times" size={20} />    
                    </View>
                </TouchableOpacity>  
            )}
            ListFooterComponent={
                <View>
                    <TouchableOpacity style={styles.addSetBtn} onPress={addNewSet}>
                        <Text style={styles.addSetText}>Add Set</Text>
                    </TouchableOpacity>
                    {containsNotes && 
                        <View style={styles.notesView}>
                            <Text style={styles.notesText}><Icon style={styles.notesIcon} name="edit" size={15}/>  Notes</Text>
                            <TextInput placeholder="Write here..." defaultValue={newWorkout.notes} multiline={true} style={styles.notesInput} onChangeText={onChangeNotes} />
                        </View>
                    }
                </View>
            }
            disableRightSwipe={true}
            rightOpenValue={-75}
            removeClippedSubviews={false}
        />
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
        width: 370,
        borderBottomWidth: 1,
        borderBottomColor: "#2C95FF",
        flexDirection: "row"
    },
    infoView: {
        flex: 1,
        marginBottom: 100,
        marginTop: 25,
    },
    workoutIcon: {
        color: "black",
        marginTop: 23,
        marginBottom: 15,
        marginLeft: 50
    },
    nameInput: {
        height: 32,
        width: 237,
        fontSize: 20,
        marginTop: 15,
        marginLeft: 8,
        paddingBottom: 1,
        borderRadius: 8,
        borderBottomWidth: 0.4
    },
    infoInput: {
        textAlignVertical: "bottom",
        height: 35,
        width: 50,
        borderRadius: 8,
        margin: 10,
        paddingBottom: 1,
        borderBottomColor: "#666666",
        borderBottomWidth: 1
    },
    notesInput: {
        textAlignVertical: "top",
        alignItems: "flex-start",
        marginLeft: 25,
        marginBottom: 30,
        height: "auto",
        width: 300
    },
    setView: {
        alignSelf: "center",
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#B4B4B4",
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
    notesView: {
        borderTopWidth: 1, 
        borderTopColor: "#2C95FF", 
        marginTop: 45
    },
    notesText: {
        alignSelf: "center",
        flexDirection: "row",
        fontSize: 20,
        padding: 10,
        marginTop: 5
    },
    infoText: {
        alignSelf: "center",
        fontSize: 15,
        marginTop: 10
    },
    addSetBtn: {
        alignSelf: "center",
        backgroundColor: "#2C95FF",
        padding: 5,
        marginTop: 5,
        borderRadius: 8
    },
    addSetText: {
        marginLeft: 3,
        marginRight: 3,
        color: "white"
    },
    doneBtn: { 
        flexDirection: "row", 
        position: "absolute", 
        bottom: 10, 
        right: 15
    }
});

export default SwipeListWorkoutView;