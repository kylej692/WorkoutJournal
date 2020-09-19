import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { db } from '../Database.js';

const ProgressScreen = () => {

  const [myTextInput, setMyTextInput] = useState(React.createRef());

  const findExercise = (textValue) => {
    db.find({ "workouts": {$elemMatch:{"name": textValue}} }, function (err, docs) {
      console.log(err);
      console.log(docs);
    })
  };

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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