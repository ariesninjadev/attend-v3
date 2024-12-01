var socket = io();

// If the current host is 2374-a.com (production), AND we are on http, redirect to https
if (
    location.host == "2374-a.com" && location.protocol == "http:"
) {
    const url = `https://${location.host}/${location.pathname.split("/")[1]}`;
    location.replace(url);
}

setTimeout(() => {
        location.replace("/limbo");
}, 1800000);