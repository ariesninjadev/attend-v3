var socket = io();

if (
    !location.host == "2374.team"
) {
    const url = `https://${location.host}`;
    location.replace(url);
}

if (!localStorage.getItem("auth")) {
    location.replace("/")
}

var observe;
if (window.attachEvent) {
    observe = function (element, event, handler) {
        element.attachEvent('on' + event, handler);
    };
}
else {
    observe = function (element, event, handler) {
        element.addEventListener(event, handler, false);
    };
}
function init() {
    var issue_1_1 = document.getElementById('issue-1-1');
    function resize() {
        const csc = window.scrollY;
        issue_1_1.style.height = 'auto';
        issue_1_1.style.height = issue_1_1.scrollHeight + 'px';
        window.scrollTo(0, csc);
    }
    function delayedResize() {
        window.setTimeout(resize, 0);
    }

    observe(issue_1_1, 'change', resize);
    observe(issue_1_1, 'cut', delayedResize);
    observe(issue_1_1, 'paste', delayedResize);
    observe(issue_1_1, 'drop', delayedResize);
    observe(issue_1_1, 'keydown', delayedResize);

    issue_1_1.focus();
    issue_1_1.select();

    resize();
}

init();

function update() {
    var choice = document.getElementById("request-type").value;
    document.getElementById("1").style.display = "none";
    document.getElementById("2").style.display = "none";
    document.getElementById("3").style.display = "none";
    document.getElementById("4").style.display = "none";

    document.getElementById(choice).style.display = "block";
}

function updateSignType() {
    var choice = document.getElementById("signtypea").value;
    document.getElementById("issue-2-2").style.display = "block";
    document.getElementById("issue-2-3").style.display = "inline-block";
    document.getElementById("issue-2-4").style.display = "inline-block";
    if (choice == "in") {
        document.getElementById("typedesc").innerText = "What day did you forget to sign in?"
        document.getElementById("typedesc2").innerText = "What time did you arrive?"
        document.getElementById("typedesc3").innerText = "What time did you leave?"
        document.getElementById("issue-2b-2").style.display = "block";
        document.getElementById("issue-2c-2").style.display = "block";
    } else if (choice == "out") {
        document.getElementById("typedesc").innerText = "What day did you forget to sign out?"
        document.getElementById("typedesc2").innerText = ""
        document.getElementById("typedesc3").innerText = "What time did you leave?"
        document.getElementById("issue-2b-2").style.display = "none";
        document.getElementById("issue-2c-2").style.display = "block";
    }
}

function submitRequest() {
    uemail = localStorage.getItem("auth");
    uname = localStorage.getItem("name");
    utype = document.getElementById("request-type").value;
    udesc = "";
    udesc2 = "";
    udesc3 = "";
    udesc4 = "";
    if (utype == "1") {
        udesc = document.getElementById("issue-1-1").value;
        udesc2 = document.getElementById("issue-1-2").value;
    } else if (utype == "2") {
        udesc = document.getElementById("signtypea").value;
        udesc2 = document.getElementById("issue-2-2").value;
        udesc3 = document.getElementById("issue-2b-2").value;
        udesc4 = document.getElementById("issue-2c-2").value;
    } else if (utype == "3") {
        udesc = document.getElementById("issue-3-1").value;
        udesc2 = document.getElementById("issue-3-2").value;
        udesc3 = document.getElementById("issue-3-3").value;
    }
    socket.emit("submitRequest", uemail, uname, utype, udesc, udesc2, udesc3, udesc4, (response) => {
        if (response.status == "success") {
            alert("Request submitted successfully!");
            window.location.href = "/";
        } else {
            alert("An error occurred while submitting your request. Please try again later.");
            console.log(response);
        }
    });
}

update();