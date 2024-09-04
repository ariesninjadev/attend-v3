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