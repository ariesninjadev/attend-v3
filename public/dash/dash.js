// Record related getters

var isLoggedIn = false;

function getStatus(status, end) {
    if (!end) {
        isLoggedIn = true;
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

function main() {
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
            <td class="sort-date">${timestampToDate(element.start)}</td>
            <td class="sort-issuer">${idToName(element.issuer, conversion)}</td>
            <td class="sort-in">${timestampToTime(element.start)}</td>
            <td class="sort-out">${timestampToTime(element.end)}</td>
            <td class="sort-hours">${calculateDelta(element.start, element.end)}</td>
            <td class="sort-status">${getStatus(element.status, element.end)}</td>
        `;
            record.appendChild(tr);
        });

        const list = new List('table-default', {
            sortClass: 'table-sort',
            listClass: 'table-tbody',
            valueNames: ['sort-number', { attr: 'data-date', name: 'sort-date' }, 'sort-issuer', { attr: 'data-in', name: 'sort-in' }, { attr: 'data-out', name: 'sort-out' }, 'sort-hours', 'sort-status']
        });

    }

    const hours = document.getElementById("hours");
    hours.innerHTML = data.hours.toFixed(2);

    const banner = document.getElementById("clocked-in");
    if (isLoggedIn) {
        // Unhide
        banner.style.display = "block";
    } else {
        // Hide
        banner.style.display = "none";
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