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
var varsity_letter_hours;
var version;

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

    const versionElement = document.getElementById("version");
    versionElement.innerHTML = "v" + version;

}

function performChecks() {
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {

        if ((response.status === "nonuser" || response.status === "guest")) {
            location.replace("/limbo")
        } else {
            data = response.data;
            conversion = response.conversion;
            varsity_letter_hours = response.varsity;
            version = response.version;
            main();
        }
    });
}

performChecks();