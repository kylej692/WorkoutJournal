import { ToastAndroid } from 'react-native';

export const notifyMessage = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT)
};

export const lbToKg = (weight) => {
    var num = weight * 0.45359237
    return +num.toFixed(2)
}

export const kgToLb = (weight) => {
    var num = weight / 0.45359237
    return +num.toFixed(2)
}

export const timeConvertTo12 = (time) => {
    var hour = parseInt(time.slice(0, 2));
    var minute = time.slice(3, 5);
    var meridiem;
    
    if(hour == 12) {
        meridiem = "pm";
    } else if(hour == 0) {
        hour = 12;
        meridiem = "am";
    } else if (hour > 12) {
        hour = hour - 12;
        meridiem = "pm";
    } else {
        meridiem = "am";
    }

    return hour + ":" + minute + meridiem;
 };

const monthsInYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const sortItems = (items) => {
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