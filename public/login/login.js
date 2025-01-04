// Check if user is already logged in
if (localStorage.getItem("auth") != null || document.cookie.includes("limbo=true")) {
    window.location.href = "/limbo";
}

// Accept a callback from Google CDI
function googleLogin(s) {

    const dc = jwt_decode(s.credential);

    localStorage.setItem("auth", dc.email);
    localStorage.setItem("name", dc.name);
    if (dc.picture) {
        localStorage.setItem("picture", dc.picture);
    }

    window.location.href = "/";
}

function testUser(name, email) {
    localStorage.setItem("auth", email);
    localStorage.setItem("name", name);
}

