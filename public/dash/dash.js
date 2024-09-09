function generateProfilePicture(firstName) {
    const firstLetter = firstName.charAt(0).toUpperCase();
    const avatarSpan = document.createElement('span');
    avatarSpan.className = 'avatar avatar-sm';
    avatarSpan.textContent = firstLetter;
    document.getElementById('profile-picture').appendChild(avatarSpan);
}

// If localstorage "picture" is set
if (localStorage.getItem("picture")) {
    // Set the profile picture to the value of localstorage "picture"
    const avatarSpan = document.createElement('span');
    avatarSpan.className = 'avatar avatar-sm';
    avatarSpan.style.backgroundImage = `url(${localStorage.getItem("picture")})`;
    document.getElementById('profile-picture').appendChild(avatarSpan);
} else {
    // Generate a profile picture using the user's name
    generateProfilePicture(localStorage.getItem("name"));
}