const mongoose = require("mongoose");

mongoose.set("strictQuery", true);
mongoose.connect(
    "mongodb+srv://admin:ariesmongo123@ariesdb.cbmjd5h.mongodb.net/2374-attendance"
);

function checkAndInsert(record, newStartTime, newEndTime) {
    // A: Verify that the pair provided doesn't overlap with ANY of the existing pairs in the array
    const overlaps = record.some(
        ({ start, end }) =>
            (newStartTime >= start.$date && newStartTime < end.$date) ||
            (newEndTime > start.$date && newEndTime <= end.$date) ||
            (newStartTime <= start.$date && newEndTime >= end.$date)
    );

    // B: Verify that if the last item in the existing array does NOT contain an end value,
    // the given pair should NOT be AFTER the start value.
    const lastItem = record[record.length - 1];
    const lastItemHasEnd = lastItem && lastItem.end && lastItem.end;
    const newPairShouldBeInserted =
        lastItemHasEnd || newStartTime < new Date(lastItem.start);

    // C: If these checks pass, determine a spot to place the new pair in the array.
    let insertIndex = record.length;

    if (!overlaps && newPairShouldBeInserted) {
        for (let i = 0; i < record.length; i++) {
            const { start } = record[i];
            if (newStartTime < new Date(start)) {
                insertIndex = i;
                break;
            }
        }
    } else {
        if (overlaps) {
            return -1;
        } else {
            return -2;
        }
    }

    return insertIndex;
}

function calculateTotalHours(timeArray) {
    let totalHours = 0;

    timeArray.forEach((item) => {
        const startTime = item.start.getTime();
        const endTime = item.end.getTime();
        const durationInMilliseconds = endTime - startTime;
        const durationInHours = durationInMilliseconds / (1000 * 60 * 60);
        totalHours += durationInHours;
    });
    totalHours = Math.round((totalHours + Number.EPSILON) * 1000) / 1000;
    return totalHours;
}

const userSchema = new mongoose.Schema(
    {
        /// DOC WARN: STUDENT NAMES CANNOT BE STORED ON MONGO. ID IS MAPPED TO CONST TABLE ON SERVER.
        id: { type: String, required: true },
        name: { type: String, required: true },
        grad: { type: Number, required: true },
        hours: { type: Number, required: true },
        addendum: { type: Number, required: true },
        latest: { type: Number, required: false },
        noDesc: { type: Number, required: false },
        certs: { type: [String], required: false },
        record: {
            type: [
                {
                    start: { type: Date, required: true },
                    end: { type: Date, required: false },
                },
            ],
            required: false,
        },
        subgroup: { type: String, required: false },
    },
    { collection: "students" }
);

const scheduleSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        sun: {
            start: {
                hour: { type: Number, required: false },
                minute: { type: Number, required: false },
            },
            duration: { type: Number, required: true },
            enabled: { type: Boolean, required: true },
        },
        mon: {
            start: {
                hour: { type: Number, required: false },
                minute: { type: Number, required: false },
            },
            duration: { type: Number, required: true },
            enabled: { type: Boolean, required: true },
        },
        tue: {
            start: {
                hour: { type: Number, required: false },
                minute: { type: Number, required: false },
            },
            duration: { type: Number, required: true },
            enabled: { type: Boolean, required: true },
        },
        wed: {
            start: {
                hour: { type: Number, required: false },
                minute: { type: Number, required: false },
            },
            duration: { type: Number, required: true },
            enabled: { type: Boolean, required: true },
        },
        thu: {
            start: {
                hour: { type: Number, required: false },
                minute: { type: Number, required: false },
            },
            duration: { type: Number, required: true },
            enabled: { type: Boolean, required: true },
        },
        fri: {
            start: {
                hour: { type: Number, required: false },
                minute: { type: Number, required: false },
            },
            duration: { type: Number, required: true },
            enabled: { type: Boolean, required: true },
        },
        sat: {
            start: {
                hour: { type: Number, required: false },
                minute: { type: Number, required: false },
            },
            duration: { type: Number, required: true },
            enabled: { type: Boolean, required: true },
        },
        overrides: {
            type: [
                {
                    start: { type: Date, required: false },
                    duration: { type: Number, required: false },
                },
            ],
            required: false,
        },
    },
    { collection: "schedule" }
);

const requestSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        status: { type: Number, required: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: Number, required: true },
        desc1: { type: String, required: false },
        desc2: { type: String, required: false },
        desc3: { type: String, required: false },
        desc4: { type: String, required: false },
    },
    { collection: "requests" }
);

const subgroupsSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        owner: { type: String, required: true },
        vice: { type: String, required: true },
        desc: { type: String, required: true },
    },
    { collection: "subgroups" }
);

const submissionsSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        owner: { type: String, required: true },
        type: { type: String, required: true },
        time: { type: Date, required: true },
        adminNotes: { type: String, required: true },
        data: {
            type: [
                {
                    time: { type: Date, required: true },
                    in: { type: Boolean, required: true },
                    id: { type: String, required: true },
                },
            ],
            required: true,
        }
    },
    { collection: "submissions" }
);

const User = mongoose.model("students", userSchema);
const Sched = mongoose.model("schedule", scheduleSchema);
const Request = mongoose.model("requests", requestSchema);
const Subgroups = mongoose.model("subgroups", subgroupsSchema);
const Submissions = mongoose.model("submissions", submissionsSchema);

async function registerUser(id, name, grade, v, subgroup) {
    const newUser = new User({
        id: id,
        grad: grade,
        hours: 0,
        addendum: 0,
        noDesc: 0,
        certs: [],
        record: [],
        name: name,
        latest: v,
        subgroup: subgroup,
    });

    newUser.save();
    return true;
}

// User requesting a modification to their time record
async function postRequest(uemail, uname, utype, udesc1, udesc2, udesc3, udesc4) {
    x = Date.now() + "0" + Math.floor((Math.random() * 1000));
    const newRequest = new Request({
        id: x,
        status: 0,
        email: uemail,
        name: uname,
        type: utype,
        desc1: udesc1,
        desc2: udesc2,
        desc3: udesc3,
        desc4: udesc4
    });

    newRequest.save();
    return "success";
}

async function updateRequest(id, fb, rs) {
    if (rs) {
        fstat = 1;
    } else if (rs == "close") {
        fstat = -2;
    } else {
        fstat = -1;
    }
    try {
        const result = await Request.updateOne(
            { id: id },
            {
                $set: {
                    status: fstat,
                },
            }
        );
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function postData(id, key, val) {
    try {
        const result = await User.updateOne(
            { "account.verification.id": id },
            {
                $set: {
                    [key]: val,
                },
            }
        );

        return result;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function createSubgroup(id, owner, vice, desc) {
    try {
        const newSubgroup = new Subgroups({
            id: id,
            owner: owner,
            vice: vice,
            desc: desc,
        });
        newSubgroup.save();
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

//createSubgroup("marketing", "gwerts26@jesuitmail.org", "cvanzan26@jesuitmail.org", "This team promotes the robotics team through branding, community engagement, and outreach efforts, fostering relationships and attracting support.");

// Create a new submission. A submission is when a subteam leader submits their subteams' attendance data.
async function createSubmission(id, owner, type, time, adminNotes, data) {
    try {
        // Create a new submission document
        const newSubmission = new Submissions({
            id: id,
            owner: owner,
            type: type,
            time: time,
            adminNotes: adminNotes,
            data: data,
        });
        newSubmission.save();
        // Post a time record for each user in the data array
        for (let i = 0; i < data.length; i++) {
            const user = await User.findOne({ id: data[i].id });
            const insertIndex = checkAndInsert(user.record, new Date(data[i].time), new Date(data[i].time));
            if (insertIndex >= 0) {
                user.record.splice(insertIndex, 0, {
                    start: new Date(data[i].time),
                    end: new Date(data[i].time),
                });
            }
            user.hours = calculateTotalHours(user.record);
            await user.save();
        }
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function isLoggedIn(arr) {
    if (arr === undefined || arr.length == 0) {
        return false;
    }
    return arr[arr.length - 1].end === undefined;
}

async function signOutAllUsers(time) {
    console.log("Clocking off all users...");
    try {
        const allUsers = await User.find();
        for (user of allUsers) {
            if (isLoggedIn(user.record) == "false") {
                continue;
            }

            const result = await User.updateOne(
                { id: user.id },
                {
                    $set: {
                        "record.$[elem].end": time,
                    },
                },
                {
                    arrayFilters: [{ "elem.end": { $exists: false } }],
                }
            );

            const latest = await User.findOne({ id: user.id });
            const result2 = await User.updateOne(
                { id: user.id },
                {
                    $set: {
                        hours: calculateTotalHours(latest.record),
                    },
                }
            );
        }
        console.log("Success.");
        return true;
    } catch (err) {
        console.error(err);
    }
}

async function postTime(id, time, type) {
    // TYPE: true = start, false = end
    //console.log(time);
    try {
        const thisuser = await User.findOne({ id: id });
        var latest;

        if (isLoggedIn(thisuser.record) == type) {
            return "badstate";
        }

        if (type) {
            const result = await User.updateOne(
                { id: id },
                {
                    $push: {
                        record: { start: time },
                    },
                }
            );

            latest = await User.findOne({ id: id });
        } else {
            const result = await User.updateOne(
                { id: id },
                {
                    $set: {
                        "record.$[elem].end": time,
                    },
                },
                {
                    arrayFilters: [{ "elem.end": { $exists: false } }],
                }
            );

            latest = await User.findOne({ id: id });
            const result2 = await User.updateOne(
                { id: id },
                {
                    $set: {
                        hours: calculateTotalHours(latest.record),
                    },
                }
            );
        }
        //console.log("L: "+latest)
        return ["success", latest];
    } catch (err) {
        console.error(err);
        return err;
    }
}

async function retrieve(id) {
    try {
        const result = await User.findOne({ id: id });
        if (!result) return false;
        return result;
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Check if the user id is an admin by checking if they are marked as such in the subgroups collection
async function isAdmin(id) {
    try {
        const result = await Subgroups.findOne({ owner: id });
        if (!result) return false;
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

function isNumeric(str) {
    if (typeof str != "string") return false
    return !isNaN(str) && !isNaN(parseFloat(str))
}

async function findUsersViaSearch(search) {
    try {
        var results;
        if (search === "#") {
            results = await User.find({});
        } else if (Array.from(search)[0] === "^") {
            if (!isNumeric(search.slice(1))) {
                return [];
            }
            results = await User.find({ hours: { $gt: search.slice(1) } });
        } else {
            results = await User.find({ name: { $regex: search, $options: "i" } });
        }
        return results;
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function fetchAllRequests() {
    try {
        const rq = await Request.find({ status: 0 });
        const user = await User.find({});
        return {rq,user};
    } catch (err) {
        console.error(err);
        return [];
    }
}

async function retrieveRequestSingle(id) {
    try {
        var results = await Request.findOne({ id: id });
        return results;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function sch_pull() {
    try {
        const result = await Sched.findOne({ id: "main" });
        if (!result) return "no_res";
        return result;
    } catch (err) {
        console.error(err);
        return "err";
    }
}

async function outdated(id) {
    try {
        const user = await User.find({});
        for (let i = 0; i < user.length; i++) {
            curref = user[i].id;
            if (curref === id) {
                return players[i];
            }
        }

        return false;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function disableDay(day) {
    try {
        const result = await Sched.updateOne(
            { id: "main" },
            {
                $set: {
                    [day + ".enabled"]: false,
                },
            }
        );
        console.log("disabled a day: " + day);
        return await Sched.findOne({ id: "main" });
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function enableDay(day, hrs, mins, duration) {
    try {
        const result = await Sched.updateOne(
            { id: "main" },
            {
                $set: {
                    [day + ".enabled"]: true,
                    [day + ".duration"]: duration,
                    [day + ".start.hour"]: hrs,
                    [day + ".start.minute"]: mins,
                },
            }
        );
        console.log("enabled a day: " + day);
        return await Sched.findOne({ id: "main" });
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function removeAllRecords() {
    try {
        const result = await User.updateMany(
            {},
            {
                $set: {
                    record: [],
                    hours: 0,
                },
            }
        );

        return "success";
    } catch (err) {
        console.error(err);
        return false;
    }
}

// Delete all user documents
async function removeAllUsers() {
    try {
        const result = await User.deleteMany({});
        return "success";
    }
    catch (err) {
        console.error(err);
        return false;
    }
}

// removeAllUsers(); // Uncomment when you want to destroy everything!!! heheheha

async function removeRecordById(userId) {
    try {
        const result = await User.updateOne(
            { name: userId },
            {
                $set: {
                    record: [],
                    hours: 0,
                },
            }
        );
        //console.log(result)
        if (result.modifiedCount === 0) {
            // If no user was found with the given userId
            console.log("nouser");
            return "nouser";
        }

        return "success";
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function removeRecordByStartTime(userId, startTime) {
    try {
        const result = await User.updateOne(
            { id: userId },
            {
                $pull: {
                    record: { start: new Date(startTime) },
                },
            }
        );

        return result;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function hourRemove(userId, index) {
    try {
        // Get the user document
        const user = await User.findOne({ id: userId });

        if (!user) {
            console.error("User not found");
            return false;
        }

        // Remove the specified item by index
        user.record.splice(index, 1);

        user.hours = calculateTotalHours(user.record);

        // Save the updated user document
        await user.save();

        return { status: "success", hours: user.hours, id: user.id };
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function hourEdit(userId, index, start, end) {
    try {
        // Get the user document
        const user = await User.findOne({ id: userId });

        if (!user) {
            console.error("User not found");
            return false;
        }

        // Edit the specified item by index

        let startX = new Date(start);
        startX.setTime(startX.getTime() + 8 * 60 * 60 * 1000);

        let endX = new Date(end);
        endX.setTime(endX.getTime() + 8 * 60 * 60 * 1000);

        user.record[index].start = start;
        user.record[index].end = end;

        user.hours = calculateTotalHours(user.record);

        // Save the updated user document
        await user.save();

        return { status: "success", hours: user.hours, id: user.id };
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function hourAdd(userId, start, end) {
    try {
        // Get the user document
        const user = await User.findOne({ id: userId });

        if (!user) {
            console.error("User not found");
            return false;
        }

        // Edit the specified item by index

        let startX = new Date(start);

        let endX = new Date(end);

        const insertIndex = checkAndInsert(user.record, startX, endX);

        if (insertIndex >= 0) {
            user.record.splice(insertIndex, 0, {
                start: startX,
                end: endX,
            });
        } else {
            if (insertIndex === -1) {
                return { status: "overlap" };
            } else {
                return { status: "aftercurrent" };
            }
        }

        // user.record[index].start = start;
        // user.record[index].end = end;

        user.hours = calculateTotalHours(user.record);

        // Save the updated user document
        await user.save();

        return { status: "success", hours: user.hours, id: user.id };
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function getLatest(userId, v) {
    try {
        const user = await User.findOne({ id: userId });

        await User.updateOne(
            { id: userId },
            {
                $set: {
                    latest: v,
                },
            }
        );

        return user.latest;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function flagMissingDesc(email) {
    try {
        await User.updateOne(
            { id: email },
            {
                $inc: {
                    noDesc: 1,
                },
            }
        );

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function getSubteam(id) {
    try {
        const result = await Subgroups.findOne({ owner: id });
        if (!result) return false;
        return result.id;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function subteamMaster(id) {
    // Check if the user is a subteam leader. If they are, return each member.
    // If they are not, return false.
    try {
        const result = await Subgroups.findOne({ owner: id });
        if (!result) return false;
        const members = await User.find({ subgroup: result.id });
        return members;
    } catch (err) {
        console.error(err);
        return false;
    }
}

console.log("Thread > DB Connected on MAIN");

module.exports = {
    registerUser,
    postRequest,
    postData,
    postTime,
    retrieve,
    isAdmin,
    outdated,
    sch_pull,
    disableDay,
    enableDay,
    signOutAllUsers,
    findUsersViaSearch,
    fetchAllRequests,
    removeAllRecords,
    removeRecordById,
    removeRecordByStartTime,
    hourRemove,
    hourEdit,
    hourAdd,
    getLatest,
    updateRequest,
    retrieveRequestSingle,
    flagMissingDesc,
    getSubteam,
    subteamMaster,
};
