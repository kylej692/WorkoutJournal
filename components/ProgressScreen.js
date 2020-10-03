import React, { useState } from 'react';
import { Text, View, TextInput, Alert, ScrollView } from 'react-native';
import Header from './Header';
import { db } from '../Database.js';
import { Picker } from '@react-native-community/picker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";

const ProgressScreen = () => {

  const [myTextInput, setMyTextInput] = useState(React.createRef());
  const [mode, setMode] = useState("Max Weight");
  const [label, setLabel] = useState();
  const monthsInYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const labels = [];
  const weight = [];
  const dataset = [1.1, 2.3, 3.4, 4.5];
  const [keyPress, setKeyPress] = useState(false);

  const sortItems = (items) => {
    const sorted = [...items].sort((a, b) => {
      const month1 = monthsInYear.indexOf(a.time.date.slice(0, 3)) + 1;
      const day1 = a.time.date.slice(4, 6);
      const year1 = a.time.date.slice(8, 12);
      const month2 = monthsInYear.indexOf(b.time.date.slice(0, 3)) + 1;
      const day2 = b.time.date.slice(4, 6);
      const year2 = b.time.date.slice(8, 12);

      var date1 = month1 + "/" + day1 + "/" + year1;
      var date2 = month2 + "/" + day2 + "/" + year2; 

      const timeStr1 = a.time.start;
      const timeStr2 = b.time.start;

      var hour1 = "";
      var minute1 = "";
      var meridiem1 = "";
      if (timeStr1.length == 7) {
        hour1 = timeStr1.slice(0, 2);
        minute1 = timeStr1.slice(3, 5);
        meridiem1 = timeStr1.slice(5, 7);
      } else {
        hour1 = timeStr1.slice(0, 1);
        minute1 = timeStr1.slice(2, 4);
        meridiem1 = timeStr1.slice(4, 6);
      }

      var hour2 = "";
      var minute2 = "";
      var meridiem2 = "";
      if (timeStr2.length == 7) {
        hour2 = timeStr2.slice(0, 2);
        minute2 = timeStr2.slice(3, 5);
        meridiem2 = timeStr2.slice(5, 7);
      } else {
        hour2 = timeStr2.slice(0, 1);
        minute2 = timeStr2.slice(2, 4);
        meridiem2 = timeStr2.slice(4, 6);
      }

      const time1 = hour1 + ":" + minute1 + ":" + "00 " + meridiem1;
      const time2 = hour2 + ":" + minute2 + ":" + "00 " + meridiem2;

      const aDate = new Date(date1 + " " + time1);
      const bDate = new Date(date2 + " " + time2);

      return aDate - bDate;
    });
    return sorted;
  };

  const maxWeight = (weight) => {

  };

  const findExercise = (textValue, mode) => {
    //var newText = textValue.replace(/\s/g, '');
    //newText = newText.toLowerCase();
    let workoutInfo = [];
    let setInfo = [];

    db.find({ "workouts": {$elemMatch:{"name": textValue}} }, function (err, docs) {
      if (docs.length == 0) {
        Alert.alert("Exercise not found");
      } else {
        //Sort the list of objects here
        sortedDocs = sortItems(docs)
        console.log(sortedDocs);
        
        sortedDocs.forEach(function (item, index) {
          let workout = item.workouts
          labels.push(item.time.date);
          console.log(labels);
          workout.forEach(function (item, index) {
            if (item.name === textValue) {
              workoutInfo.push(item);
            }
          });
        });
        setLabel(labels);
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
        console.log(labels);
      }
    })
  };

  const data = {
    labels: label,
    datasets: [
      {
        data: dataset,
      }
    ]
  }

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
            setKeyPress(true);
        }}/>
        <ScrollView>
          {keyPress === true && <LineChart
            data={ data }
            width={Dimensions.get("window").width}
            height={220}
            yAxisSuffix="lbs"
            yAxisInterval={2} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />}
        </ScrollView>
      </View>
    );
};

export default ProgressScreen;