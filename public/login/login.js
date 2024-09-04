// Check if user is already logged in
if (localStorage.getItem("auth") != null) {
    window.location.href = "/";
}

// Accept a callback from Google CDI
function googleLogin(s) {

    localStorage.setItem("auth", jwt_decode(s.credential).email);
    localStorage.setItem("name", jwt_decode(s.credential).name);

    window.location.href = "/";
}

function testUser() {
    localStorage.setItem("auth", "apowvalla26@jesuitmail.org");
    localStorage.setItem("name", "Aries Powvalla");
}

function testAdmin() {
    localStorage.setItem("auth", "aries.powvalla@gmail.com");
    localStorage.setItem("name", "Aries Powvalla");
}