var socket = io();
var schedData;

function ctf(hr, min) {
  if (hr < 10) {
    hr = "0" + hr;
  }
  if (min < 10) {
    min = "0" + min;
  }
  return hr + ":" + min;
}

function appendTime(hours, minutes, additionalMinutes) {
  const totalMinutes = hours * 60 + minutes + additionalMinutes;
  const x = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const y = String(totalMinutes % 60).padStart(2, "0");
  return x + ":" + y;
}

let map = new Map();
map
  .set("sun", "Sunday")
  .set("mon", "Monday")
  .set("tue", "Tuesday")
  .set("wed", "Wednesday")
  .set("thu", "Thursday")
  .set("fri", "Friday")
  .set("sat", "Saturday");

days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];


if (
  localStorage.getItem("auth") == "aries.powvalla@gmail.com" ||
  localStorage.getItem("auth") == "whitenj@gmail.com" ||
  localStorage.getItem("auth") == "pwhite@jesuitmail.org"
) {
  document.getElementById("overlay").remove();

  socket.emit("scheduleRequest", (response) => {
    if (response.status == "ok") {
      schedData = response.data;
      days.forEach((tday) => {
        if (schedData[tday].enabled == true) {
          document.getElementById(tday).classList.add("rec");
        }
      });
    } else {
      alert("There was an error!");
    }
  });
} else {
  window.location.replace("/");
}

var item;

function tabOut(obj) {
  var startI = document.getElementById("startI");
  var endI = document.getElementById("endI");
  startI.value = ctf(
    schedData[obj.id].start.hour,
    schedData[obj.id].start.minute
  );
  endI.value = appendTime(
    schedData[obj.id].start.hour,
    schedData[obj.id].start.minute,
    schedData[obj.id].duration
  );
  document.getElementById("re").innerText = schedData[obj.id].enabled
    ? "Disable Recurring"
    : "Enable Recurring";
  document.getElementById("re").style.backgroundColor = schedData[obj.id]
    .enabled
    ? "#9d7701"
    : "#be9913";
  document.getElementById("re").recstate = schedData[obj.id].enabled;

  days.forEach((tday) => {
    document.getElementById(tday).classList.remove("sel");
  });
  obj.classList.add("sel");
  item = obj.id;
  startI.removeAttribute("disabled");
  endI.removeAttribute("disabled");
  document.getElementById("thisdotw").innerText = map.get(item);
}

function checkTimeValidity() {
  var startInput = document.getElementById("startI");
  var endInput = document.getElementById("endI");
  var submitButton = document.getElementById("re");
  var submitButton2 = document.getElementById("one");
  var alertbox = document.getElementById("alert");

  if (
    startInput.checkValidity() &&
    endInput.checkValidity() &&
    startInput.value != "" &&
    endInput.value != ""
  ) {
    var startTime = new Date("2000-01-01 " + startInput.value);
    var endTime = new Date("2000-01-01 " + endInput.value);

    // Check if end time is after start time
    if (endTime > startTime) {
      submitButton.disabled = false;
      //console.log(startInput.value)
      //submitButton2.disabled = false;
      alertbox.innerText = "";
    } else {
      submitButton.disabled = true;
      // submitButton2.disabled = true;
      alertbox.innerText = "End time must be after start time.";
    }
  } else {
    submitButton.disabled = true;
    // submitButton2.disabled = true;
    alertbox.innerText = "";
  }
}

function schedule() {
  if (document.getElementById("re").recstate) {
    socket.emit("disableDay", item, (response) => {
      if (response.status == "ok") {
        document.getElementById("re").innerText = "Enable Recurring";
        document.getElementById("re").style.backgroundColor = "#be9913";
        document.getElementById("re").recstate = false;
        document.getElementById(item).classList.remove("rec");
      } else {
        alert("There was an error!");
      }
    });
  } else {
    const [hrs, mins] = document.getElementById("startI").value.split(":");
    const [endHrs, endMins] = document.getElementById("endI").value.split(":");
    const duration =
      parseInt(endHrs) * 60 +
      parseInt(endMins) -
      (parseInt(hrs) * 60 + parseInt(mins));

    socket.emit("enableDay", item, hrs, mins, duration, (response) => {
      if (response.status == "ok") {
        document.getElementById("re").innerText = "Disable Recurring";
        document.getElementById("re").style.backgroundColor = "#9d7701";
        document.getElementById("re").recstate = true;
        document.getElementById(item).classList.add("rec");
      } else {
        alert("There was an error!");
        console.log(response.data);
      }
    });
  }
}

setInterval(checkTimeValidity, 200);
