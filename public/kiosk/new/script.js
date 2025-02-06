var socket = io();

var c_school = false;
var c_email = false;
var c_name_first = false;
var c_name_last = false;
var c_subteam = false;

var schoolId = -1;

var errorsEmail = [];

function performChecks() {
    socket.emit("dataRequest", localStorage.getItem("auth"), (response) => {

        if ((response.status !== "networkAdmin")) {
            location.replace("/limbo")
        }
    });
}

performChecks();

function checkSubmit() {
    var errorContainer = document.getElementById("errorContainer");
    if (c_school && c_email && c_name_first && c_name_last && c_subteam) {
        document.getElementById("submit").style.opacity = "1";
        errorContainer.innerHTML = "";
    } else {
        document.getElementById("submit").style.opacity = "0";
        errorContainer.innerHTML = "";
        for (var i = 0; i < errorsEmail.length; i++) {
            // Add to element "errorContainer"
            errorContainer.innerHTML += `
            <div class="alert alert-danger" role="alert">
                ${errorsEmail[i]}
            </div>`
        }
    }
}

document.querySelectorAll('input[name="btn-radio-basic"]').forEach(radio => {
    radio.addEventListener('change', function () {
        if (this.checked) {
            const selectedSchool = this.value;
            schoolId = selectedSchool;
            c_school = true;
            c_email = false;
            document.getElementById("email-title").innerHTML = (selectedSchool === "1") ? "Jesuit Email" : "Edison Email";
            document.getElementById("email-suffix").innerHTML = (selectedSchool === "1") ? "@jesuitmail.org" : "@edisonhs.org";
            document.getElementById("email-form").style.display = "block";
            document.getElementById("email-input").value = "";
            document.getElementById("name-form").style.display = "block";
            document.getElementById("subteam-form").style.display = "block";
        }
        checkSubmit();
    });
});

document.getElementById('email-input').addEventListener('input', function (e) {
    e.target.value = e.target.value.toLowerCase();
    // Ignore special characters like !, #, $, %, etc. and spaces
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9@.]/g, "");
    const emailValue = e.target.value;
    const nums = emailValue.match(/\d+/g);
    var num;
    if (nums) {
        num = nums[0];
    }
    if (emailValue.length > 1) {
        document.getElementById("name-last").value = emailValue[1].toUpperCase() + (emailValue.split(num ? num : "@")[0].substring(2)).toLowerCase();
        c_name_last = true;
    }

    var numValid = false;
    const currentYear = new Date().getFullYear();
    if (num) {
        var compNum = num;
        if (schoolId == 1) {
            compNum = "20" + num;
        }
        if (compNum >= currentYear && compNum <= currentYear + 4) {
            numValid = true;
        }
    }

    errorsEmail = [];
    var internalCheck = true;

    if (!num) {
        internalCheck = false;
        errorsEmail.push("No year found in email");
    } else if (num && !(num.toString().length == (schoolId == 1 ? 2 : 4))) {
        internalCheck = false;
        errorsEmail.push("Invalid year format found in email");
    } else if (num && !numValid) {
        internalCheck = false;
        errorsEmail.push("Invalid year found in email");
    }
    if (emailValue.includes("@")) {
        internalCheck = false;
        errorsEmail.push("Do not include your email suffix (" + (schoolId == 1 ? "@jesuitmail.org" : "@edisonhs.org") + ")");
    }
    if (num && emailValue.split(num)[1] != "") {
        internalCheck = false;
        errorsEmail.push("Invalid characters found after year in email");
    }

    c_email = internalCheck;

    checkSubmit();
});

document.getElementById('name-first').addEventListener('input', function (e) {
    // Replace spaces with dashes
    e.target.value = e.target.value.replace(/\s/g, "-");
    // Make first letter and all letters after a dash uppercase, and all other letters lowercase
    e.target.value = e.target.value.replace(/-./g, (x) => x.toUpperCase());
    // Make first letter uppercase
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    c_name_first = e.target.value.length > 0;
    checkSubmit();
});

document.getElementById('name-last').addEventListener('input', function (e) {
    // Replace spaces with dashes
    e.target.value = e.target.value.replace(/\s/g, "-");
    // Make first letter and all letters after a dash uppercase, and all other letters lowercase
    e.target.value = e.target.value.replace(/-./g, (x) => x.toUpperCase());
    // Make first letter uppercase
    e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    c_name_last = e.target.value.length > 0;
    checkSubmit();
});

document.getElementById('subteam-input').addEventListener('input', function (e) {
    // Dropdown
    c_subteam = e.target.value.length > 0;
    checkSubmit();
});

function submitForm() {
    var email = document.getElementById("email-input").value + (schoolId == 1 ? "@jesuitmail.org" : "@edisonhs.org");
    var name = document.getElementById("name-first").value + " " + document.getElementById("name-last").value;
    var subteam = document.getElementById("subteam-input").value;

    if (schoolId == -1) {
        return;
    }

    socket.emit("createUser", email, name, subteam, (response) => {
        if (response.status == "ok" && response.data == true) {
            location.replace("/kiosk/new/processing");
        } else {
            alert("A problem occurred. ERR: 455 - " + response.data);
        }
    });
}