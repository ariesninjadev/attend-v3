var socket = io();

let refobj;
let uData;


if (
    localStorage.getItem("auth") == "apowvalla26@jesuitmail.org" ||
    localStorage.getItem("auth") == "whitenj@gmail.com" ||
    localStorage.getItem("auth") == "pwhite@jesuitmail.org"
) {
    document.getElementById("overlay").remove();
} else {
    window.location.replace("/");
}

function valve() {
    socket.emit("findRequests", (response) => {
        if (response.status == "ok") {
            document.getElementById("cards").innerHTML = "";

            uData = response.data;
            if (uData.rq.length == 0) {
                document.getElementById("cards").innerHTML = "<h3>No requests.</h3>";
            }
            uData.rq.forEach((s) => {

                if (s.type == "1") {
                    var type = "Bug/Issue";
                    var data = `Description: ${s.desc1}<br>Date: ${s.desc2}`;
                } else if (s.type == "2") {
                    var type = "Forgot to log";
                    if (s.desc1 == "in") {
                        var data = `In/Out: ${s.desc1}<br>Date: ${s.desc2}<br>Time In: ${s.desc3}<br>Time Out: ${s.desc4}`;
                    } else {
                        var data = `In/Out: ${s.desc1}<br>Date: ${s.desc2}<br>Time Out: ${s.desc4}`;
                    }
                } else if (s.type == "3") {
                    var type = "Stayed Late";
                    var data = `Description: ${s.desc1}<br>Date: ${s.desc2}<br>Time Out: ${s.desc3}`;
                }

                var noDesc = 0;

                // Loop through the user array to find the user object with matching email
                for (var i = 0; i < uData.user.length; i++) {
                    if (uData.user[i].id === s.email) {
                        noDesc = uData.user[i].noDesc;
                        break; // Stop the loop once found
                    }
                }

                noDesc = (noDesc == undefined) ? "0" : noDesc;

                document.getElementById("cards").innerHTML += `
                    <div class="card" id="${s.id}">
                        <h2>${s.name}</h2>
                        <p>${s.email}</p>
                        <p>Type: ${type}</p>
                        <p>${data}</p>

                        <p>Warns: ${noDesc}</p>

                        <button class='p-button signon-button' onclick="editText('${s.id}',0)">No Desc</button>
                        <button class='p-button signon-button' onclick="editText('${s.id}',1)">Last Warn</button>
                        <button class='p-button signon-button' onclick="editText('${s.id}',2)">Reject No Info</button>
                        <select style="width:40%;" name="reqstatus" id="nd-${s.id}">
                            <option value="false">Valid</option>
                            <option value="true">No Desc</option>
                        </select>

                        <textarea class="ra-ta" placeholder="Feedback" id="fb-${s.id}"></textarea>

                        <input placeholder="Hours" style="width:20%;" type="text" id="hc-${s.id}">
                        <select style="width:40%;" name="reqstatus" id="rs-${s.id}">
                            <option value="true">Accept</option>
                            <option value="false">Reject</option>
                            <option value="close">Close Silently</option>
                        </select>
                        <button class='p-button signon-button' onclick="submit('${s.id}')">Submit</button>
                    </div>
                `;
            });
        } else {
            alertify.error("There was an error!");
        }
    });
}

valve();

function editText(id, type) {
    if (type == 0) {
        document.getElementById("fb-"+id).value = "Note from reviewer: Going forward, please provide a description of what you did after the meeting time ended. This will help us to better understand the situation and make a more informed decision.";
        document.getElementById("rs-"+id).value = "true";
        document.getElementById("nd-"+id).value = "true";
    } else if (type == 1) {
        document.getElementById("fb-"+id).value = "Note from reviewer: This is your second time not properly describing what you did after the meeting ended. Next time, please provide a description of what you did after the meeting time ended. This will help us to better understand the situation and make a more informed decision. Further violations will result in your request being rejected.";
        document.getElementById("rs-"+id).value = "true";
        document.getElementById("nd-"+id).value = "true";
    } else if (type == 2) {
        document.getElementById("fb-"+id).value = "Note from reviewer: Rejected due to lack of information. Please provide a description of what you did after the meeting time ended. This will help us to better understand the situation and make a more informed decision.";
        document.getElementById("rs-"+id).value = "false";
        document.getElementById("nd-"+id).value = "true";
    }
}

function submit(id) {
    var fb = document.getElementById(`fb-${id}`).value;
    var rs = document.getElementById(`rs-${id}`).value;
    var hc = document.getElementById(`hc-${id}`).value;
    var missingDesc = document.getElementById(`nd-${id}`).value;
    socket.emit("submitRequestResponse", id, fb, rs, hc, missingDesc, (response) => {
        if (response.status == "success") {
            alertify.success("Feedback submitted!");
            valve();
        } else {
            alertify.error("There was an error!");
        }
    });
}