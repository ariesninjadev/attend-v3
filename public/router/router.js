var socket = io();

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

if (
    !location.host == "2374-a.com"
) {
    const url = `https://${location.host}`;
    location.replace(url);
}

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
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {
        console.log(response.status);
        if (response.status == "guest") {
            localStorage.removeItem("auth");
            localStorage.removeItem("name");
            location.replace("/login");
        } else if (response.status == "nonuser") {
            location.replace("https://team2374.org/");
        } else if (response.status == "user") {
            location.replace("/dash");
        } else if ((response.status == "admin")) {
            location.replace("/manage");
        } else if ((response.status == "offline")) {
            console.log("offline!");
            syserror("The system appears to be offline. Please try again later.");
        } else {
            syserror("Critical Error ID 0x0009. Please report this to Aries (apowvalla26@jesuitmail.org).");
        }
    });
}

performChecks();