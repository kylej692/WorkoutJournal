import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, FlatList, Text, TouchableOpacity } from 'react-native';
import { Spinner } from 'native-base'
import Header from './Header';
import LogEntry from './LogEntry';
import AddLog from './AddLog';
import Settings from './Settings';
import AddRoutineWorkout from './AddRoutineWorkout';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import FilterLogs from './FilterLogs';
import Modal from 'react-native-modal';
import ModifyLog from '../components/ModifyLog';
import ModifyDate from '../components/ModifyDate';
import Icon from 'react-native-vector-icons/dist/Feather';
import { db } from '../Database.js';
import { lbToKg, kgToLb, sortItems } from '../utils';

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
  const [isRoutineModalVisible, setRoutineModalVisible] = useState(false);
  const [unitSystem, setUnitSystem] = useState();
  const [selectedWorkout, setWorkout] = useState({});
  const [selectedItem, setItem] = useState({});
  const [initial, setInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pressedRoutine, setPressedRoutine] = useState(false);
  const [routine, setRoutine] = useState({});
  
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

  const filter = (month, year, day) => {
    var dateStr = month + " " + day + ", " + year;
    db.find({ "time.date": dateStr }, function (err, docs) { 
      setIsLoading(true);
      docs.map((doc) => {
        if (doc.unitSystem == "Imperial" && unitSystem == "Metric") {
          doc.workouts.map((workout) => {
            workout.sets.map((set) => {
              if(set.weightKgs == '') {
                set.weightKgs = lbToKg(set.weightLbs);
              }
            })
          })
          db.update({ id: doc.id }, { $set: { workouts: doc.workouts} });
          db.update({ id: doc.id }, { $set: { unitSystem: unitSystem} });
        } else if (doc.unitSystem == "Metric" && unitSystem == "Imperial") {
          doc.workouts.map((workout) => {
            workout.sets.map((set) => {
              if(set.weightLbs == '') {
                set.weightLbs = kgToLb(set.weightKgs);
              }
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

  const addItem = (time, workouts) => {
    if(!time || !workouts) {
      Alert.alert("Please enter a workout!")
    } else {
      var id = uuid()
      workouts.forEach(function(info, index) {
        info.name = info.name.trim();
      });
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
    workouts.forEach(function(info, index) {
      info.name = info.name.trim();
    });
    var newItem = { id: uuid(), routineName: routineName, workouts: workouts, unitSystem: unitSystem};
    db.insert(newItem);
  };

  const addRoutineWorkout = (workout) => {
    workout.name = workout.name.trim();
    db.findOne({ id: routine.id }, function(err, doc) {
      doc.workouts.push(workout)
      db.update({ id: routine.id }, { $set: { workouts: doc.workouts } })
      setRoutine(doc);
    })
  };

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
      modifiedWorkout.name = modifiedWorkout.name.trim();
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

  const deleteRoutineWorkout = (routineId, workoutId) => {
    db.findOne({ id: routineId }, function(err, doc) {
        doc.workouts = doc.workouts.filter(workout => workout.id != workoutId);
        db.update({ id: routineId }, { $set: { workouts: doc.workouts} });
        var newRoutine = routine
        newRoutine.workouts = doc.workouts
        setRoutine({...newRoutine});
    })
  };

  const modifyRoutineWorkout = (routineId, modifiedWorkout) => {
      modifiedWorkout.name = modifiedWorkout.name.trim();
      db.findOne({ id: routineId }, function(err, doc) {
          for (var i = 0; i < doc.workouts.length; i++){
              if(doc.workouts[i].id == modifiedWorkout.id) {
                  doc.workouts[i] = modifiedWorkout;
                  db.update({ id: routineId }, { $set: { workouts: doc.workouts} });
              }
          };
          var newRoutine = routine
          newRoutine.workouts = doc.workouts
          setRoutine({...newRoutine});
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
        style={styles.settingsIcon} 
        onPress={() => {setSettingsModalVisible(!isSettingsModalVisible)}}
      >
        <Icon color="white" name="settings" size={25} />
      </TouchableOpacity>
      {isLoading && <Spinner style={styles.spinner} color={"#2C95FF"} />}
      {!isLoading && 
        <View style={styles.flatListView}>
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
              <View style={styles.emptyLogView}> 
                {!isLoading && <Text style={styles.emptyLogText}>Log is Empty</Text>}
              </View>
            }
            initialNumToRender={6}
            maxToRenderPerBatch={4}
          />
        </View>
        }
      <View style={styles.button}>
        <AddLog 
          routine={routine} 
          setRoutine={setRoutine} 
          pressedRoutine={pressedRoutine} 
          setPressedRoutine={setPressedRoutine} 
          toggleInfoModal={toggleInfoModal} 
          setRoutineModalVisible={setRoutineModalVisible}
          addLog={addItem} 
          addRoutine={addRoutine} 
          unitSystem={unitSystem} 
        />
      </View>
      <Modal onRequestClose={() => setSettingsModalVisible(!isSettingsModalVisible)} isVisible={ isSettingsModalVisible } style={styles.settingsModal}>
        <Settings 
          unitSystem={unitSystem}
          setUnitSystem={setUnitSystem} 
          items={items} 
        />
      </Modal>
      <Modal onRequestClose={() => {setInfoModalVisible(!isInfoModalVisible)}} isVisible={ isInfoModalVisible } style={styles.infoModal}>
        {pressedRoutine && 
          <ModifyLog 
            itemId={selectedItemId} 
            workout={selectedWorkout} 
            modifyWorkout={modifyRoutineWorkout} 
            deleteWorkout={deleteRoutineWorkout} 
            setInfoModalVisible={setInfoModalVisible} 
            unitSystem={unitSystem}
          />
        }
        {!pressedRoutine && 
          <ModifyLog 
            itemId={selectedItemId} 
            workout={selectedWorkout} 
            modifyWorkout={modifyWorkout} 
            deleteWorkout={deleteWorkout} 
            setInfoModalVisible={setInfoModalVisible} 
            unitSystem={unitSystem}
          />
        }
      </Modal>
      <Modal onRequestClose={() => {setDateModalVisible(!isDateModalVisible)}} isVisible={ isDateModalVisible } style={styles.dateModal}>
        <ModifyDate 
          item={selectedItem}
          modifyDateTime={modifyDateTime} 
          setDateModalVisible={setDateModalVisible}
        />
      </Modal>
      <Modal onRequestClose={() => setRoutineModalVisible(!isRoutineModalVisible)} isVisible={ isRoutineModalVisible } style={styles.routineModal}>
        <AddRoutineWorkout 
          setRoutineModalVisible={setRoutineModalVisible} 
          addRoutineWorkout={addRoutineWorkout}
          unitSystem={unitSystem} 
        />
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
  settingsIcon: { 
    bottom: 43, 
    left: 65, 
    width: 30 
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
  routineModal: {
    position: "relative",
    marginTop: 100,
    marginBottom: 100,
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
  },
  spinner: { 
    marginTop: 20 
  },
  flatListView: { 
    marginTop: 10,
    marginBottom: 90 
  },
  emptyLogView: { 
    marginTop: 300, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  emptyLogText: { 
    fontSize: 20 
  }
});

export default HomeScreen;