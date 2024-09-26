// Constants

vLetterTotal = 120;


var socket = io();

// $(document).ready(function () {
//   $(window).scroll(function () {
//     var scrollPos = $(this).scrollTop();
//     $("body").css("background-position-y", scrollPos + "px");
//   });
// });



function signout() {
    document.cookie = "auth=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = "name=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.reload();
}

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

function openPopup() {
    const popupContainer = document.getElementById("popupContainer");
    popupContainer.style.display = "flex";
}

function closePopup() {
    const popupContainer = document.getElementById("popupContainer");
    popupContainer.style.display = "none";
}

function isLoggedIn(arr) {
    if (arr === undefined || arr.length == 0) {
        return false;
    }
    return arr[arr.length - 1].end === undefined;
}

// function googleLogin(s) {
//     setCookie("auth", jwt_decode(s.credential).email, 90);
//     setCookie("name", jwt_decode(s.credential).name, 90);
//     window.location.href = "/";
// }

var isLoggedInT = false;

// function testUser() {
//     setCookie("auth", "apowvalla26@jesuitmail.org", 90);
// }

// function testAdmin() {
//     setCookie("auth", "aries.powvalla@gmail.com", 90);
// }


var sti;

function updateTime() {
    var startTime = new Date(sti);
    var now = new Date();
    var timeDiff = now.getTime() - startTime.getTime() + 1;
    var seconds = Math.floor((timeDiff / 1000) % 60);
    var minutes = Math.floor((timeDiff / 1000 / 60) % 60);
    var hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);

    document.getElementById("time-alert").innerHTML =
        hours + "  h     " + minutes + "  m     " + seconds + "  s";
}

function calculateMeetingProgress(meetingObject) {
    if (!meetingObject.enabled) {
        document.getElementById("m-status").innerHTML = "No Meeting Today";
        return "none";
    }

    const now = new Date();
    //console.log(meetingObject)
    const { start, duration } = meetingObject;

    const meetingStartTime = new Date(now);
    meetingStartTime.setHours(start.hour, start.minute, 0, 0);

    const meetingEndTime = new Date(
        meetingStartTime.getTime() + duration * 60000
    );

    if (now < meetingStartTime) {
        document.getElementById("m-status").innerHTML = "Starting Later";
        return 0;
    } else if (now > meetingEndTime) {
        document.getElementById("m-status").innerHTML = "Meeting Ended";
        return 1;
    }

    document.getElementById("m-status").innerHTML = "In Progress";

    const elapsedTime = now - meetingStartTime;
    const progress = elapsedTime / (duration * 60000);

    return Math.min(progress, 1); // Ensure the progress is between 0 and 1
}

function convertRawToSE(meetingData) {
    // Extracting data from the input object
    const { start, duration } = meetingData;
    const { hour, minute } = start;

    // Calculating end time
    const endHour = Math.floor((hour * 60 + minute + duration) / 60) % 24;
    const endMinute = (minute + duration) % 60;

    // Formatting start time
    const formattedStart = formatTime(hour, minute);

    // Formatting end time
    const formattedEnd = formatTime(endHour, endMinute);

    return [formattedStart, formattedEnd];
}

function formatTime(hour, minute) {
    // Convert hour to 12-hour format and determine AM/PM
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 ? "AM" : "PM";

    // Pad minute with leading zero if needed
    const formattedMinute = minute < 10 ? `0${minute}` : minute;

    // Construct formatted time string
    const formattedTime = `${formattedHour}:${formattedMinute} ${period}`;

    return formattedTime;
}

function tsplit(decimalHours) {
    const hours = Math.floor(decimalHours);
    const minutes = Math.floor((decimalHours - hours) * 60);
    return [hours, minutes];
}

var udata;
var y = {
    start: {
        hour: 23,
        minute: 58,
    },
    duration: 1,
};

function performChecks() {
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {
        console.log(response.status);
        if (response.status == "ok") {
            udata = response.data;
            if (isEmpty(udata)) {
                console.log("udata " + udata);
                document.getElementById("alert").removeAttribute("hidden");
                document.getElementById("alert").innerHTML =
                    "You do not have access to this tool.<br>If this is an error, email apowvalla26@jesuitmail.org.";
            } else {
                // document.getElementById("minfo2").removeAttribute("hidden");
                document.getElementById("total-hour-display").innerHTML =
                    "<strong>Your Total Hours: </strong>" +
                    udata.hours +
                    " (<a style='color:#ccccff' href='/requests'>Request a change</a>)";
                // document.getElementById("total-perc-display").innerHTML =
                //     "<strong>Progress to Varsity Letter: </strong>" +
                //     Math.round((udata.hours / vLetterTotal) * 1000) / 10 +
                //     "%";
                document.getElementById("eula").removeAttribute("hidden");
                y = response.mdata_local;
                updateVarBar();
                if (!y.enabled) {
                    document.getElementById("m-start").innerHTML = ``;
                    document.getElementById("m-end").innerHTML = ``;
                } else {
                    z = convertRawToSE(y);

                    updateProgressBar();

                    document.getElementById(
                        "m-start"
                    ).innerHTML = `Meeting Starts: ${z[0]}`;
                    document.getElementById("m-end").innerHTML = `Meeting Ends: ${z[1]}`;
                }

                document.getElementById("minfo").removeAttribute("hidden");
                //document.getElementById("2").removeAttribute("hidden");
                //document.getElementById("2b").removeAttribute("hidden");
                document.getElementById("name-display").innerHTML =
                    "Signed in as: <strong>" + localStorage.getItem("name") + "</strong>";
                if (!response.m) {
                    document.getElementById("alert2").removeAttribute("hidden");
                    document.getElementById("alert2").innerHTML =
                        "There is no meeting currently in progress.";
                    document.getElementById("2").setAttribute("disabled", true);
                    document.getElementById("2b").setAttribute("disabled", true);
                }

                if (isLoggedIn(udata.record)) {
                    document.getElementById("2b").removeAttribute("hidden");
                    document.getElementById("data-alert").innerHTML =
                        "You are clocked in.";
                    document.getElementById("time-alert").removeAttribute("hidden");
                    sti = udata.record[udata.record.length - 1].start;
                    updateTime();
                    clockUpdater = setInterval(updateTime, 1000);
                } else {
                    document.getElementById("2").removeAttribute("hidden");
                }

                socket.emit("fetchUpdates",udata.id, (response) => {
                    if (response.status == "update") {
                        openPopup();
                    }
                });
            }
        } else if ((response.status = "admin")) {
            document.getElementById("apanel").removeAttribute("hidden");
            document.getElementById("3").removeAttribute("hidden");
        } else {
            alertify.error("There was an error!");
        }
    });
}

performChecks();

function clockin() {
    socket.emit("signIn", localStorage.getItem("auth"), (response) => {
        if (response.status == "success") {
            document.getElementById("data-alert").innerHTML = "You are clocked in.";
            document.getElementById("2").setAttribute("hidden", true);
            document.getElementById("2b").removeAttribute("hidden");
            sti = response.data.record[response.data.record.length - 1].start;
            try {
                clearInterval(clockUpdater);
            } catch { }
            document.getElementById("time-alert").removeAttribute("hidden");
            var bmm = new Date(sti);
            var bmn = new Date();
            var bmo = bmn.getTime() - bmm.getTime() + 1;
            if (bmo >= 60000) {
                alertify.success(
                    "The meeting started recently, so you were given credit for the last few minutes."
                );
            }
            updateTime();
            clockUpdater = setInterval(updateTime, 1000);
        } else if (response.status == "badstate") {
            return false;
        } else if (response.status == "nomeeting") {
            alertify.error("There is no meeting currently in progress.");
        } else {
            document.getElementById("alert").removeAttribute("hidden");
            document.getElementById("alert").innerHTML =
                "There was an error: " + response.status;
            console.log(response);
        }
    });
}

function clockout() {
    socket.emit("signOut", localStorage.getItem("auth"), (response) => {
        if (response.status == "success") {
            document.getElementById("data-alert").innerHTML = "You are clocked out.";
            document.getElementById("2b").setAttribute("hidden", true);
            document.getElementById("time-alert").setAttribute("hidden", true);
            document.getElementById("2").removeAttribute("hidden");
        } else if (response.status == "badstate") {
            return false;
        } else if (response.status == "nomeeting") {
            alertify.error("There is no meeting currently in progress.");
        } else {
            document.getElementById("alert").removeAttribute("hidden");
            document.getElementById("alert").innerHTML =
                "There was an error: " + response.status;
            console.log(response);
        }
    });
}

async function sec() {
    alertify.error("Sorry, we don't currently have any great fixes for this. Try using your school iPad.");
}

function updateProgressBar() {
    const meetingContainer = document.getElementById("minfo");
    const progress = calculateMeetingProgress(y);

    if (progress === 0 || progress === "none") {
        meetingContainer.style.background = "rgba(54, 104, 64, 0.7)"; // Reset background color
    } else {
        const gradientColor = `linear-gradient(90deg, rgba(122, 195, 122, 0.7) ${progress * 100
            }%, rgba(54, 104, 64, 0.7) ${progress * 100}%)`;
        meetingContainer.style.background = gradientColor;
    }
}

function updateVarBar() {
    const meetingContainer = document.getElementById("minfo2");
    const progress = Math.round((udata.hours / vLetterTotal) * 1000) / 1000;

    if (progress === 0 || progress === "none") {
        meetingContainer.style.background = "#366840"; // Reset background color
    } else {
        const gradientColor = `linear-gradient(90deg, rgba(122, 195, 122, 1) ${progress * 100
            }%, rgba(54, 104, 64, 1) ${progress * 100}%)`;
        meetingContainer.style.background = gradientColor;
    }
}

// Update the progress bar every 10 seconds
if (isLoggedInT) {
    setInterval(updateProgressBar, 10000);
}
updateProgressBar();

