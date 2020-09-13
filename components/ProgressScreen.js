import React, { useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import { db } from '../Database.js';

const ProgressScreen = () => {

  const [exercise, setExercise] = useState('');

  const onChangeTextInput = (textValue) => {
    
  };

  return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput placeholder="Enter Exercise Name" onChangeText={onChangeTextInput} />
        <Text>{exercise}</Text>
      </View>
    );
};

export default ProgressScreen;