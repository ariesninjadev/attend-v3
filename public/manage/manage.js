window.addEventListener('pageshow', function (event) {
    if (event.persisted) { } else {
        // This means the page was reloaded
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            window.location.replace('/router');
        }
    }
});
let referrer = document.referrer;
console.log(referrer);
if (!referrer.includes("router")) {
    location.replace("/router");
}

document.addEventListener("DOMContentLoaded", function (event) {
    var scrollpos = localStorage.getItem('scrollpos');
    if (scrollpos) window.scrollTo(0, scrollpos);
});

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

function orgHandler() {
    socket.emit("stm", localStorage.getItem("auth"), (response) => {
        // If response is not null
        if (response) {
            // Create a card for each subteam member. response is an array of user objects.
            // Insert HTML AFTER the element "aHead"
            let html = "";
            let i = 0;
            response.forEach((user) => {
                let status = "";
                let l = isLoggedIn(user);
                if (i==0) {
                    status += "(You) ";
                }
                if (l) {
                    status += "<span class='badge bg-primary text-green-fg ms-2'>Present</span>";
                }
                html += `
                <div class="col-md-6 col-lg-4">
                            <div class="card">
                                <div class="card-header">
                                    <h3 class="card-title">${user.name} ${status}</h3>
                                </div>
                                <div class="card-body">
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
            document.getElementById('self-name').innerText = localStorage.getItem("name");
            document.getElementById('self-email').setAttribute('data-email', localStorage.getItem("auth"));

        } else {
            // Set the profile subteam to "Undeclared"
            document.getElementById('user-subteam').innerText = "Undeclared";
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