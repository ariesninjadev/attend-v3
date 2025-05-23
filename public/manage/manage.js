function getStatus(status, end) {
    if (!end) {
        return `<span class="badge bg-success me-1"></span> Verified    `;
    }
    if (status == 1) {
        return `<span class="badge bg-success me-1"></span> Verified`;
    } else if (status == 2) {
        return `<span class="badge bg-warning me-1"></span> Reviewing`;
    } else if (status == 3) {
        return `<span class="badge bg-danger me-1"></span> Rejected`;
    } else {
        return `<span class="badge bg-secondary me-1"></span> Unknown`;
    }
}

function timestampToTime(timestamp) {
    // Format: 2024-09-09T15:15:00.000Z
    // To: 3:15 PM
    const date = new Date(timestamp);
    const f = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    if (f === "Invalid Date") {
        return " ";
    }
    return f;
}

function timestampToDate(timestamp) {
    // Format: 2024-09-09T15:15:00.000Z
    // To: Sep 9, 2024
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function av3ToTime(av3) {
    // Format: { start: { hour: int, minute, int } }
    // To: 3:15 PM
    const hour = av3.start.hour;
    const minute = av3.start.minute;
    const period = hour < 12 ? "AM" : "PM";
    const f = `${hour % 12 || 12}:${minute.toString().padStart(2, '0')} ${period}`;
    return f;
}

function av3ToDateObject(av3) {
    // Format: { start: { hour: int, minute, int } }
    // To: Date object (with day as today)
    const date = new Date();
    date.setHours(av3.start.hour);
    date.setMinutes(av3.start.minute);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

function numPad(num) {
    return num.toString().padStart(4, '0');
}

function findNet(element) {
    // Iterate through element.data
    let net = 0;
    element.data.forEach((e) => {
        if (e.status == 1) {
            net++;
        } else if (e.status == 2) {
            net--;
        }
    });
    return net;
}

function calculateDelta(start, end) {
    const start_date = new Date(start);
    var end_date = 0;
    if (end) {
        end_date = new Date(end);
    } else {
        end_date = new Date();
    }
    const delta = (end_date - start_date) / 1000 / 60 / 60;
    // Round to 2 decimal places
    return delta.toFixed(2);
}

function idToName(id, conversion) {
    // Find the name of the user with the given id in the conversion array which has format { id, name }
    const user = conversion.find(user => user.id === id);
    return user.name;
}

var isMeeting = false;
var version;
var conversion;
var subRecord = [];
var queue = [];

var specifiedSubteam = "all";

var subt;

document.addEventListener("DOMContentLoaded", function (event) {
    var scrollpos = localStorage.getItem('scrollpos');
    if (scrollpos) window.scrollTo(0, scrollpos);
});

if (localStorage.getItem("alert") != null) {
    alertify.success(localStorage.getItem("alert"));
    localStorage.removeItem("alert");
}

window.onbeforeunload = function (e) {
    localStorage.setItem('scrollpos', window.scrollY);
};

const tDate = document.getElementById('tDate');
tDate.innerText = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
});


if (localStorage.getItem("subteam")) {
    document.getElementById('user-subteam').innerText = localStorage.getItem("subteam");
}

function personal() {
    localStorage.setItem("staffTransfer", "true");
    location.href = '/dash'
}

function isLoggedIn(user) {
    const record = user.record;
    if (record.length > 0) {
        const latestRecord = record[record.length - 1];
        if (latestRecord.end) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function generateProfilePicture(firstName) {
    const firstLetter = firstName.charAt(0).toUpperCase();
    const avatarSpan = document.createElement('span');
    avatarSpan.className = 'avatar avatar-sm';
    avatarSpan.textContent = firstLetter;
    document.getElementById('profile-picture').appendChild(avatarSpan);
}

function deepView(id) {
    // Create a js alert that shows all students that were signed in or out in this submission
    const submission = subRecord.find(submission => submission.id == id);
    const data = submission.data;
    let toDisplay = "";
    data.forEach((element) => {
        if (element.status == 1) {
            toDisplay += `${element.id} (IN)\n`;
        } else if (element.status == 2) {
            toDisplay += `${element.id} (OUT)\n`;
        }
    });
    alert(toDisplay);
}


async function setProfilePicture() {
    const pictureUrl = localStorage.getItem("picture");
    if (pictureUrl) {
        try {
            const pictureData = localStorage.getItem("pdata");
            if (pictureData) {
                // Use the cached picture data
                const avatarSpan = document.createElement('span');
                avatarSpan.className = 'avatar avatar-sm';
                avatarSpan.style.backgroundImage = `url(${pictureData})`;
                document.getElementById('profile-picture').appendChild(avatarSpan);
            } else {
                // Fetch from the URL and then cache it
                const response = await fetch(pictureUrl);
                const blob = await response.blob();
                const reader = new FileReader();
                reader.onload = function () {
                    localStorage.setItem("pdata", reader.result);
                    const avatarSpan = document.createElement('span');
                    avatarSpan.className = 'avatar avatar-sm';
                    avatarSpan.style.backgroundImage = `url(${reader.result})`;
                    document.getElementById('profile-picture').appendChild(avatarSpan);
                }
                reader.readAsDataURL(blob);
            }
        } catch (error) {
            console.error('Error setting profile picture:', error);
        }
    } else {
        // Generate a profile picture using the user's name
        generateProfilePicture(localStorage.getItem("name"));
    }
}

function radioType(id) {
    // Get last char of id and convert to int
    let i = parseInt(id.slice(-1));
    return (i);
}

var actionsSum = 0;

function copyEmail(email) {
    navigator.clipboard.writeText(email).then(function () {
        alertify.success('Email copied to clipboard');
    }, function (err) {
        console.error('Error copying email to clipboard:', err);
    });
}

var userData = [];
var hasVice = false;

function updateDocument(members, hasVice, showBadges = true) {

    // Remove all elements after "aHead" up until element with id "submit-btn"
    let element = document.getElementById('aHead');
    while (element.nextElementSibling.id != "submit-btn") {
        element.nextElementSibling.remove();
    }

    // Create a card for each subteam member. response is an array of user objects.
    // Insert HTML AFTER the element "aHead"
    let html = "";
    let i = 0;
    members.forEach((user) => {
        if (user.hidden == true) {
            return;
        }
        let status = "";
        let l = isLoggedIn(user);
        let inQueue = queue.find(u => u.id == user.id);
        let badge = "";
        if (user.id == localStorage.getItem("auth")) {
            status += "(You) ";
        }
        if (user.addendum == 1 && showBadges) {
            badge = `<div class="ribbon ribbon-top bg-red">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-crown" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
</svg>
                                </div>`;
        } else if (user.addendum == 2 && showBadges) {
            badge = `<div class="ribbon ribbon-top bg-blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-number-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M8 8a4 4 0 1 1 8 0c0 1.098 -.564 2.025 -1.159 2.815l-6.841 9.185h8" />
</svg>
                                </div>`;
        }
        if (l) {
            status += "<span class='badge bg-primary text-green-fg ms-2'>Present</span>";
        } else if (inQueue) {
            status += "<span class='badge bg-yellow text-green-fg ms-2'>In Queue</span>";
        }
        html += `
                <div class="col-md-6 col-lg-4">
                            <div class="card">
                                ${badge}
                               
                                <div class="card-body">
                                <h3 class="card-title">${user.name} ${status}</h3>
                                    <p class="card-subtitle"><a onclick="copyEmail('${user.id}')" href="#" style="color:gray;"><svg style="margin-right:4px;" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>
                                    ${user.id}</a></p>
                                    <p ${isMeeting ? "" : "style='margin-bottom:-6px;'"}>${user.hours} hours${localStorage.getItem("subteam") == "Management" ? " | " + user.subgroup.charAt(0).toUpperCase() + user.subgroup.slice(1) : ""}</p>
                                    <div ${isMeeting ? "" : "style='display:none;'"} class="btn-group w-100 userData" role="group" data-email="${user.id}">
                                        <input type="radio" class="btn-check" name="btg-${i}" id="btg-${i}-1"
                                            autocomplete="off" ${(user.localSelection == 1 || user.localSelection == null) ? "checked" : ""}>
                                        <label style="width:0;padding-left:0;padding-right:0;margin:0;flex:0.5 1 auto;" for="btg-${i}-1" type="button" class="btn"><svg
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-x" style="width:0;padding-left:0;padding-right:0;margin:0;">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg></label>
                                        <input type="radio" class="btn-check" name="btg-${i}" id="btg-${i}-2"
                                            autocomplete="off" ${l || inQueue ? "disabled" : ""} ${user.localSelection == 2 ? "checked" : ""}>
                                        <label for="btg-${i}-2" type="button" class="btn">Arriving</label>
                                        <input type="radio" class="btn-check" name="btg-${i}" id="btg-${i}-3"
                                            autocomplete="off" ${!(l || inQueue) ? "disabled" : ""} ${user.localSelection == 3 ? "checked" : ""}>
                                        <label for="btg-${i}-3" type="button" class="btn">Leaving</label>
                                    </div>
                                </div>
                            </div>
                        </div>`
        i++;
    });
    document.getElementById('aHead').insertAdjacentHTML('afterend', html);

    // Select all radio input elements
    const radioButtons = document.querySelectorAll('input[type="radio"]');

    // Iterate over the NodeList and attach an event listener to each radio button
    radioButtons.forEach(radioButton => {
        radioButton.addEventListener('change', function (event) {
            let r = radioType(event.target.id);
            if (r != 1) {
                actionsSum++;
            } else {
                actionsSum--;
            }
            if (actionsSum > 0 && isMeeting) {
                document.getElementById("submit-btn").style.display = "block";
            } else {
                document.getElementById("submit-btn").style.display = "none";
            }
            // Get the parent element attribute "data-email"
            let email = event.target.parentElement.getAttribute('data-email');
            // Find the user object with the matching email and add the action to their info
            let user = members.find(user => user.id === email);
            user.localSelection = r;
        });
    });
}

function orgHandler() {
    socket.emit("subteamMaster", localStorage.getItem("auth"), (response) => {
        // If response is not null
        if (response) {

            queue = response.queue;

            document.getElementById('main-title').style.display = "block";
            document.getElementById('roster-loader').style.display = "none";
            document.getElementById("search-bar").style.display = "flex";

            if (response.m) {
                document.getElementById('submit-warn').style.display = "none";
                document.getElementById('submit-success').style.display = "block";
                isMeeting = true;
                // If the meeting started less than 15 minutes ago, show grace period message
                if (new Date() - av3ToDateObject(response.next) < 15 * 60 * 1000) {
                    const meetingStartPlus15 = new Date(av3ToDateObject(response.next).getTime() + 15 * 60 * 1000);
                    document.getElementById('submit-grace').style.display = "block";
                    document.getElementById('submit-grace-text').innerHTML = "Grace period is active until " + timestampToTime(meetingStartPlus15) + ". Sign-ins will count as if submitted at " + av3ToTime(response.next) + ".";
                }
            } else {
                // If there is a meeting today and it starts within 30 minutes (response.next is the time):
                if (response.next && av3ToDateObject(response.next) - new Date() < 30 * 60 * 1000 && av3ToDateObject(response.next) - new Date() > 0) {
                    document.getElementById('submit-info').style.display = "block";
                    document.getElementById('submit-info-text').innerHTML = "A meeting is starting soon (" + av3ToTime(response.next) + "). You can sign people in early, but they won't earn hours until the meeting starts.";
                    isMeeting = true;
                } else {
                    if (response.next && response.next.enabled) {
                        if (av3ToDateObject(response.next) - new Date() < 0) {
                            document.getElementById('submit-warn').style.display = "block";
                            document.getElementById('submit-warn-text').innerHTML = "The meeting today has ended.";
                            isMeeting = false;
                        } else {
                            document.getElementById('submit-warn').style.display = "block";
                            document.getElementById('submit-warn-text').innerHTML = "Today's meeting begins at " + av3ToTime(response.next) + ".";
                            isMeeting = false;
                        }
                    } else {
                        document.getElementById('submit-warn-text').innerHTML = "There is no meeting today.";
                        document.getElementById('submit-warn').style.display = "block";
                        isMeeting = false;
                    }
                }
            }

            var tempAll = response.data;
            var leadShift = [];
            var generalShift = [];

            let activeUser = tempAll.find(user => user.id === localStorage.getItem("auth"));
            if (activeUser) {
                let index = tempAll.indexOf(activeUser);
                if (!activeUser.addendum) {
                    generalShift.push(activeUser);
                    tempAll.splice(index, 1);
                }
            }

            for (let i = 0; i < tempAll.length; i++) {
                if (tempAll[i].addendum == 2) {
                    leadShift.push(tempAll[i]);
                    tempAll.splice(i, 1);
                    i--; // Adjust index after removal
                } else if (tempAll[i].addendum == 1) {
                    leadShift.splice(0, 0, tempAll[i]);
                    tempAll.splice(i, 1);
                    i--; // Adjust index after removal
                }
            }

            userData = leadShift.concat(generalShift).concat(tempAll);

            updateDocument(userData, hasVice);

        } else {
            // Set the profile subteam to "Undeclared"
            document.getElementById('user-subteam').innerText = "Undeclared";
        }

        writeGeneralStats();
    });
}

function extractByQuery(query) {
    let data = [];
    if (specifiedSubteam == "all") {
        userData.forEach((e) => {
            if (e.name.toLowerCase().includes(query.toLowerCase())) {
                data.push(e);
            }
        });
    } else {
        userData.forEach((e) => {
            if (e.name.toLowerCase().includes(query.toLowerCase()) && e.subgroup == specifiedSubteam) {
                data.push(e);
            }
        });
    }
    updateDocument(data, hasVice);
}

(function () {
    var oldVal = "";
    var delayTimer;
    $("#userInput").on("input", function () {
        var val = this.value;

        if (
            val !== oldVal &&
            val.length >= 1
        ) {
            extractByQuery(val);

        } else {
            updateDocument(userData, hasVice);
        }
        oldVal = val;
    });
})();

function passSubmit() {
    let data = [];
    let i = 0;
    // document.querySelectorAll('.userData').forEach((e) => {
    //     let email = e.getAttribute('data-email');
    //     let status = 0;
    //     if (document.getElementById(`btg-${i}-2`).checked) {
    //         status = 1;
    //     } else if (document.getElementById(`btg-${i}-3`).checked) {
    //         status = 2;
    //     }
    //     data.push({ id: email, status: status });
    //     i++;
    // });
    userData.forEach((e) => {
        let status = 0;
        if (e.localSelection == 2) {
            status = 1;
        } else if (e.localSelection == 3) {
            status = 2;
        }
        data.push({ id: e.id, status: status });
    });
    socket.emit("massSubmit", localStorage.getItem("auth"), data, (response) => {
        if (response) {
            location.replace("/limbo");
        }
    });
}

function populateRecord() {
    document.getElementById("record-btn").innerHTML = "Loading...";
    document.getElementById("record-btn").disabled = true;
    socket.emit("getStaffRecord", localStorage.getItem("auth"), (response) => {
        const data = response.data;
        const record = document.getElementById("record");

        if (data.length == 0) {
            record.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No records found</td>
            </tr>
        `;
        } else {
            subRecord = data;
            var count = data.length + 1;
            record.innerHTML = "";
            var reversedRecord = data.reverse();
            // isLoggedIn = false;
            reversedRecord.forEach((element) => {
                count--;
                const tr = document.createElement("tr");
                tr.innerHTML = `
            <td class="sort-number"><span class="text-secondary">${numPad(count)}</span></td>
            <td class="sort-date" data-date="${element.time}">${timestampToDate(element.time)}</td>
            <td class="sort-issuer">${element.owner}</td>
            <td class="sort-net" data-net="${findNet(element) + 100000000}">${findNet(element)}</td>
            <td class="sort-status">${getStatus(element.status, element.end)}</td>
            <td style="padding-left:41px;cursor:pointer;"><button onclick="deepView(${element.id})" style="color:blue;border:none;background-color:transparent;outline:none;"><svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-external-link"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 6h-6a2 2 0 0 0 -2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-6" /><path d="M11 13l9 -9" /><path d="M15 4h5v5" /></svg></button></td>
        `;
                record.appendChild(tr);
            });

            const list = new List('table-default', {
                sortClass: 'table-sort',
                listClass: 'table-tbody',
                valueNames: ['sort-number', { attr: 'data-date', name: 'sort-date' }, 'sort-issuer', { attr: 'data-net', name: 'sort-net' }, 'sort-status'],
            });

        }
        document.getElementById("record-btn").style.display = "none";
        document.getElementById("record-body").style.display = "block";
    });
};



function main() {

    setProfilePicture();

    // If localstorage "name" is set
    if (localStorage.getItem("name")) {
        // Set the profile name to the value of localstorage "name"
        document.getElementById('user-name').textContent = localStorage.getItem("name");
    }

    // socket emit "getSubteam" with localstorage "auth" as the parameter
    socket.emit("getSubteam", localStorage.getItem("auth"), (response) => {
        // If response is not null
        if (response) {
            if (response.toLowerCase() == "management") {
                document.getElementById("subteamSearch").style.display = "block";
            }
            // Set the profile subteam to the value of response and capitalize the first letter
            let wu = response.charAt(0).toUpperCase() + response.slice(1)
            document.getElementById('user-subteam').innerText = wu;
            localStorage.setItem("subteam", wu);
            document.getElementById('stlabel').innerText = wu;
            subt = wu.toLowerCase();
        } else {
            // Set the profile subteam to "Undeclared"
            document.getElementById('user-subteam').innerText = "Undeclared";
        }
        // 2 second delay
        setTimeout(orgHandler, 1000);
    });

    const versionElement = document.getElementById("version");
    versionElement.innerHTML = "v" + version;

    // populateRecord();
}

function performChecks() {
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {

        if (!(response.status == "admin" || response.status == "networkAdmin")) {
            location.replace("/limbo")
        } else {
            if (response.status == "networkAdmin") {
                document.getElementById("admin").style.display = "block";
            }
            version = response.version;
            conversion = response.conversion;
            main();
        }
    });
}

performChecks();

function sendAlert() {
    socket.emit("sendAlert", localStorage.getItem("auth"), (response) => {
        if (response) {
            localStorage.setItem("alert", "Alert sent!");
            location.replace("/limbo");
        }
    });
}


/// STATS

function activeUsers(users) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let n = users.filter((user) =>
        user.record.some(
            (activity) =>
                new Date(activity.end) > thirtyDaysAgo &&
                new Date(activity.start) < new Date(activity.end) &&
                new Date(activity.end) - new Date(activity.start) >= 1 * 60 * 60 * 1000
        )
    ).length;

    return n == 0 ? "N/A" : n;
}

function retention(users) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activeUsers30DaysAgo = users.filter((user) =>
        user.record.some(
            (activity) =>
                new Date(activity.start) < thirtyDaysAgo &&
                new Date(activity.end) > thirtyDaysAgo &&
                new Date(activity.end) - new Date(activity.start) >= 6 * 60 * 60 * 1000
        )
    ).length;

    const currentActiveUsers = activeUsers(users);

    if (activeUsers30DaysAgo === 0) {
        return "N/A";
    }

    return (
        Math.round((currentActiveUsers / activeUsers30DaysAgo) * 10000) / 100 + "%"
    );
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

    const formattedDate = `${dayOfWeek} ${month}/${day}/${year} from ${hours}:${minutes} ${period} to ${hours2}:${minutes2} ${period2}`;

    return formattedDate;
}

const gty = (y) => {
    const currentYear = new Date().getFullYear() % 100;
    const graduationYear = parseInt(y, 10);
    const grade =
        currentYear >= graduationYear ? 12 : 13 - (graduationYear - currentYear);
    return Math.max(1, Math.min(12, grade));
};

var uData;

function writeGeneralStats() {
    let searchTerm;
    if (subt == 'management') {
        searchTerm = "#";
        document.getElementById("subteam-members").innerText = "Total Members";
        document.getElementById("subteam-hours").innerText = "Total Hours";
    } else {
        searchTerm = "subteam:" + subt;
    }
    socket.emit("findUsers", searchTerm, (response) => {
        if (response.status == "ok") {
            // document.getElementById("list").innerHTML = "";
            var tData = response.data;
            uData = tData.slice(); // Create a shallow copy to avoid modifying the original array
            uData.sort((a, b) => {
                const lastNameA = a.name.split(" ").pop(); // Extract last name of a
                const lastNameB = b.name.split(" ").pop(); // Extract last name of b
                return lastNameA.localeCompare(lastNameB); // Compare last names alphabetically
            });
            var numy = 1;

            // MASS DATA FIELDS

            document.getElementById("total_students").innerText = uData.length;
            document.getElementById("active_students").innerText = activeUsers(uData);
            document.getElementById("total_hours").innerText =
                Math.round(uData.reduce((acc, obj) => acc + obj.hours, 0) * 10) / 10;
            // document.getElementById("retention").innerText = "N/A"; //retention(uData);

        } else {
            alert("There was an error!");
        }
    });
}

function subteamChange() {
    const sts = document.getElementById("subteamSearch");
    const value = sts.value;
    // If the value is empty, show all users by calling updateDocument with the original userData
    if (value === "") {
        updateDocument(userData, hasVice);
        specifiedSubteam = "all";
        return;
    }
    if (value === "all") {
        updateDocument(userData, hasVice);
        specifiedSubteam = "all";
        return;
    }
    // Filter the userData array to only include users whose subgroup is equal to the value
    const filteredData = userData.filter(user => user.subgroup === value);
    specifiedSubteam = value;
    // Update the document with the filtered data
    updateDocument(filteredData, hasVice, false);
}