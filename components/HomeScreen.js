import React, {useState} from 'react';
import { View, StyleSheet, Alert, FlatList } from 'react-native';
import Header from './Header';
import LogEntry from './LogEntry';
import AddLogButton from './AddLogButton';
import 'react-native-get-random-values';
import { uuid } from 'uuidv4';
import AsyncStorage from '@react-native-community/async-storage';
import FilterLogs from './FilterLogs';
import Modal from 'react-native-modal';
import ModifyLog from '../components/ModifyLog';
import ModifyDate from '../components/ModifyDate';

const HomeScreen = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedMonthValue, setSelectedMonthValue] = useState("None");
  const [selectedYearValue, setSelectedYearValue] = useState("None");
  const [rangeLow, setRangeLow] = useState(1);
  const [rangeHigh, setRangeHigh] = useState(31);

  const [isInfoModalVisible, setInfoModalVisible] = useState(false);
  const [isDateModalVisible, setDateModalVisible] = useState(false);
  const [selectedWorkout, setWorkout] = useState({});
  const [selectedItem, setItem] = useState({});

  const toggleInfoModal = (workout) => {
    setInfoModalVisible(!isInfoModalVisible);
    setWorkout(workout)
  }

  const toggleDateModal = (item) => {
    setDateModalVisible(!isDateModalVisible);
    setItem(item);
}
  //AsyncStorage functions
  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async (key) => {
    try {
      var jsonValue = await AsyncStorage.getItem(key);
      return JSON.parse(jsonValue);
    } catch(e) {
      console.log(e);
    }
  };

  const getAllKeys = async () => {
    let keys = []
    try {
      keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch(e) {
      console.log(e);
    };
  };

  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      console.log(e);
    };
  
    console.log('Done.');
  };

  //Get all workout logs from local storage
  if(items.length == 0) {
    getAllKeys().then(keys => {
      keys.map((key) => {
        getData(key).then(val => { 
          setItems(prevItems => {
            return [ val, ...prevItems ];
          });
          setFilteredItems(prevItems => {
            return [ val, ...prevItems ];
          });
        });
      });
    });
  };

  const sortItems = (items) => {
    const sorted = [...items].sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month1 = months.indexOf(a.time.date.slice(0, 3)) + 1;
      const day1 = a.time.date.slice(4, 6);
      const year1 = a.time.date.slice(8, 12);
      const month2 = months.indexOf(b.time.date.slice(0, 3)) + 1;
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

  const filter = (month, year, rangeLow, rangeHigh) => {
    if(month === "None" && year === "None") {

      if(rangeLow != 1 || rangeHigh != 31) {

        setFilteredItems(() => {
          return items.filter(item => item.time.date.slice(4, 6) >= rangeLow && item.time.date.slice(4, 6) <= rangeHigh);
        })

      } else {
        setFilteredItems(items);
      }

    } else if (year === "None") {

      if(rangeLow != 1 || rangeHigh != 31) {

        setFilteredItems(() => {
          return items.filter(item => item.time.date.slice(0, 3) === month && item.time.date.slice(4, 6) >= rangeLow && item.time.date.slice(4, 6) <= rangeHigh);
        })

      } else {
        setFilteredItems(() => {
          return items.filter(item => item.time.date.slice(0, 3) === month);
        })
      }

    } else if (month === "None") {

      if(rangeLow != 1 || rangeHigh != 31) {

        setFilteredItems(() => {
          return items.filter(item => item.time.date.slice(8, 12) === year && item.time.date.slice(4, 6) >= rangeLow && item.time.date.slice(4, 6) <= rangeHigh);
        })

      } else {
        setFilteredItems(() => {
          return items.filter(item => item.time.date.slice(8, 12) === year);
        })
      }

    } else {

      if(rangeLow != 1 || rangeHigh != 31) {

        setFilteredItems(() => {
          return items.filter(item => 
            item.time.date.slice(0, 3) === month && item.time.date.slice(8, 12) === year && item.time.date.slice(4, 6) >= rangeLow && item.time.date.slice(4, 6) <= rangeHigh);
        })

      } else {
        setFilteredItems(() => {
          return items.filter(item => item.time.date.slice(0, 3) === month && item.time.date.slice(8, 12) === year);
        })
      }

    }
  };

  //Get all the months and years of the workout logs for filter component
  var monthsList = [];
  var yearsList = [];

  items.map((item) => {
    
    var month = item.time.date.slice(0, 3);
    if(!monthsList.includes(month)) {
      monthsList.push(month);
    };

    var year = item.time.date.slice(8, 12);
    if(!yearsList.includes(year)) {
      yearsList.push(year);
    };

  });

  var months = [{label: "None"}];
  monthsList.map((month) => {
    months.push({label: month})
  });

  var years = [{label: "None"}];
  yearsList.map((year) => {
    years.push({label: year})
  });

  const addItem = (time, workouts) => {
    if(!time || !workouts) {
      Alert.alert("Please enter a workout!")
    } else {
      var id = uuid()
      setItems(prevItems => {
        var newItem = {id: id, time: time, workouts: workouts};
        storeData(newItem.id, newItem);
        return [ newItem, ...prevItems ];
      });
      if((selectedMonthValue === "None" && selectedYearValue === "None") || time.date.slice(0, 3) === selectedMonthValue || time.date.slice(8, 12) === selectedYearValue) {
        setFilteredItems(prevItems => {
          var newItem = {id: id, time: time, workouts: workouts};
          return [ newItem, ...prevItems ];
        });
      }
    }
  };

  const deleteWorkout = (id) => {
    setItems(prevItems => {
      var emptyItemId = null;
      prevItems.map((item) => {
        item.workouts = item.workouts.filter(workout => workout.id != id);
        storeData(item.id, item);
        if(item.workouts.length == 0) {
          emptyItemId = item.id;
          removeValue(item.id);
        }
      })
      return prevItems.filter(item => item.id != emptyItemId);
    });

    setFilteredItems(prevItems => {
      var emptyItemId = null;
      prevItems.map((item) => {
        item.workouts = item.workouts.filter(workout => workout.id != id);
        if(item.workouts.length == 0) {
          emptyItemId = item.id;
        }
      })
      return prevItems.filter(item => item.id != emptyItemId);
    });

  };

  const modifyWorkout = (modifiedWorkout) => {
    setItems(prevItems => {
      for(var i = 0; i < prevItems.length; i++) {
        for(var j = 0; j < prevItems[i].workouts.length; j++) {
          if(prevItems[i].workouts[j].id == modifiedWorkout.id) {
            prevItems[i].workouts[j] = modifiedWorkout
            storeData(prevItems[i].id, prevItems[i]);
          }
        }
      }
      return prevItems;
    })

    setFilteredItems(prevItems => {
      for(var i = 0; i < prevItems.length; i++) {
        for(var j = 0; j < prevItems[i].workouts.length; j++) {
          if(prevItems[i].workouts[j].id == modifiedWorkout.id) {
            prevItems[i].workouts[j] = modifiedWorkout
            storeData(prevItems[i].id, prevItems[i]);
          }
        }
      }
      return prevItems;
    })
  };

  const modifyDateTime = (itemId, date, start, end) => {
    setItems(prevItems => {
      for(var i = 0; i < prevItems.length; i++) {
        if(prevItems[i].id == itemId) {
          prevItems[i].time.date = date;
          prevItems[i].time.start = start;
          prevItems[i].time.end = end;
          storeData(prevItems[i].id, prevItems[i]);
        }
      }
      return sortItems(prevItems);
    })
  };

  return (
    <View style={styles.container}>
      <Header title='Workout Journal'/>
      <FlatList style={styles.content}
        data={sortItems(filteredItems)}
        renderItem={(data) => (
          <LogEntry 
            item={data.item} i
            toggleInfoModal={toggleInfoModal}
            toggleDateModal={toggleDateModal}
            key={data.item.id} />
        )}
        initialNumToRender={4}
        maxToRenderPerBatch={5}
      />
      <View style={styles.button}>
        <AddLogButton addLog={addItem}/>
      </View>
      <FilterLogs 
        months={months} 
        years={years} 
        filter={filter} 
        selectedMonthValue={selectedMonthValue}
        selectedYearValue={selectedYearValue}
        setSelectedMonthValue={setSelectedMonthValue} 
        setSelectedYearValue={setSelectedYearValue} 
        selectedMonthValue={selectedMonthValue} 
        selectedYearValue={selectedYearValue} 
        rangeLow={rangeLow} 
        rangeHigh={rangeHigh} 
        setRangeLow={setRangeLow}
        setRangeHigh={setRangeHigh}
      />
      <Modal onRequestClose={() => {setInfoModalVisible(!isInfoModalVisible)}} isVisible={ isInfoModalVisible } style={styles.infoModal}>
          <ModifyLog workout={selectedWorkout} modifyWorkout={modifyWorkout} deleteWorkout={deleteWorkout} setInfoModalVisible={setInfoModalVisible}/>
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
    marginTop: 40,
    paddingLeft: 5,
    paddingRight: 5
  },
  button: {
    position: 'absolute',
    top: 12, 
    right: 5,
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