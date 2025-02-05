var socket = io();

// $(document).ready(function() {
//     $(window).scroll(function() {
//         var scrollPos = $(this).scrollTop();
//         $('body').css('background-position-y', -scrollPos + 'px');
//     });
// });

let refobj;


if (
    localStorage.getItem("auth") == "apowvalla26@jesuitmail.org" ||
    localStorage.getItem("auth") == "whitenj@gmail.com" ||
    localStorage.getItem("auth") == "pwhite@jesuitmail.org"
) {
    document.getElementById("overlay").remove();
} else {
    window.location.replace("/");
}

function formatDate1(dateStringa, dateStringb) {
    const date = new Date(dateStringa);
    const date2 = new Date(dateStringb);

    if (isNaN(date.getTime())) {
        return "Invalid Date 1";
    }

    const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours() % 12 || 12).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = date.getHours() < 12 ? "AM" : "PM";

    const hours2 = String(date2.getHours() % 12 || 12).padStart(2, "0");
    const minutes2 = String(date2.getMinutes()).padStart(2, "0");
    const period2 = date2.getHours() < 12 ? "AM" : "PM";

    if (isNaN(date2.getTime())) {
        return `<strong>${dayOfWeek} ${month}/${day}/${year} | ${hours}:${minutes} ${period} (SIGNED IN)</strong>`;
    }

    const formattedDate = `${dayOfWeek} ${month}/${day}/${year} | ${hours}:${minutes} ${period} > ${hours2}:${minutes2} ${period2}`;

    return formattedDate;
}

function isLoggedIn(arr) {
    if (arr === undefined || arr.length == 0) {
        return false;
    }
    return arr[arr.length - 1].end === undefined;
}

// const gty = (y) => {
//     const currentYear = new Date().getFullYear() % 100;
//     const graduationYear = parseInt(y, 10);
//     const grade =
//         currentYear >= graduationYear ? 12 : 13 - (graduationYear - currentYear);
//     return Math.max(1, Math.min(12, grade));
// };

var uData;
var globalReferenceID;

function openPopup(title, data, id) {
    const popupContainer = document.getElementById("popupContainer");
    const popupTitle = document.getElementById("popupTitle");
    const popupContent = document.getElementById("popupContent");

    popupTitle.innerText = title;

    globalReferenceID = id;

    popupContent.innerHTML = "";

    if (data === undefined || data.length == 0) {
        const textField = document.createElement("p");
        textField.innerHTML = "No logins on record.";
        popupContent.appendChild(textField);
    }

    const reversedData = [...data].reverse();

    reversedData.forEach((item) => {
        const formS = formatDate1(item.start, item.end);
        popupContent.innerHTML += `<span class='hourEditWrapper'>
        <button onclick='hourRemove(this);' class='hourEditBtn'>&#10006;</button>
        <button onclick='hourEdit(this);' class='hourEditBtn'>&#9998;</button>
        <p>${formS}</p>
      </span>`;
    });

    popupContainer.style.display = "flex";
}

function addRecord() {
    closePopup();
    popupContainer4.style.display = "flex";
}

let interchangeIndex;

function hourEdit(docid) {
    var spans = docid.parentNode.parentNode.getElementsByTagName("span");
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].contains(docid.parentNode)) {
            index = spans.length - i - 1;
        }
    }

    if (!refobj.record[index].end) {
        alertify.error(
            "This record is currently active. Please sign out the student before editing the time."
        );
        return;
    }

    interchangeIndex = index;

    let time0 = new Date(refobj.record[index].start);
    time0.setTime(time0.getTime() - 7 * 60 * 60 * 1000);

    // let hours = date.getUTCHours().toString().padStart(2, '0'); // Get the hours and pad with 0 if necessary
    // let minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Get the minutes and pad with 0 if necessary

    document.getElementById("startI").value = `${time0
        .toISOString()
        .slice(0, 16)}`;

    let time2 = new Date(refobj.record[index].end);
    time2.setTime(time2.getTime() - 7 * 60 * 60 * 1000); // Subtract 8 hours

    // let hours2 = date2.getUTCHours().toString().padStart(2, '0'); // Get the hours and pad with 0 if necessary
    // let minutes2 = date2.getUTCMinutes().toString().padStart(2, '0'); // Get the minutes and pad with 0 if necessary

    document.getElementById("endI").value = `${time2.toISOString().slice(0, 16)}`;

    closePopup();
    popupContainer3.style.display = "flex";
}

function hourRemove(docid) {
    var spans = docid.parentNode.parentNode.getElementsByTagName("span");
    for (var i = 0; i < spans.length; i++) {
        if (spans[i].contains(docid.parentNode)) {
            index = spans.length - i - 1;
        }
    }

    if (!refobj.record[index].end) {
        alertify.error(
            "This record is currently active. Please sign out the student before editing the time."
        );
        return;
    }

    // if (!confirm("Delete?")) {
    //     return false;
    // }

    var popupContent = document.getElementById("popupContent");
    var spans = popupContent.getElementsByTagName("span");
    if (index >= 0 && index < spans.length) {
        var spanToRemove = spans[spans.length - index - 1];
        spanToRemove.parentNode.removeChild(spanToRemove);
    } else {
        console.error("Invalid index provided.");
    }
    socket.emit("hourRemove", refobj.id, index, (response) => {
        if (response.status == "success") {
            document.getElementById(
                "h-" + refobj.id
            ).innerText = `Hours: ${response.hours}`;

            valve(document.getElementById("userInput").value);

            alertify.success("Success.");
        } else {
            alertify.error("There was an error:" + response.status);
        }
    });
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    popupContainer.style.display = "none";
}

function closePopup2() {
    const popupContainer2 = document.getElementById("popupContainer2");
    popupContainer2.style.display = "none";
}

function closePopup3() {
    const popupContainer3 = document.getElementById("popupContainer3");
    popupContainer3.style.display = "none";
}

function closePopup4() {
    const popupContainer4 = document.getElementById("popupContainer4");
    popupContainer4.style.display = "none";
}

function closePopup3AndSave() {
    const popupContainer3 = document.getElementById("popupContainer3");
    popupContainer3.style.display = "none";
    socket.emit(
        "hourEdit",
        refobj.id,
        interchangeIndex,
        new Date(document.getElementById("startI").value),
        new Date(document.getElementById("endI").value),
        (response) => {
            if (response.status == "success") {
                document.getElementById(
                    "h-" + refobj.id
                ).innerText = `Hours: ${response.hours}`;

                valve(document.getElementById("userInput").value);

                alertify.success("Success.");
            } else {
                alertify.error("There was an error:" + response.status);
            }
        }
    );
}

function closePopup4AndSave() {
    const popupContainer4 = document.getElementById("popupContainer4");
    popupContainer4.style.display = "none";
    socket.emit(
        "hourAdd",
        globalReferenceID,
        new Date(document.getElementById("startIb").value),
        new Date(document.getElementById("endIb").value),
        (response) => {
            if (response.status == "success") {
                document.getElementById(
                    "h-" + refobj.id
                ).innerText = `Hours: ${response.hours}`;

                valve(document.getElementById("userInput").value);

                alertify.success("Success.");
            } else if (response.status == "overlap") {
                alertify.error("The times given overlap with another meeting.");
            } else if (response.status == "aftercurrent") {
                alertify.error("Times cannot be after an ongoing meeting.");
            } else {
                alertify.error("There was an error:" + response.status);
            }
        }
    );
}

function submitPopup() {
    closePopup();
}

function popup(setm) {
    refobj = uData.find((obj) => obj.id === setm);
    openPopup(refobj.name, refobj.record, refobj.id);
}

function popup2() {
    popupContainer2.style.display = "flex";
}

function clearAll() {
    const conf = window.prompt(
        'Are you SURE you want to clear all login data?\n\nIt is recommended to create a backup first.\n\nConfirm your action by typing\n"I wish to delete all attendance data."'
    );
    if (
        conf == "I wish to delete all attendance data." ||
        conf == '"I wish to delete all attendance data."'
    ) {
        socket.emit("clearAll", (response) => {
            if (response.status == "success") {
                alert("Success.");
                location.reload();
            } else {
                alertify.error("There was an error:" + response.status);
            }
        });
    } else {
        alertify.error("Action Cancelled.");
    }
}

function clearStudent() {
    const conf = window.prompt(
        "This action will remove all sign ins from a student. It will NOT remove a student from the roster.\n\nEnter the full name of the student."
    );
    if (conf != "" && conf != null) {
        socket.emit("clearOne", conf, (response) => {
            if (response.status == "success") {
                alert("The student was cleared.");
                location.reload();
            } else if ((response.statuee = "nouser")) {
                alertify.error("No such student.");
            } else {
                alertify.error("There was an error:" + response.status);
            }
        });
    } else {
        alertify.error("Action Cancelled.");
    }
}

function userin(ee) {
    socket.emit("signIn", ee, (response) => {
        if (response.status == "success") {
            document.getElementById(ee).classList.add("sel");
            document.getElementById(ee).innerText = "Sign Out";
        } else if (response.status == "badstate") {
            return false;
        } else if (response.status == "nomeeting") {
            alertify.error("There is no meeting currently in progress.");
        } else {
            alert.error("There was an error:" + response.status);
        }
    });
}

function userout(ee) {
    socket.emit("signOut", ee, (response) => {
        if (response.status == "success") {
            document.getElementById(ee).classList.remove("sel");
            document.getElementById(ee).innerText = "Sign In";
        } else if (response.status == "badstate") {
            return false;
        } else if (response.status == "nomeeting") {
            alertify.error("There is no meeting currently in progress.");
        } else {
            alertify.error("There was an error:" + response.status);
        }
    });
}

function valve(content) {
    socket.emit("findUsers", content, (response) => {
        if (response.status == "ok") {
            document.getElementById("cards").innerHTML = "";

            uData = response.data;
            if (uData.length == 0) {
                document.getElementById("cards").innerHTML = "<h3>No results.</h3>";
            }
            uData.forEach((s) => {
                document.getElementById("cards").innerHTML += `<div class="card">
  <h2>${s.name}</h2>
  <p>Year: ${s.grad}</p>
  <button class='p-button signon-button${isLoggedIn(s.record) ? " sel" : ""
                    }' id="${s.id}" onclick="${isLoggedIn(s.record) ? "userout" : "userin"}('${s.id
                    }')">${isLoggedIn(s.record) ? "Sign Out" : "Sign In"}</button>
  <button class='p-button signon-button' onclick="popup('${s.id
                    }')">Details</button>
  <p id='h-${s.id}'>Hours: ${s.hours}</p>
</div>
`;
            });
        } else {
            alertify.error("There was an error!");
        }
    });
}

function addUser() {
    window.location.href = "/kiosk/new";
}

// Beautiful search function by Aries Powvalla

(function () {
    var oldVal = "";
    var delayTimer;
    $("#userInput").on("input", function () {
        var val = this.value;

        if (
            val !== oldVal &&
            (val.length >= 3 || val == "#" || Array.from(val)[0] == "^")
        ) {
            oldVal = val;
            clearTimeout(delayTimer);
            document.getElementById("cards").innerHTML = "<div class='loader'></div>";
            delayTimer = setTimeout(function () {
                valve(val);
            }, 250);
        } else {
            document.getElementById("cards").innerHTML =
                'Please enter at least 3 characters<br><strong>OR</strong><br>Type "#" to show all students<br>Type "^[num]" to show students with at least [num] hrs<br><br>';
        }
    });
})();

$(".signon-button").on("click", function () {
    $(".signon-button").removeClass("v");
    $(this).addClass("v");
    $("#userInput").val();
});

function checkTimeValidity() {
    var startInput = document.getElementById("startI");
    var endInput = document.getElementById("endI");
    var submitButton = document.getElementById("savebtn");
    var alertbox = document.getElementById("alert");

    if (
        startInput.checkValidity() &&
        endInput.checkValidity() &&
        startInput.value != "" &&
        endInput.value != ""
    ) {
        var startTime = new Date(startInput.value);
        var endTime = new Date(endInput.value);

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
    checkTimeValidity2();
}

function checkTimeValidity2() {
    var startInput = document.getElementById("startIb");
    var endInput = document.getElementById("endIb");
    var submitButton = document.getElementById("savebtnb");
    var alertbox = document.getElementById("alertb");

    if (
        startInput.checkValidity() &&
        endInput.checkValidity() &&
        startInput.value != "" &&
        endInput.value != ""
    ) {
        var startTime = new Date(startInput.value);
        var endTime = new Date(endInput.value);

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

setInterval(checkTimeValidity, 200);

socket.emit("getLoggedInPerSubteam", (response) => {
    // response.data is an object containing each subteam id and the number of people logged in
    document.getElementById("subteam-data").innerHTML = "";
    for (const [key, value] of Object.entries(response.data)) {
        document.getElementById("subteam-data").innerHTML += `<p>${key}: ${value}</p>`;
    }
});