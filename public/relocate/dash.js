// Record related getters

function getStatus(status) {
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
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
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
    const end_date = new Date(end);
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
    document.getElementById('profile-picture').appendChild(avatarSpan);
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
        document.getElementById('profile-picture').appendChild(avatarSpan);
    } else {
        // Generate a profile picture using the user's name
        generateProfilePicture(localStorage.getItem("name"));
    }

    // If localstorage "name" is set
    if (localStorage.getItem("name")) {
        // Set the profile name to the value of localstorage "name"
        document.getElementById('user-name').textContent = localStorage.getItem("name");
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

}

function performChecks() {
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {

        if (!(response.status == "user")) {
            location.replace("/limbo")
        } else {
            data = response.data;
            conversion = response.conversion;
            main();
        }
    });
}

performChecks();