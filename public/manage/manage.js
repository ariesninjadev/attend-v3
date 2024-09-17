window.addEventListener('pageshow', function (event) {
    if (event.persisted) { } else {
        // This means the page was reloaded
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            window.location.replace('/router');
        }
    }
});
let referrer = document.referrer;
if (!referrer.includes("router")) {
    location.replace("/router");
}

var isMeeting = false;

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

/*
User objects contain this structure:
record: {
            type: [
                {
                    start: { type: Date, required: true },
                    end: { type: Date, required: false },
                },
            ],
            required: false,
        },
so lets make a function that checks if a user is logged in by checking if the user's latest record only has a start time and no end time
*/
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
                console.log("FETCHED PHOTO");
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

function radioDidSelectAction(id) {
    // Get last char of id and convert to int
    let i = parseInt(id.slice(-1));
    return (i != 1);
}

var actionsSum = 0;

function copyEmail(email) {
    navigator.clipboard.writeText(email).then(function () {
        alertify.success('Email copied to clipboard');
    }, function (err) {
        console.error('Error copying email to clipboard:', err);
    });
}

function orgHandler() {
    socket.emit("stm", localStorage.getItem("auth"), (response) => {
        // If response is not null
        if (response) {

            console.log(response.data);

            if (response.m) {
                document.getElementById('submit-warn').style.display = "none";
                isMeeting = true;
            }

            // Create a card for each subteam member. response is an array of user objects.
            // Insert HTML AFTER the element "aHead"
            let html = "";
            let i = 0;
            response.data.forEach((user) => {
                let status = "";
                let l = isLoggedIn(user);
                let badge = "";
                if (user.id == localStorage.getItem("auth")) {
                    status += "(You) ";
                }
                if (i == 0) {
                    badge = `<div class="ribbon ribbon-top bg-red">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-crown" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 6l4 6l5 -4l-2 10h-14l-2 -10l5 4z" />
</svg>
                                </div>`;
                } else if (i == 1) {
                    badge = `<div class="ribbon ribbon-top bg-blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-number-2" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M8 8a4 4 0 1 1 8 0c0 1.098 -.564 2.025 -1.159 2.815l-6.841 9.185h8" />
</svg>
                                </div>`;
                }
                if (l) {
                    status += "<span class='badge bg-primary text-green-fg ms-2'>Present</span>";
                }
                html += `
                <div class="col-md-6 col-lg-4">
                            <div class="card">
                                ${badge}
                               
                                <div class="card-body">
                                <h3 class="card-title">${user.name} ${status}</h3>
                                    <p class="card-subtitle"><a onclick="copyEmail('${user.id}')" href="#" style="color:gray;"><svg style="margin-right:4px;" xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clipboard"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /></svg>
                                    ${user.id}</a></p>
                                    <div class="btn-group w-100 userData" role="group" data-email="${user.id}">
                                        <input type="radio" class="btn-check" name="btg-${i}" id="btg-${i}-1"
                                            autocomplete="off" checked>
                                        <label for="btg-${i}-1" type="button" class="btn"><svg
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M18 6l-12 12" />
                                                <path d="M6 6l12 12" />
                                            </svg></label>
                                        <input type="radio" class="btn-check" name="btg-${i}" id="btg-${i}-2"
                                            autocomplete="off" ${l ? "disabled" : ""}>
                                        <label for="btg-${i}-2" type="button" class="btn">Arriving</label>
                                        <input type="radio" class="btn-check" name="btg-${i}" id="btg-${i}-3"
                                            autocomplete="off" ${!l ? "disabled" : ""}>
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
                    // console.log('Radio button selected:', event.target.id);
                    if (radioDidSelectAction(event.target.id)) {
                        actionsSum++;
                    } else {
                        actionsSum--;
                    }
                    if (actionsSum > 0 && isMeeting) {
                        document.getElementById('submit-btn').disabled = false;
                    } else {
                        document.getElementById('submit-btn').disabled = true;
                    }
                });
            });

        } else {
            // Set the profile subteam to "Undeclared"
            document.getElementById('user-subteam').innerText = "Undeclared";
        }
    });
}

function passSubmit() {
    let data = [];
    let i = 0;
    document.querySelectorAll('.userData').forEach((e) => {
        let email = e.getAttribute('data-email');
        let status = 0;
        if (document.getElementById(`btg-${i}-2`).checked) {
            status = 1;
        } else if (document.getElementById(`btg-${i}-3`).checked) {
            status = 2;
        }
        data.push({ id: email, status: status });
        i++;
    });
    socket.emit("massSubmit", localStorage.getItem("auth"), data, (response) => {
        if (response) {
            location.replace("/router");
        }
    });
}

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
            // Set the profile subteam to the value of response and capitalize the first letter
            let wu = response.charAt(0).toUpperCase() + response.slice(1)
            document.getElementById('user-subteam').innerText = wu;
            localStorage.setItem("subteam", wu);
        } else {
            // Set the profile subteam to "Undeclared"
            document.getElementById('user-subteam').innerText = "Undeclared";
        }
        orgHandler();
    });
}

function performChecks() {
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {
        console.log(response.status);

        if (!(response.status == "admin" || response.status == "networkAdmin")) {
            location.replace("/router")
        } else {
            main();
        }
    });
}

performChecks();

function sendAlert() {
    socket.emit("sendAlert", localStorage.getItem("auth"), (response) => {
        if (response) {
            localStorage.setItem("alert", "Alert sent!");
            location.replace("/router");
        }
    });
}