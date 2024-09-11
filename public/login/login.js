// Check if user is already logged in
if (localStorage.getItem("auth") != null) {
    window.location.href = "/router";
}

// Accept a callback from Google CDI
function googleLogin(s) {

    const dc = jwt_decode(s.credential);

    localStorage.setItem("auth", dc.email);
    localStorage.setItem("name", dc.name);
    if (decodedToken.picture) {
        localStorage.setItem("picture", dc.picture);
    }

    window.location.href = "/";
}

function testUser() {
    localStorage.setItem("auth", "apowvalla26@jesuitmail.org");
    localStorage.setItem("name", "Aries Powvalla");
}

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {} else {
        // This means the page was reloaded
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            window.location.replace('/router');
        }
    }
});

let referrer = document.referrer;
console.log(referrer);
if (!referrer.includes("router")) {
    location.replace("/router");
}