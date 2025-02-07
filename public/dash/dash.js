
// Record related getters

var isLoggedIn = false;
var signedInTime = 0;

var firstLoadDone = false;

function getStatus(status, end, start) {
    if (!end) {
        isLoggedIn = true;
        signedInTime = timestampToTime(start);
        return `<span class="badge bg-yellow me-1"></span> Present`;
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

function removeDateFromTimestamp(timestamp) {
    // Format: 2024-09-09T15:15:00.000Z
    // To: 2000-01-01T15:15:00.000Z
    const date = new Date(timestamp);
    date.setFullYear(2000);
    date.setMonth(0);
    date.setDate(1);
    return date.toISOString();
}

function numPad(num) {
    return num.toString().padStart(4, '0');
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

function readAlert() {
    // Broadcast to server
    socket.emit("updateAlertState", localStorage.getItem("auth"));
}

/////////////////////////

if (localStorage.getItem("subteam")) {
    document.getElementById('user-subteam').innerText = localStorage.getItem("subteam");
}

function generateProfilePicture(firstName) {
    const firstLetter = firstName.charAt(0).toUpperCase();
    const avatarSpan = document.createElement('span');
    avatarSpan.className = 'avatar avatar-sm';
    avatarSpan.textContent = firstLetter;
    document.getElementById('profile-picture').innerHTML = "";
    document.getElementById('profile-picture').appendChild(avatarSpan);
}

generateProfilePicture(localStorage.getItem("name"));

// If localstorage "name" is set
if (localStorage.getItem("name")) {
    // Set the profile name to the value of localstorage "name"
    document.getElementById('user-name').textContent = localStorage.getItem("name");
}

var data;
var conversion;
var varsity_letter_hours;
var version;
var alertData;


function main() {
    if (!data.hours) {
        location.replace("/limbo");
    }
    // If localstorage "picture" is set
    if (localStorage.getItem("picture")) {
        // Set the profile picture to the value of localstorage "picture"
        const avatarSpan = document.createElement('span');
        avatarSpan.className = 'avatar avatar-sm';
        avatarSpan.style.backgroundImage = `url(${localStorage.getItem("picture")})`;
        document.getElementById('profile-picture').innerHTML = "";
        document.getElementById('profile-picture').appendChild(avatarSpan);
    }

    if (data.subgroup) {
        // Set the profile subteam to the value of response and capitalize the first letter
        let wu = data.subgroup.charAt(0).toUpperCase() + data.subgroup.slice(1)
        document.getElementById('user-subteam').innerText = wu;
        localStorage.setItem("subteam", wu);
    } else {
        // Set the profile subteam to "Undeclared"
        document.getElementById('user-subteam').innerText = "Undeclared";
    }

    const hours = document.getElementById("hours");
    hours.innerHTML = data.hours.toFixed(2);

    const preseasonhours = document.getElementById("pre-hours");
    // find period = preseason-2025 in data.oldHours
    const preseason = data.oldHours.find(period => period.period === "preseason-2025");
    if (preseason) {
        preseasonhours.innerHTML = preseason.hours.toFixed(0);
    } else {
        preseasonhours.innerHTML = "0";
    }

    const vars = document.getElementById("varsity");
    vars.innerHTML = varsity_letter_hours + "<span style='font-size:0.8em;vertical-align:top;' class='text-secondary'>*</span>";

    const elig = document.getElementById("eligibility");
    if (data.hours >= varsity_letter_hours) {
        elig.innerHTML = "Eligible";
        elig.style.color = "green";
    } else {
        elig.innerHTML = "Ineligible";
        elig.style.color = "red";
    }

    const banner = document.getElementById("clocked-in");
    if (isLoggedIn) {
        // Unhide
        document.getElementById("clocked-in-text").innerHTML = `You are present: Clocked in at ${signedInTime}`;
        banner.style.display = "block";
    } else {
        // Hide
        banner.style.display = "none";
    }

    if (!firstLoadDone) {
        firstLoadDone = true;

        const record = document.getElementById("record");

        if (data.record.length == 0) {
            record.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No records found</td>
            </tr>
        `;
        } else {

            var count = data.record.length + 1;
            record.innerHTML = "";
            var reversedRecord = data.record.reverse();
            isLoggedIn = false;
            reversedRecord.forEach((element) => {
                count--;
                const tr = document.createElement("tr");
                tr.innerHTML = `
            <td class="sort-number"><span class="text-secondary">${numPad(count)}</span></td>
            <td class="sort-date" data-date="${element.start}">${timestampToDate(element.start)}</td>
            <td class="sort-issuer">${idToName(element.issuer, conversion)}</td>
            <td class="sort-in" data-date="${removeDateFromTimestamp(element.start)}">${timestampToTime(element.start)}</td>
            <td class="sort-out" data-date="${removeDateFromTimestamp(element.end)}">${timestampToTime(element.end)}</td>
            <td class="sort-hours">${calculateDelta(element.start, element.end)}</td>
            <td class="sort-status">${getStatus(element.status, element.end, element.start)}</td>
        `;
                record.appendChild(tr);
            });

            const list = new List('table-default', {
                sortClass: 'table-sort',
                listClass: 'table-tbody',
                valueNames: ['sort-number', { attr: 'data-date', name: 'sort-date' }, 'sort-issuer', { attr: 'data-date', name: 'sort-in' }, { attr: 'data-date', name: 'sort-out' }, 'sort-hours', 'sort-status']
            });

        }

        const versionElement = document.getElementById("version");
        versionElement.innerHTML = "v" + version;

        const alertText = document.getElementById("alert-body");
        alertText.innerHTML = alert.message;

        if (alertData.enabled) {
            var myModal = new bootstrap.Modal(document.getElementById('modal-simple'));
            myModal.show();
        }

        const banner = document.getElementById("clocked-in");
        if (isLoggedIn) {
            // Unhide
            document.getElementById("clocked-in-text").innerHTML = `You are present: Clocked in at ${signedInTime}`;
            banner.style.display = "block";
        } else {
            // Hide
            banner.style.display = "none";
        }
    }

}

function performChecks() {

    if (!localStorage.getItem("auth")) {
        location.replace("/login");
        return false;
    }

    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {

        if ((response.status === "nonuser" || response.status === "guest")) {
            location.replace("/limbo")
        } else {
            data = response.data;
            conversion = response.conversion;
            varsity_letter_hours = response.varsity;
            version = response.version;
            alertData = response.alert;
            main();
        }
    });
}

performChecks();

function refresh() {
    // Reload all data without refreshing the page
    performChecks();
}

// Refresh every 5 seconds (debug)
setInterval(refresh, 5000);

if (localStorage.getItem("staffTransfer") == "true") {
    document.getElementById("staff-transfer").style.display = "block";
}