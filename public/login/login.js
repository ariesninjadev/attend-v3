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

