import React, {useState} from 'react';
import { Button } from 'native-base';
import { Modal, Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';

const AddLogButton = ({ addLog }) => {
  const [modalVisible, setModal] = useState(false);

  const [text, setText] = useState('');

  const onChange = (textValue) => setText(textValue);

  const toggleModal = (visible) => {
    setModal(visible);
  };

  return (
    <View style = {styles.container}>
       <Modal animationType = {"slide"} transparent = {false}
          visible = {modalVisible}
          onRequestClose = {() => { console.log("Modal has been closed.") } }>
          
          <View style = {styles.modal}>
            <TextInput placeholder="Add Workout..." style={styles.input} onChangeText={onChange} />
            <TouchableOpacity style={styles.button} onPress={() => { addLog(text), toggleModal(!modalVisible), onChange('') }}>
               <Text style={{ fontSize: 20 }}><Icon name="pluscircle" size={25} />Add</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancel} onPress={() => { toggleModal(!modalVisible), onChange('') }}>
               <Text style={{ fontSize: 20 }}><Icon name="closecircle" size={25} />Cancel</Text>
            </TouchableOpacity>
          </View>
       </Modal>
       
       <Button style={ styles.add } bordered primary onPress = {() => {toggleModal(true)}}>
          <Text style={styles.text}>Add</Text>
       </Button>
    </View>
 );
};

export default AddLogButton;

const styles = StyleSheet.create ({
  container: {
     flex: 1
  },
  input: {
    height: 60,
    padding: 8,
    fontSize: 16,
  },
  modal: {
     flex: 1,
     alignItems: 'center',
     padding: 100
  },
  button: {
    position: 'absolute',
    bottom: 10, 
    right: 10,
  },
  add: {
   backgroundColor: "#2C95FF",
   width: 70,
   height: 35,
   borderColor: "white",
   justifyContent: "center",
  },
  cancel: {
   position: 'absolute',
   bottom: 10, 
   left: 10,
  },
  text: {
     color: '#fff',
     fontSize: 20,
  }
})