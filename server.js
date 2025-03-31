/// ----------------------------- ///
//       IMPORTANT STATICS        //
/// ----------------------------- ///

const version = "3.10.0";

/// ----------------------------- ///

var varsity_letter_hours;

var popupUID;
var popupMessage;
var popupEnabled = false;

process.env.TZ = "America/Los_Angeles";

var register_as_offline = false;

var special_events = [];

var network_admins = [];

console.clear();

console.log(`

     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    ░░░░░█████╗░████████╗████████╗███████╗███╗░░██╗██████╗░░░░██╗░░░██╗██████╗░░░░░
    ░░░░██╔══██╗╚══██╔══╝╚══██╔══╝██╔════╝████╗░██║██╔══██╗░░░██║░░░██║╚════██╗░░░░
    ░░░░███████║░░░██║░░░░░░██║░░░█████╗░░██╔██╗██║██║░░██║░░░╚██╗░██╔╝░█████╔╝░░░░
    ░░░░██╔══██║░░░██║░░░░░░██║░░░██╔══╝░░██║╚████║██║░░██║░░░░╚████╔╝░░╚═══██╗░░░░
    ░░░░██║░░██║░░░██║░░░░░░██║░░░███████╗██║░╚███║██████╔╝░░░░░╚██╔╝░░██████╔╝░░░░
    ░░░░╚═╝░░╚═╝░░░╚═╝░░░░░░╚═╝░░░╚══════╝╚═╝░░╚══╝╚═════╝░░░░░░░╚═╝░░░╚═════╝░░░░░
     ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
         Made by: Aries Powvalla                                Version: ${version}
`);

try {
    var express = require("express");
    var app = express();
    var server = require("http").Server(app);
    const path = require("path");
    const db = require("./server/dbm.js");
    const mail = require("./server/mail.js");
    const stat = require("./server/statAdder.js");

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "public"));
    app.use(express.static(__dirname + "/public"));

    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });

    /// --- SCHEDULE CRON JOB --- ///

    var eternalData;
    var meetingActive = false;
    var logoutApplied = false;

    var queuedSubmissions = [];
    var queuedStudents = [];

    function av3ToDateObject(av3) {
        // Format: { start: { hour: int, minute, int } }
        // To: Date object (with day as today)
        console.log(av3);
        const date = new Date();
        date.setHours(av3.hour);
        date.setMinutes(av3.minute);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    }

    function fetchToday() {
        let now = new Date();
        let currentDay = now
            .toLocaleString("en-US", { weekday: "short" })
            .toLowerCase();
        return eternalData[currentDay];
    }

    function schedcron() {
        const now = new Date();
        const currentDay = now
            .toLocaleString("en-US", { weekday: "short" })
            .toLowerCase();

        // Grab the schedule data
        db.sch_pull()
            .then((data) => {
                eternalData = data;
            })
            .catch((err) => {
                console.error(err);
                return false;
            });

        meetingActive =
            eternalData[currentDay].enabled &&
            isMeetingInProgress(
                now,
                eternalData[currentDay].start,
                eternalData[currentDay].duration
            );

        if (meetingActive) {
            logoutApplied = false;
            // If there are queued submissions, process them.
            if (queuedSubmissions.length > 0) {
                const todaySchedule = fetchToday();
                const meetingStartTime = av3ToDateObject(todaySchedule.start);
                queuedSubmissions.forEach((submission) => {
                    db.massSubmit(submission.email, submission.users, true, meetingStartTime)
                        .then((data) => {
                            console.log(data);
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                });
                queuedSubmissions = [];
                queuedStudents = [];

            }
        } else {
            if (!logoutApplied) {
                logoutApplied = true;
                db.signOutAllUsers(Date.now());
            }
        }
    }

    function isMeetingInProgress(currentTime, startTime, duration) {
        const startDateTime = new Date(currentTime);
        startDateTime.setHours(startTime.hour, startTime.minute, 0, 0);

        const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

        return currentTime >= startDateTime && currentTime <= endDateTime;
    }

    function isLastBehindCurrent(last, current) {

        // Legacy version support; always outdated so force update
        if (typeof last === 'string' || last instanceof String) {
            return true;
        }

        if (last < current) {
            return true;
        }

        return false;

    }

    function updateConfigs() {
        db.getConfig()
            .then((data) => {
                varsity_letter_hours = data.varsity_letter_hours;
                popupUID = data.alert.uid;
                popupMessage = data.alert.message;
                popupEnabled = data.alert.enabled;
                process.env.TZ = data.timezone;
                register_as_offline = data.offline;
                special_events = data.special_events;
                network_admins = data.network_admins;
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    }

    // Grab the schedule data
    try {
        db.sch_pull()
            .then((data) => {
                eternalData = data;
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    } catch (err) {
        console.error(err);
        return false;
    }

    // Load the config data
    try {
        db.getConfig()
            .then((data) => {
                if (!data || data == null) {
                    return db.createConfig();
                }
            })
            .then(() => {
                return db.getConfig();
            })
            .then((data) => {
                varsity_letter_hours = data.varsity_letter_hours;
                popupUID = data.alert.uid;
                popupMessage = data.alert.message;
                popupEnabled = data.alert.enabled;
                process.env.TZ = data.timezone;
                register_as_offline = data.offline;
                special_events = data.special_events;
                network_admins = data.network_admins;
                console.log("Config data loaded.");
            })
            .catch((err) => {
                console.error(err);
                return false;
            });
    } catch (err) {
        console.error(err);
        return false;
    }

    setInterval(schedcron, 10000);
    setInterval(updateConfigs, 20000);

    function convertTimeBToDate(timeB, dateA) {
        return new Date(
            dateA.getFullYear(),
            dateA.getMonth(),
            dateA.getDate(),
            timeB.hour,
            timeB.minute
        );
    }

    function isw30(timeA, timeB) {
        const dateA = new Date(timeA);
        const dateB = convertTimeBToDate(timeB, dateA);
        return Math.abs(dateA - dateB) <= 900000;
    }

    // // Single run code: load all users preseason hours
    // db.loadAllPreSeasonHours(stat);


    app.get("*", function (req, res) {
        res.status(404).sendFile(__dirname + "/public/404/index.html");
    });

    server.listen(8080, () => console.log("Websocket Operational."));

    var io = require("socket.io")(server);
    io.sockets.on("connection", function (socket) {

        socket.on("createUser", (email, name, subgroup, callback) => {
            try {
                const match = email.match(/\d+/);
                var gradYear = 0;

                if (match) {
                    gradYear = match[0];
                } else {
                    console.log("No graduation year found in the email");
                    gradYear = 0;
                }
                db.registerUser(email, name, gradYear, "0", subgroup).then((data) => {
                    callback({
                        status: "ok",
                        data: data,
                    });
                });
            } catch (err) {
                console.log(err);
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("dataRequest", async (email, callback) => {
            try {
                let status;
                let data;
                let doAlert;

                if (network_admins.includes(email)) {
                    status = "networkAdmin";
                } else if (register_as_offline) {
                    setTimeout(() => {
                        callback({ status: "offline" });
                    }, 2000);
                    return;
                } else if (email == null) {
                    callback({ status: "guest" });
                    return;
                } else if (await db.isAdmin(email)) {
                    status = "admin";
                } else {
                    status = "user";
                }

                data = await db.retrieve(email);

                if (!data && status != "admin" && status != "networkAdmin") {
                    callback({ status: "nonuser" });
                    return;
                }

                doAlert = await db.checkAlertState(email, popupUID);

                let enabled = (popupEnabled && doAlert);

                callback({
                    status: status,
                    data: data,
                    conversion: db.getConversionCache(),
                    varsity: varsity_letter_hours,
                    version: version,
                    alert: {
                        uid: popupUID,
                        message: popupMessage,
                        enabled: enabled,
                    },
                    special_events: special_events,
                });
            } catch (err) {
                console.error(err);
                callback({ status: "error", data: err });
            }
        });

        socket.on("updateAlertState", (email) => {
            try {
                db.updateAlertState(email, popupUID)
                    .then((data) => {
                    })
                    .catch((err) => {
                    });
            } catch (err) {
                console.error(err);
            }
        });

        socket.on("scheduleRequest", (callback) => {
            try {
                db.sch_pull()
                    .then((data) => {
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("getSubteam", (email, callback) => {
            try {
                db.getSubteam(email)
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("subteamMaster", (email, callback) => {
            try {
                db.subteamMaster(email)
                    .then((data) => {
                        callback({ data, m: meetingActive, next: fetchToday(), queue: queuedStudents });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("massSubmit", (email, users, callback) => {
            try {
                var doUseMeetingStart = false;
                const now = new Date();
                const todaySchedule = fetchToday();
                const meetingStartTime = av3ToDateObject(todaySchedule.start);
                const graceTimeMs = 15 * 60 * 1000;
                if (now - meetingStartTime <= graceTimeMs) {
                    doUseMeetingStart = true;
                }
                // If a submission was sent before the meeting start time, add it to the queue instead
                if (now - meetingStartTime <= 0) {
                    queuedSubmissions.push({ email, users });
                    // Users with status != 0
                    var actionableUsers = users.filter((user) => { return user.status != 0; });
                    // Remove any users that are already in the queue from the queue before re-adding them (as they may have been updated)
                    queuedStudents = queuedStudents.filter((item) => {
                        return !actionableUsers.some((user) => {
                            return user.id === item.id;
                        });
                    });
                    queuedStudents = queuedStudents.concat(actionableUsers);
                    // If the user's status is 2, remove them from the queue
                    queuedStudents = queuedStudents.filter((user) => {
                        return user.status != 2;
                    });
                    console.log(queuedStudents);
                    callback({
                        status: "queued",
                    });
                    return;
                }
                db.massSubmit(email, users, doUseMeetingStart, meetingStartTime)
                    .then((data) => {
                        callback({
                            status: data,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        callback({
                            status: "errorix",
                            data: err,
                        });
                    });
            } catch (err) {
                console.error(err);
                callback({
                    status: "errorim",
                    data: err,
                });
            }
        });

        socket.on("sendAlert", (email, callback) => {
            try {
                db.sendAlert(email)
                    .then((data) => {
                        mail.sendAAlert(data.email, data.name)
                            .then((data) => {
                                callback({
                                    status: data,
                                });
                            })
                            .catch((err) => {
                                callback({
                                    status: "error",
                                    data: err,
                                });
                                console.error(err);
                            });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("findUsers", (content, callback) => {
            try {
                db.findUsersViaSearch(content)
                    .then((data) => {
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("findRequests", (callback) => {
            try {
                db.fetchAllRequests()
                    .then((data) => {
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("signIn", (email, callback) => {
            try {
                if (!meetingActive) {
                    callback({
                        status: "nomeeting",
                    });
                    return false;
                }
                const date = new Date();
                const options = { timeZone: "America/Los_Angeles" };
                var pstDateString = date.toLocaleString("en-US", options);
                const now = new Date();
                const currentDay = now
                    .toLocaleString("en-US", { weekday: "short" })
                    .toLowerCase();
                var tb = eternalData[currentDay].start;
                //console.log(pstDateString)
                //console.log(tb)
                //console.log(isw30(pstDateString,tb))
                if (isw30(pstDateString, tb)) {
                    pstDateString = convertTimeBToDate(tb, new Date()).toLocaleString(
                        "en-US",
                        options
                    );
                }
                var dateObject = new Date(pstDateString);
                var finalTime = dateObject.getTime();
                db.postTime(email, finalTime, true, "None")
                    .then((r) => {
                        callback({
                            status: r[0],
                            data: r[1],
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                console.log(err);
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("signOut", (email, callback) => {
            try {
                if (!meetingActive) {
                    callback({
                        status: "nomeeting",
                    });
                    return false;
                }
                db.postTime(email, Date.now(), false, "None")
                    .then((r) => {
                        callback({
                            status: r[0],
                            data: r[1],
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("disableDay", (day, callback) => {
            try {
                db.disableDay(day)
                    .then((data) => {
                        eternalData = data;
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("enableDay", (day, hrs, mins, duration, callback) => {
            try {
                db.enableDay(day, hrs, mins, duration)
                    .then((data) => {
                        eternalData = data;
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("clearAll", (callback) => {
            try {
                db.removeAllRecords()
                    .then((data) => {
                        callback({
                            status: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("clearOne", (u, callback) => {
            try {
                db.removeRecordById(u)
                    .then((data) => {
                        callback({
                            status: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("removeOne", (u, callback) => {
            try {
                db.deleteRecordById(u)
                    .then((data) => {
                        callback({
                            status: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("hourEdit", (ref, index, start, end, callback) => {
            try {
                db.hourEdit(ref, index, start, end)
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("hourRemove", (ref, index, callback) => {
            try {
                db.hourRemove(ref, index)
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("hourAdd", (ref, start, end, callback) => {
            try {
                db.hourAdd(ref, start, end)
                    .then((data) => {
                        callback(data);
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        // socket.on("fetchUpdates", (id, callback) => {
        //     try {
        //         db.fetchAlertAndJump(id, popupUID)
        //             .then((data) => {
        //                 if (popupEnabled && data) {
        //                     callback({
        //                         status: "update"
        //                     });
        //                 } else {
        //                     callback({
        //                         status: "ok",
        //                     });
        //                 }
        //             })
        //             .catch((err) => {
        //                 callback({
        //                     status: "error",
        //                     data: err,
        //                 });
        //             });
        //     } catch (err) {
        //         callback({
        //             status: "error",
        //             data: err,
        //         });
        //     }
        // });

        socket.on("submitRequest", (uemail, uname, utype, udesc, udesc2, udesc3, udesc4, callback) => {
            try {
                db.postRequest(uemail, uname, utype, udesc, udesc2, udesc3, udesc4)
                    .then((data) => {
                        callback({ status: data });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                        console.log(err);
                    });
            } catch (err) {
                callback({
                    status: "error-global",
                    data: err,
                });
                console.log(err);
            }
        });

        socket.on("sendConfirmation", (uemail, uname, ureason, ustatus, udata, callback) => {
            try {
                mail.sendConfirmation(uemail, uname, ureason, ustatus, udata)
                    .then((data) => {
                        callback({ status: data });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                        console.error(err);
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("submitRequestResponse", (id, feedback, status, hours, missingDesc, callback) => {
            try {
                db.updateRequest(id, feedback, status);

                if (status == "true") {
                    statusText = "accepted";
                } else if (status == "false") {
                    statusText = "rejected";
                } else {
                    statusText = "DONOTSEND";
                }

                db.retrieveRequestSingle(id).then((data) => {

                    if (missingDesc == "true") {
                        db.flagMissingDesc(data.email);
                    }

                    if (data.type == "1") {
                        var reasonText = "receive extra hours because of a bug or issue you encountered";
                    } else if (data.type == "2") {
                        if (data.desc1 == "in") {
                            var reasonText = "receive extra hours because you were not signed in";
                        } else {
                            var reasonText = "have your hours corrected because you were not signed out";
                        }
                    } else if (data.type == "3") {
                        var reasonText = "receive extra hours because you stayed late to a meeting";
                    }

                    mail.sendConfirmation(
                        data.email,
                        data.name.split(' ').slice(0, -1).join(' '),
                        reasonText,
                        statusText,
                        data.desc2,
                        hours,
                        feedback,
                        id
                    )
                        .then((data) => {
                            callback({ status: data });
                        })
                        .catch((err) => {
                            callback({
                                status: "error",
                                data: err,
                            });
                            console.error(err);
                        });

                }).catch((err) => {
                    console.error(err);
                    return false;
                });


            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("getLoggedInPerSubteam", (callback) => {
            try {
                db.getLoggedInPerSubteam()
                    .then((data) => {
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("getStaffRecord", (email, callback) => {
            try {
                db.getStaffRecord(email)
                    .then((data) => {
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        socket.on("setVisibility", (email, callback) => {
            try {
                db.setVisibility(email)
                    .then((data) => {
                        callback({
                            status: "ok",
                            data: data,
                        });
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
            }
        });

        // END OF SOCKET //

    });

    console.log("Logging disabled as production mode is enabled.");

} catch (error) {
    console.error("Server encountered an error: ", error);
}
