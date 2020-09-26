import React, { useState } from 'react';
import { Text, View, TextInput, Alert } from 'react-native';
import Header from './Header';
import { db } from '../Database.js';
import { Picker } from '@react-native-community/picker';

const ProgressScreen = () => {

  const [myTextInput, setMyTextInput] = useState(React.createRef());
  const [mode, setMode] = useState("Max Weight");

  const findExercise = (textValue, mode) => {
    //var newText = textValue.replace(/\s/g, '');
    //newText = newText.toLowerCase();
    let workoutInfo = [];
    let setInfo = [];

    db.find({ "workouts": {$elemMatch:{"name": textValue}} }, function (err, docs) {
      console.log(docs);

      if (docs.length == 0) {
        Alert.alert("Exercise not found");
      } else {
        docs.forEach(function (item, index) {
          let workout = item.workouts

          workout.forEach(function (item, index) {
            if (item.name === textValue) {
              workoutInfo.push(item);
            }
          });
        });
        console.log(workoutInfo);

        workoutInfo.forEach(function (item, index) {
          setInfo.push(item.sets);
        });
        console.log(setInfo);
      
        if (mode === "Max Weight") {

          console.log("mode 1")
        } else if (mode === "Max Reps") {
  
          console.log("mode 2")
        }
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
          <Picker.Item label="Max Weight" value="Max Weight"/>
          <Picker.Item label="Max Reps" value="Max Reps"/>
        </Picker>
        <TextInput 
          ref={myTextInput}
          placeholder="Enter Exercise Name" 
          onSubmitEditing={ (event) => {
            findExercise(event.nativeEvent.text, mode)
            myTextInput.current.clear()
        }}/>
      </View>
    );
};

export default ProgressScreen;