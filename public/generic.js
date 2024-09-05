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

// If the page has been loaded for more than 30 minutes, send the user to /router
setTimeout(() => {
        location.replace("/router");
}, 18000);