import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { db } from '../Database.js';

const ProgressScreen = () => {

  const [exercises, setExercises] = useState('');

  const onChangeTextInput = (textValue) => {
    console.log(textValue)
    db.find({ "workouts": {$elemMatch:{"name": textValue}} }, function (err, docs) {
      console.log(err);
      console.log(docs);
    })
  };

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput placeholder="Enter Exercise Name" onChangeText={onChangeTextInput}/>
      </View>
    );
};

export default ProgressScreen;