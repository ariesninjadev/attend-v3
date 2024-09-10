var socket = io();

if (
    !location.host == "2374.team"
) {
    const url = `https://${location.host}`;
    location.replace(url);
}

if (!localStorage.getItem("auth") && !location.pathname.includes("login")) {
    location.replace("/login");
}

setTimeout(() => {
        location.replace("/router");
}, 1800000);