import React, { useState } from 'react';
import { Text, View, TextInput, Alert, ScrollView, StyleSheet } from 'react-native';
import Header from './Header';
import { db } from '../Database.js';
import { Picker } from '@react-native-community/picker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";
import { sortItems } from '../utils';

const ProgressScreen = () => {

  const [myTextInput, setMyTextInput] = useState(React.createRef());
  const [graphTitle, setGraphTitle] = useState();
  const [mode, setMode] = useState("Max Weight");
  const [chartLabel, setChartLabel] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [keyPress, setKeyPress] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [exists, setExists] = useState(false);
  const [yAxisSuffix, setYAxisSuffix] = useState("");
  const [dataSetLen, setDataSetLen] = useState(0);
  const labels = [];
  let dataSet = [];

  const findUnitSystem = (db) => {
    db.findOne({ $or: [{ unitSystem: "Metric" }, { unitSystem: "Imperial" }] }, function(err, doc) {
      if (doc.unitSystem === "Metric") {
        setYAxisSuffix(" kgs");
      } else if (doc.unitSystem === "Imperial") {
        setYAxisSuffix(" lbs");
      }
    })
  };

  const findMax = (item, mode) => {
    if (mode === "weight") {
      let maxWeight = 0;
      item.forEach(function (setInfo, index) {
        if (setInfo.weight >= maxWeight) {
          maxWeight = setInfo.weight;
        }
      });
      return maxWeight;
    } else if (mode === "reps") {
      let maxRep = 0;
      item.forEach(function (setInfo, index) {
        if (setInfo.reps >= maxRep) {
          maxRep = setInfo.reps;
        }
      });
      return maxRep;
    }
  };

  const findExercise = (textValue, mode) => {
    let workoutInfo = [];
    let setInfo = [];
    let count = 0;

    db.find({ "workouts": {$elemMatch:{"name": textValue}} }, function (err, docs) {
      if (docs.length == 0) {
        setExists(false);
        Alert.alert("Exercise not found");
      } else {
        setExists(true);
        sortedDocs = sortItems(docs)

        for (i = 0; i < sortedDocs.length; i++) {
          count++;
          if (count >= 20) {
            break;
          }
          let workout = sortedDocs[i].workouts;
          labels.unshift(sortedDocs[i].time.date);
          for (j = 0; j < workout.length; j++) {
            if (workout[j].name === textValue) {
              workoutInfo.unshift(workout[j])
            }
          }
        }

        setChartLabel(labels);

        workoutInfo.forEach(function (item, index) {
          setInfo.push(item.sets);
        });
      
        if (mode === "Max Weight") {
          findUnitSystem(db);

          setInfo.forEach(function (item, index) {
            let maxWeightStr = findMax(item, "weight");
            let maxWeight = parseInt(maxWeightStr);
            dataSet.push(maxWeight);
          });

          setChartData(dataSet);
          setDataSetLen(dataSet.length);
          dataSet = [];
          setLoaded(true);
        } else if (mode === "Max Reps") {
          setYAxisSuffix("reps");

          setInfo.forEach(function (item, index) {
            let maxRepStr = findMax(item, "reps");
            let maxRep = parseInt(maxRepStr);
            dataSet.push(maxRep);
          });

          setChartData(dataSet);
          setDataSetLen(dataSet.length);
          dataSet = [];
          setLoaded(true);
        } else if (mode === "Max Volume") {
          findUnitSystem(db);

          setInfo.forEach(function (item, index) {
            let rep = parseInt(findMax(item, "reps"));
            let weight = parseInt(findMax(item, "weight"));
            let maxVol = rep * weight * item.length;
            dataSet.push(maxVol);
          });

          setChartData(dataSet);
          setDataSetLen(dataSet.length);
          dataSet = [];
          setLoaded(true);
        }
      }
    })
  };

  const findWidth = (dataSetLen) => {
    if (dataSetLen < 3) {
      return Dimensions.get("window").width
    } else {
      return (Dimensions.get("window").width) * (dataSetLen / 3)
    }
  }

  return (
      <View style={styles.container}>
        <Header title='Progress Tracker'/>
        <Picker
          mode={"dropdown"}
          selectedValue={mode}
          onValueChange={(itemValue, itemIndex) => 
            setMode(itemValue)
          }>
          <Picker.Item label="Max Weight" value="Max Weight"/>
          <Picker.Item label="Max Reps" value="Max Reps"/>
          <Picker.Item label="Max Volume" value="Max Volume"/>
        </Picker>
        <TextInput 
          ref={myTextInput}
          placeholder="Enter Exercise Name" 
          onSubmitEditing={ (event) => {
            findExercise(event.nativeEvent.text, mode)
            setGraphTitle(event.nativeEvent.text)
            myTextInput.current.clear()
            setKeyPress(true);
        }}/>
          {keyPress === true && loaded === true && exists === true &&
            <View style={styles.graph}>
              <Text style={styles.graphTitle}>{graphTitle}</Text>
              <Text style={styles.subTitle}>Last 20 Workouts</Text>
              <ScrollView horizontal={true}>
                <LineChart
                  style={styles.lineChart}
                  data={{
                    labels: chartLabel,
                    datasets: [
                      {
                        data: chartData,
                      }]
                  }}
                  width={findWidth(dataSetLen)}
                  height={460}
                  yAxisSuffix= {yAxisSuffix}
                  chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#2C95FF",
                    backgroundGradientTo: "#2C95FF",
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#2C95FF"
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: '',
                    },
                  }}
                />
              </ScrollView>
            </View>}
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  graph: {
    backgroundColor: "#2C95FF"
  },
  graphTitle: {
    fontSize: 18, 
    textAlign: 'center', 
    backgroundColor: "#2C95FF", 
    color: "#ffffff"
  },
  subTitle: {
    fontStyle: 'italic', 
    fontSize: 15, 
    textAlign: 'center', 
    backgroundColor: "#2C95FF", 
    color: "#ffffff"
  },
  lineChart: {
    marginHorizontal: 17,
  }
});

export default ProgressScreen;