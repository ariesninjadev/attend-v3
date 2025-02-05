var socket = io();

function hideAllExceptFirst() {
    const formElements = [
        'control-typeSelect',
        'control-inOutSelect',
        'control-describeIssue',
        'control-whatDid',
        'control-whatDateIF',
        'control-whatDateREG',
        'control-timeIn',
        'control-timeOut',
        'control-submit'
    ];

    formElements.forEach((id, index) => {
        const element = document.getElementById(id);
        if (element && index !== 0) {
            element.style.display = 'none';
        }
    });
}

var uemail = localStorage.getItem("auth");
var uname = localStorage.getItem("name");
var utype = "";
var udesc = "";
var udesc2 = "";
var udesc3 = "";
var udesc4 = "";

// Call the function to hide all form elements except the first one
hideAllExceptFirst();

if (!localStorage.getItem("auth")) {
    location.replace("/")
}

function submitForm() {

    if (document.getElementById("typeSelect").value == "other") {
        utype = "1";
        udesc = document.getElementById("describeIssue").value;
        udesc2 = document.getElementById("whatDateIF").value;
    } else if (document.getElementById("typeSelect").value == "forgot") {
        utype = "2";
        udesc = document.getElementById("inOutSelect").value;
        udesc2 = document.getElementById("whatDateREG").value;
        udesc3 = document.getElementById("timeIn").value;
        udesc4 = document.getElementById("timeOut").value;
    } else if (document.getElementById("typeSelect").value == "late") {
        utype = "3";
        udesc = document.getElementById("whatDid").value;
        udesc2 = document.getElementById("whatDateREG").value;
        udesc3 = document.getElementById("timeOut").value;
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

// Listen for a dropdown change of element with id "control-typeSelect"
document.getElementById("typeSelect").addEventListener("change", function() {
    var selectedValue = this.value;
    console.log(selectedValue);
    hideAllExceptFirst();
    document.getElementById("control-submit").style.display = "block";
    if (selectedValue == "other") {
        document.getElementById("control-whatDateIF").style.display = "block";
        document.getElementById("control-describeIssue").style.display = "block";
    } else if (selectedValue == "look") {
        document.getElementById("control-whatDateIF").style.display = "block";
        document.getElementById("control-describeIssue").style.display = "block";
    } else if (selectedValue == "forgot") {
        document.getElementById("control-inOutSelect").style.display = "block";
    } else if (selectedValue == "late") {
        document.getElementById("control-whatDid").style.display = "block";
        document.getElementById("control-whatDateREG").style.display = "block";
        document.getElementById("control-timeOut").style.display = "block";
    }
});

// Listen for a dropdown change of element with id "control-inOutSelect"
document.getElementById("inOutSelect").addEventListener("change", function() {
    var selectedValue = this.value;
    console.log(selectedValue);
    hideAllExceptFirst();
    document.getElementById("control-inOutSelect").style.display = "block";
    document.getElementById("control-submit").style.display = "block";
    if (selectedValue == "in") {
        document.getElementById("control-whatDateREG").style.display = "block";
        document.getElementById("control-timeIn").style.display = "block";
        document.getElementById("control-timeOut").style.display = "block";
    } else if (selectedValue == "out") {
        document.getElementById("control-whatDateREG").style.display = "block";
        document.getElementById("control-timeOut").style.display = "block";
    }
});

// Every 100ms, check all VISIBLE form elements for their values and store them. If all visible form elements have values, enable the submit button.
setInterval(() => {
    var typeSelect = document.getElementById("typeSelect").value;
    var inOutSelect = document.getElementById("inOutSelect").value;
    var describeIssue = document.getElementById("describeIssue").value;
    var whatDid = document.getElementById("whatDid").value;
    var whatDateIF = document.getElementById("whatDateIF").value;
    var whatDateREG = document.getElementById("whatDateREG").value;
    var timeIn = document.getElementById("timeIn").value;
    var timeOut = document.getElementById("timeOut").value;

    if (typeSelect == "other") {
        if (describeIssue && whatDateIF) {
            document.getElementById("submit").disabled = false;
        } else {
            document.getElementById("submit").disabled = true;
        }
    } else if (typeSelect == "look") {
        if (describeIssue && whatDateIF) {
            document.getElementById("submit").disabled = false;
        } else {
            document.getElementById("submit").disabled = true;
        }
    } else if (typeSelect == "forgot") {
        if (inOutSelect && whatDateREG && timeIn && timeOut) {
            document.getElementById("submit").disabled = false;
        } else {
            document.getElementById("submit").disabled = true;
        }
    } else if (typeSelect == "late") {
        if (whatDid && whatDateREG && timeOut) {
            document.getElementById("submit").disabled = false;
        } else {
            document.getElementById("submit").disabled = true;
        }
    }
}, 100);