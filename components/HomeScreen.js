import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, Text, TouchableOpacity } from 'react-native';
import { Spinner } from 'native-base'
import Header from './Header';
import LogEntry from './LogEntry';
import AddLogButton from './AddLogButton';
import Settings from './Settings';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import AsyncStorage from '@react-native-community/async-storage';
import FilterLogs from './FilterLogs';
import Modal from 'react-native-modal';
import ModifyLog from '../components/ModifyLog';
import ModifyDate from '../components/ModifyDate';
import Icon from 'react-native-vector-icons/dist/Feather';

var Datastore = require('react-native-local-mongodb')
, db = new Datastore({ filename: 'asyncStorageKey', storage: AsyncStorage, autoload: true });

const HomeScreen = () => {
  const monthsInYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var currDate = new Date();
  var currMonth = monthsInYear[currDate.getMonth()];
  var currYear = currDate.getFullYear().toString();
  var currDay = currDate.getDate().toString();

  if(currDay.length == 1) {
    currDay = "0" + currDay
  }

  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState();
  const [selectedMonthValue, setSelectedMonthValue] = useState(currMonth);
  const [selectedYearValue, setSelectedYearValue] = useState(currYear);
  const [selectedDayValue, setSelectedDayValue] = useState(currDay);
  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const [unitSystem, setUnitSystem] = useState();
  const [selectedWorkout, setWorkout] = useState({});
  const [selectedItem, setItem] = useState({});
  const [initial, setInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 200);
  }, [])

  const toggleInfoModal = (itemId, workout) => {
    setInfoModalVisible(!isInfoModalVisible);
    setWorkout(workout);
    setSelectedItemId(itemId);
  }

   const toggleDateModal = (item) => {
    setDateModalVisible(!isDateModalVisible);
    setItem(item);
  }

  const lbToKg = (weight) => {
      var num = weight * 0.45359237
      return +num.toFixed(2)
  }

  const kgToLb = (weight) => {
      var num = weight / 0.45359237
      return +num.toFixed(2)
  }

  const filter = (month, year, day) => {
    var dateStr = month + " " + day + ", " + year;
    db.find({ "time.date": dateStr }, function (err, docs) { 
      setIsLoading(true);
      docs.map((doc) => {
        if (doc.unitSystem == "Imperial" && unitSystem == "Metric") {
          doc.workouts.map((workout) => {
            workout.sets.map((set) => {
              set.weight = lbToKg(set.weight);
            })
          })
          db.update({ id: doc.id }, { $set: { workouts: doc.workouts} });
          db.update({ id: doc.id }, { $set: { unitSystem: unitSystem} });
        } else if (doc.unitSystem == "Metric" && unitSystem == "Imperial") {
          doc.workouts.map((workout) => {
            workout.sets.map((set) => {
              set.weight = kgToLb(set.weight);
            })
          })
          db.update({ id: doc.id }, { $set: { workouts: doc.workouts} });
          db.update({ id: doc.id }, { $set: { unitSystem: unitSystem} });
        }
      });
      setItems(docs);
      setTimeout(() => {
        setIsLoading(false)
      }, 100);
    })
  };

 //Initial data load
  if(items.length == 0 && initial) {
    db.findOne({ $or: [{ unitSystem: "Metric" }, { unitSystem: "Imperial" }] }, function(err, doc) {
      if(doc == null) {
        db.insert({ unitSystem: "Imperial" });
        setUnitSystem("Imperial");
      } else {
        setUnitSystem(doc.unitSystem);
      }
    })
    filter(selectedMonthValue, selectedYearValue, selectedDayValue);
    setInitial(false);
  };
  
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

  const addItem = (time, workouts) => {
    if(!time || !workouts) {
      Alert.alert("Please enter a workout!")
    } else {
      var id = uuid()
      var newItem = {id: id, time: time, workouts: workouts, unitSystem: unitSystem};
      db.insert(newItem, function(err, newDoc) {
        if(time.date.slice(0, 3) === selectedMonthValue && time.date.slice(8, 12) === selectedYearValue && time.date.slice(4, 6) === selectedDayValue) {
          setItems(prevItems => {
            return [ newDoc, ...prevItems ];
          });
        }
      });
    }
  };

  const addRoutine = (routineName, workouts) => {
    var newItem = { routineName: routineName, workouts: workouts};
    db.insert(newItem, function(err, newDoc){
      console.log(newDoc);
    })
  }

  const deleteWorkout = (itemId, workoutId) => {
    var emptyItemId = null;
    db.findOne({ id: itemId }, function(err, doc) {
      doc.workouts = doc.workouts.filter(workout => workout.id != workoutId);
      if(doc.workouts.length == 0) {
        emptyItemId = itemId;
        db.remove({ id: itemId }, {})
      } else {
        db.update({ id: itemId }, { $set: { workouts: doc.workouts} });
      }
      setItems(prevItems => {
        for(var i = 0; i < prevItems.length; i++) {
          if (prevItems[i].id == itemId) {
            prevItems[i].workouts = doc.workouts;
          };
        }
        return prevItems.filter(item => item.id != emptyItemId);
      });
    })
  };

  const modifyWorkout = (itemId, modifiedWorkout) => {
    db.findOne({ id: itemId }, function(err, doc) {

      for (var i = 0; i < doc.workouts.length; i++){
        if(doc.workouts[i].id == modifiedWorkout.id) {
          doc.workouts[i] = modifiedWorkout;
          db.update({ id: itemId }, { $set: { workouts: doc.workouts} });
        }
      };

      setItems(prevItems => {
        for(var i = 0; i < prevItems.length; i++) {
          if (prevItems[i].id == itemId) {
            prevItems[i].workouts = doc.workouts;
          }
        }
        return [...prevItems];
      });

    });
  };

  const modifyDateTime = (itemId, date, start, end) => {
    db.findOne({ id: itemId }, function(err, doc) {
      doc.time.date = date;
      doc.time.start = start;
      doc.time.end = end;
      db.update({ id: itemId }, { $set: { time: doc.time} });

      if(doc.time.date.slice(0, 3) === selectedMonthValue && doc.time.date.slice(8, 12) === selectedYearValue && doc.time.date.slice(4, 6) === selectedDayValue) {
        setItems(prevItems => {
          for(var i = 0; i < prevItems.length; i++) {
            if (prevItems[i].id == itemId) {
              prevItems[i].time = doc.time;
            }
          }
          return sortItems(prevItems);
        });
      } else {
        setItems(prevItems => {
          return prevItems.filter(item => item.id != itemId);
        });
      };
    });
  };

  var sortedItems = sortItems(items);
  return (
    <View style={styles.container}>
      <Header title='Workout Journal'/>
      <FilterLogs 
        filter={filter} 
        selectedMonthValue={selectedMonthValue}
        selectedYearValue={selectedYearValue}
        selectedDayValue={selectedDayValue}
        setSelectedMonthValue={setSelectedMonthValue} 
        setSelectedYearValue={setSelectedYearValue} 
        setSelectedDayValue={setSelectedDayValue}
      />
      <TouchableOpacity 
        style={{ bottom: 43, left: 65, width: 30 }} 
        onPress={() => {setSettingsModalVisible(!isSettingsModalVisible)}}
      >
        <Icon color="white" name="settings" size={25} />
      </TouchableOpacity>
      {isLoading && <Spinner style={{ marginTop: 20 }} color={"#2C95FF"} />}
      {!isLoading && 
        <View style={{ marginTop: 10, marginBottom: 90 }}>
          <FlatList style={styles.content}
            data={sortedItems}
            renderItem={(data) => (
              <LogEntry 
                item={data.item} 
                toggleInfoModal={toggleInfoModal}
                toggleDateModal={toggleDateModal}
                unitSystem={unitSystem}
                key={data.item.id} 
              />
            )}
            ListEmptyComponent={() => 
              <View style={{ marginTop: 300, alignItems: "center", justifyContent: "center" }}> 
                {!isLoading && <Text style={{ fontSize: 20 }}>Log is Empty</Text>}
              </View>
            }
            initialNumToRender={6}
            maxToRenderPerBatch={4}
          />
        </View>
        }
      <View style={styles.button}>
        <AddLogButton addLog={addItem} addRoutine={addRoutine} unitSystem={unitSystem} db={db} />
      </View>
      <Modal onRequestClose={() => setSettingsModalVisible(!isSettingsModalVisible)} isVisible={ isSettingsModalVisible } style={styles.settingsModal}>
        <Settings unitSystem={unitSystem} setUnitSystem={setUnitSystem} db={db} items={items} kgToLb={kgToLb} lbToKg={lbToKg}/>
      </Modal>
      <Modal onRequestClose={() => {setInfoModalVisible(!isInfoModalVisible)}} isVisible={ isInfoModalVisible } style={styles.infoModal}>
        <ModifyLog itemId={selectedItemId} workout={selectedWorkout} modifyWorkout={modifyWorkout} deleteWorkout={deleteWorkout} setInfoModalVisible={setInfoModalVisible} unitSystem={unitSystem}/>
      </Modal>
      <Modal onRequestClose={() => {setDateModalVisible(!isDateModalVisible)}} isVisible={ isDateModalVisible } style={styles.dateModal}>
        <ModifyDate item={selectedItem} modifyDateTime={modifyDateTime} setDateModalVisible={setDateModalVisible}/>
      </Modal>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {  
    paddingLeft: 5,
    paddingRight: 5
  },
  button: {
    position: 'absolute',
    top: 12, 
    right: 5,
  },
  settingsModal: {
    marginTop: 265,
    marginBottom: 280,
    backgroundColor: "white", 
    flex: 1
  },
  infoModal: { 
    position: "relative",
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: "white", 
    flex: 1,
    alignItems: "center"
  },
  dateModal: {
      position: "relative",
      marginTop: 250,
      marginBottom: 275,
      backgroundColor: "white", 
      flex: 1,
      alignItems: "center"
  }
});

export default HomeScreen;