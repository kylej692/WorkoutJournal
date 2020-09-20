import React, { useState } from 'react';
import { Text, View, TextInput, Alert } from 'react-native';
import Header from './Header';
import { db } from '../Database.js';
import { Picker } from '@react-native-community/picker';

const ProgressScreen = () => {

  const [myTextInput, setMyTextInput] = useState(React.createRef());
  const [mode, setMode] = useState("Progressive Overload");

  const findExercise = (textValue) => {
    var newText = textValue.replace(/\s/g, '');
    newText = newText.toLowerCase();
    db.find({ "workouts": {$elemMatch:{"name": textValue}} }, function (err, docs) {
      console.log(docs);
      if (docs.length == 0) {
        Alert.alert("Exercise not found");
      }
    })
  };

  return (
      <View style={{ flex: 1 }}>
        <Header title='Progress Tracker'/>
        <Picker
          mode={"dropdown"}
          selectedValue={mode}
          onValueChange={(itemValue, itemIndex) => 
            setMode(itemValue)
          }>
          <Picker.Item label="Progressive Overload" value="Progressive Overload"/>
          <Picker.Item label="Repetitions" value="Repetitions"/>
        </Picker>
        <TextInput 
          ref={myTextInput}
          placeholder="Enter Exercise Name" 
          onSubmitEditing={ (event) => {
            findExercise(event.nativeEvent.text)
            myTextInput.current.clear()
        }}/>
      </View>
    );
};

export default ProgressScreen;