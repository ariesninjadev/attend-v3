/// ----------------------------- ///
//       IMPORTANT STATICS        //
/// ----------------------------- ///

const version = "2.9.20";

const popupVersion = "10";

const network = [];

const network_admins = [
    "apowvalla26@jesuitmail.org",
    "whitenj@gmail.com",
    "pwhite@jesuitportland.org",
    "pwhite@jesuitmail.org",
];

process.env.TZ = "America/Los_Angeles";

const register_as_offline = false;

/// ----------------------------- ///

try {
    var express = require("express");
    var app = express();
    var server = require("http").Server(app);
    const path = require("path");
    const db = require("./server/dbm.js");
    const mail = require("./server/mail.js");

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "public"));
    app.use(express.static(__dirname + "/public"));

    app.get("/", function (req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });

    /// --- SCHEDCRON BY ARIES POWVALLA --- ///

    var eternalData;
    var meetingActive = false;
    var logoutApplied = false;

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

        meetingActive =
            eternalData[currentDay].enabled &&
            isMeetingInProgress(
                now,
                eternalData[currentDay].start,
                eternalData[currentDay].duration
            );

        if (meetingActive) {
            logoutApplied = false;
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

    setInterval(schedcron, 10000);

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

    /// ----------------------------------- ///

    app.get("*", function (req, res) {
        res.status(404).sendFile(__dirname + "/public/404/index.html");
    });

    server.listen(8080, () => console.log("0.0.0.0:8080"));

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
                    return false;
                }
                db.registerUser(email, name, gradYear, popupVersion, subgroup).then((data) => {
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

        socket.on("dataRequest", (email, callback) => {
            try {
                if (network_admins.includes(email)) {
                    callback({
                        status: "networkAdmin",
                    });
                    return false;
                }
                if (register_as_offline) {
                    // Hang for 2 seconds to simulate offline mode then callback offline
                    setTimeout(() => {
                        callback({
                            status: "offline",
                        });
                    }, 2000);
                    return false;
                }
                if (email == null) {
                    callback({
                        status: "guest",
                    });
                    return false;
                }
                db.isAdmin(email)
                    .then((data) => {
                        if (data) {
                            callback({
                                status: "admin",
                            });
                        } else {
                            db.retrieve(email)
                            .then((data) => {
                                if (!data) {
                                    callback({
                                        status: "nonuser",
                                    });
                                    return false;
                                }
                                callback({
                                    status: "user",
                                });
                            })
                            .catch((err) => {
                                callback({
                                    status: "error",
                                    data: err,
                                });
                            });
                        }
                    })
                    .catch((err) => {
                        callback({
                            status: "error",
                            data: err,
                        });
                    });
                // db.retrieve(email)
                //     .then((data) => {
                //         callback({
                //             status: "user",
                //             data: data,
                //             m: meetingActive,
                //             mdata_local: fetchToday(),
                //         });
                //     })
                //     .catch((err) => {
                //         callback({
                //             status: "error",
                //             data: err,
                //         });
                //     });
            } catch (err) {
                callback({
                    status: "error",
                    data: err,
                });
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

        socket.on("stm", (email, callback) => {
            try {
                db.subteamMaster(email)
                    .then((data) => {
                        callback({data,m:meetingActive});
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
                db.postTime(email, finalTime, true)
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
                db.postTime(email, Date.now(), false)
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

        socket.on("fetchUpdates", (id, callback) => {
            try {
                db.getLatest(id, popupVersion)
                    .then((data) => {
                        if (!data || isLastBehindCurrent(data, popupVersion)) {
                            callback({
                                status: "update"
                            });
                        } else {
                            callback({
                                status: "ok",
                            });
                        }
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
                        var reasonText = "receive extra hours because of a bug or issue";
                    } else if (data.type == "2") {
                        if (data.desc1 == "in") {
                            var reasonText = "receive extra hours because you forgot to log in";
                        } else {
                            var reasonText = "have your hours corrected because you forgot to log out";
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

        // END OF SOCKET //
    });
} catch (error) {
    console.error("Server encountered an error: ", error);
}
