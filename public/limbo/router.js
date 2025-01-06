var socket = io();

// If localstorage "tablerTheme" is "dark", then set the theme to dark
if (localStorage.getItem("tablerTheme") == "dark") {
    document.body.classList.add('theme-dark');
}

// Do a pulse effect on the logo
document.querySelector('.a').style.transform = 'translate(-50%, -50%) scale(1.1)';
setTimeout(() => {
    document.querySelector('.a').style.transform = 'translate(-50%, -50%) scale(1)';
}, 500);
const intID = setInterval(() => {
    document.querySelector('.a').style.transform = 'translate(-50%, -50%) scale(1.1)';
    setTimeout(() => {
        document.querySelector('.a').style.transform = 'translate(-50%, -50%) scale(1)';
    }, 500);
}, 1000);

function isEmpty(obj) {
    for (const prop in obj) {
        if (Object.hasOwn(obj, prop)) {
            return false;
        }
    }
    return true;
}

function syserror(msg) {
    document.getElementById("syserror").innerHTML = msg;
    document.getElementById("syserror").style.opacity = "0";
    document.getElementById("syserror").style.display = "block";
    setTimeout(() => {
        document.getElementById("syserror").style.opacity = "1";
    }, 100);
    // Apply grayscale to image with class "logo"
    var logo = document.getElementsByClassName("logo");
    for (var i = 0; i < logo.length; i++) {
        logo[i].style.filter = "grayscale(100%)";
    }
    clearInterval(intID);
    document.querySelector('.a').classList.remove('a');
}

function performChecks() {

    // Get the URL parameter "intent". If it is "lock", then don't redirect or perform any checks.
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("intent")) {
        if (urlParams.get("intent") == "lock") {
            syserror("You have been sent to limbo. You can reconnect in 2 minutes.");
            // Get the time from the URL parameter "time" otherwise default to 2 minutes
            const lockTime = urlParams.has("time") ? urlParams.get("time") : 2;
            // Add a cookie with a lifespan of x minutes and a cookie with the user-friendly time in 2 minutes.
            document.cookie = "limbo=true; max-age=" + 60*lockTime + "; path=/"; // This cookie is available for the entire site
            document.cookie = "limboTime=" + new Date(new Date().getTime() + 60000 * lockTime).toLocaleTimeString() + "; max-age=120; path=/"; // This cookie is available for the entire site
            // Sign out the user
            localStorage.removeItem("auth");
            // Remove the "intent" parameter from the URL
            location.replace("/limbo");
            return false;
        }
    }


    // If the cookie "limbo" exists, then display an error
    if (document.cookie.includes("limbo=true")) {
        // Get the time from the cookie
        const x = document.cookie.split("limboTime=")[1].split(";")[0];
        syserror(`You have been sent to limbo. You can reconnect at ${x}.`);
        return false;
    }

    if (!localStorage.getItem("auth")) {
        location.replace("/login");
        return false;
    }
    // If the email isnt an email from the org @jesuitmail.org, then display an error
    if (!(localStorage.getItem("auth").includes("@jesuitmail.org") || localStorage.getItem("auth").includes("@edisonhs.org"))) {
        syserror("You must use a Jesuit email to access the Robotics attendance utility. Reload the page to sign out.");
        // Sign out
        localStorage.removeItem("auth");
        localStorage.removeItem("name");
        return false;
    }
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {
        console.log(response.status);

        // ---- SOFT LOCK ---- //

        // if (localStorage.getItem("auth") != "apowvalla26@jesuitmail.org") {
        //     syserror("The robotics attendance utility isn't in use yet. It will open on September 17th.");
        //     return false;
        // }

        if (response.status == "guest") {
            localStorage.removeItem("auth");
            localStorage.removeItem("name");
            location.replace("/login");
        } else if (response.status == "nonuser") {
            syserror("It looks like you haven't registered for Robotics yet. Please contact Coach White.");
        } else if (response.status == "user") {
            location.replace("/dash");
        } else if (response.status == "admin") {
            syserror("Attendance tracking will begin on Thursday, September 18th.");
            location.replace("/manage");
        } else if (response.status == "networkAdmin") {
            if (localStorage.getItem("auth") == "apowvalla26@jesuitmail.org") {
                location.replace("/manage");
                return false;
            }
            location.replace("/admin");
        } else if (response.status == "offline") {
            console.log("offline!");
            syserror("The system appears to be offline. Please try again later.");
        } else {
            syserror("Critical Error ID 0x0009. Please report this to Aries (apowvalla26@jesuitmail.org).");
        }
    });
}

setTimeout(() => {
    performChecks();
}, 1000);