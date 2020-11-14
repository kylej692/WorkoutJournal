import React, { useState, useEffect } from 'react';
import { Text, View, TextInput, Alert, ScrollView, StyleSheet } from 'react-native';
import Header from './Header';
import { db } from '../Database.js';
import { Picker } from '@react-native-community/picker';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from "react-native";

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
  const monthsInYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
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
  
  const lbToKg = (weight) => {
    var num = weight * 0.45359237
    return +num.toFixed(2)
}

  const kgToLb = (weight) => {
      var num = weight / 0.45359237
      return +num.toFixed(2)
  }

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

      return bDate - aDate;
    });
    return sorted;
  };

  const findMax = (item, mode, unitS) => {
    if (mode === "weight") {
      let maxWeightKgs = 0;
      let maxWeightLbs = 0;
      console.log(unitS);
      item.forEach(function (setInfo, index) {
        if (unitS === "Metric") {
          if (setInfo.weightKgs >= maxWeightKgs) {
            if (setInfo.weightKgs === '') {
              setInfo.weightKgs = lbToKg(setInfo.weightLbs);
              maxWeightKgs = setInfo.weightKgs;
            } else {
              maxWeightKgs = setInfo.weightKgs;
            }
          }
        } else {
          if (setInfo.weightLbs >= maxWeightLbs) {
            if (setInfo.weightLbs === '') {
              setInfo.weightLbs = kgToLb(setInfo.weightKgs)
              maxWeightLgs = setInfo.weightLbs;
            } else {
              maxWeightLbs = setInfo.weightLbs;
            }
          }
        }
      });
      if (unitS === "Metric") {
        return maxWeightKgs;
      }
      return maxWeightLbs;
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

    db.findOne({ $or: [{ unitSystem: "Metric" }, { unitSystem: "Imperial" }] }, function(err, docs1) {
      db.find({ "workouts": {$elemMatch:{"name": textValue}} }, function (err, docs2) {
        if (docs2.length == 0) {
          setExists(false);
          Alert.alert("Exercise not found");
        } else {
          setExists(true);
          sortedDocs = sortItems(docs2)
  
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
              let maxWeightStr = findMax(item, "weight", docs1.unitSystem);
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
              let maxRepStr = findMax(item, "reps", docs1.unitSystem);
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
              let rep = parseInt(findMax(item, "reps", docs1.unitSystem));
              let weight = parseInt(findMax(item, "weight", docs1.unitSystem));
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
    marginHorizontal: 15,
  }
});

export default ProgressScreen;