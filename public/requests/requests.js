var socket = io();

function hideAllExceptFirst() {
    const formElements = [
        'control-typeSelect',
        'control-inOutSelect',
        'control-descibeIssue',
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

// Call the function to hide all form elements except the first one
hideAllExceptFirst();

if (!localStorage.getItem("auth")) {
    location.replace("/")
}

function submitRequest() {

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
    if (selectedValue == "other") {
        document.getElementById("control-whatDateIF").style.display = "block";
        document.getElementById("control-descibeIssue").style.display = "block";
    } else {
    }
});