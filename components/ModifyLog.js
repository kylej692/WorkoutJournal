import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Content, Text, Body, Card, CardItem } from 'native-base';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const ModifyLog = ({ workout }) => {
    const [text, setText] = useState('');

    const onChange = (textValue) => setText(textValue);

    var count = 0;

    return (
        <View>
            <Header title="Edit Log" />
            <Content padder>
                <View style={styles.nameView}>                  
                    <Text style={styles.name}>Name</Text>
                    <TextInput defaultValue={workout.name} style={styles.nameInput} onChangeText={onChange} />
                </View>
                <View style={styles.infoView}>
                {workout.sets.map((set) => {
                    count += 1;
                    return (
                        <View style={styles.setView} key={set.id}>
                            <Text style={styles.headerText}>{"Set " + count + ":"}</Text>
                            <Text style={styles.infoText}>{"Reps "}</Text>
                            <TextInput defaultValue={set.reps.toString()} style={styles.infoInput} onChangeText={onChange} />
                            <Text style={styles.infoText}>{"Weight "}</Text>
                            <TextInput defaultValue={set.weight.toString()} style={styles.infoInput} onChangeText={onChange} />        
                        </View>
                    )})
                }
                </View>
            </Content>
            <TouchableOpacity style={styles.modifyBtn} onPress={() => addItem(text)}>
                <Icon color="white" name="check" size={20} /><Text style={styles.finishText}>Finish</Text>
            </TouchableOpacity> 
        </View>
    );
}

const styles = StyleSheet.create({
    nameView: {
        flexWrap: "wrap",
        width: 370,
        flexDirection: "row",
    },
    infoView: {
        flex: 1,
        marginBottom: 100,
        marginTop: 50,
    },
    name: {
        fontSize: 20,
        padding: 5,
        paddingRight: 10,
        marginTop: 40,
        marginLeft: 10
    },
    nameInput: {
        backgroundColor: "#D9D9D9",
        height: 35,
        width: 250,
        padding: 8,
        fontSize: 16,
        marginTop: 43,
        borderRadius: 8 
    },
    infoInput: {
        backgroundColor: "#D9D9D9",
        height: 35,
        width: 50,
        borderRadius: 8,
        margin: 10
    },
    modifyBtn: {
        alignSelf: "center",
        backgroundColor: "#2C95FF",
        height: 35,
        width: 90,
        padding: 5,
        marginBottom: 10,
        marginLeft: 20,
        right: 10,
        borderRadius: 8,
        flexWrap: "wrap",
        flexDirection: "row" 
    },
    setView: {
        marginBottom: 40,
        flex: 1,
        flexDirection: "row"
    },
    headerText: {
        fontSize: 20,
        padding: 10
    },
    infoText: {
        fontSize: 15,
        padding: 10
    },
    finishText: {
        color: "white",
        marginLeft: 5
    }
});

export default ModifyLog;