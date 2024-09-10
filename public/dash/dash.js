window.addEventListener('pageshow', function(event) {
    if (event.persisted) {} else {
        // This means the page was reloaded
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            window.location.replace('/router');
        }
    }
});
let referrer = document.referrer;
console.log(referrer);
if (referrer != 'http://localhost:8080/router/') {
    location.replace("/router");
}

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

    // socket emit "getSubteam" with localstorage "auth" as the parameter
    socket.emit("getSubteam", localStorage.getItem("auth"), (response) => {
        // If response is not null
        if (response) {
            // Set the profile subteam to the value of response and capitalize the first letter
            let wu = response.charAt(0).toUpperCase() + response.slice(1)
            document.getElementById('user-subteam').innerText = wu;
            localStorage.setItem("subteam", wu);
        } else {
            // Set the profile subteam to "Undeclared"
            document.getElementById('user-subteam').innerText = "Undeclared";
        }
    });
}

function performChecks() {
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {
        console.log(response.status);

        if (!(response.status == "user")) {
            location.replace("/router")
        } else {
            main();
        }
    });
}

performChecks();