const ball = document.getElementById("ball");
let growing = true;
let scale = 1;
const speed = 0.01; // pulsate speed

let position = -100; // start outside container
const moveSpeed = 0.5; // adjust for faster/slower

// Ensure the palette element is defined
const palette = document.getElementById("palette");
if (!palette) {
    console.error("Element with id 'palette' not found.");
}

const apiDataDiv = document.getElementById("api-data");

fetch("https://api.open-meteo.com/v1/forecast?latitude=57.3110&longitude=25.2690&current_weather=true")
    .then(response => response.json())
    .then(data => {
        const weather = data.current_weather;
        apiDataDiv.innerHTML = `
            <p>Temperature: ${weather.temperature}°C</p>
            <p>Wind Speed: ${weather.windspeed} km/h</p>
        `;
    })
    .catch(error => {
        console.error("Error fetching API data:", error);
        apiDataDiv.innerHTML = "<p>Failed to load weather data.</p>";
    });

function animate() {
    if (palette) {
        position += moveSpeed;
        if (position >= 0) position = -100; // loop back
        palette.style.left = position + "%";
    }

    if (growing) {
        scale += speed;
        if (scale >= 1.5) growing = false; // max size
    } else {
        scale -= speed;
        if (scale <= 1) growing = true; // min size
    }

    ball.style.transform = `scale(${scale})`;
    requestAnimationFrame(animate);
}

animate();

const confettiContainer = document.getElementById('confetti-container');

// Ensure the container exists before proceeding
if (confettiContainer) {
    // Create a canvas element for the confetti effect
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    confettiContainer.style.position = 'relative'; // Ensure the parent div is positioned
    confettiContainer.appendChild(canvas);

    // Initialize the confetti effect
    const confetti = window.confetti.create(canvas, { resize: true });

    // Function to launch confetti
    function launchConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.5 }, // Center the confetti in the container
            scalar: 1.2 // Adjust size of confetti particles
        });
    }

    // Trigger the confetti effect every 2 seconds
    setInterval(launchConfetti, 2000);
} else {
    console.error('Confetti container not found!');
}

const rotateButton = document.getElementById('rotate-button');
let isRotatedLeft = false;

rotateButton.addEventListener('click', () => {
    const body = document.body;

    if (isRotatedLeft) {
        // Rotate 360 degrees to the right
        body.style.transition = 'transform 1s ease';
        body.style.transform = 'rotate(360deg)';
    } else {
        // Rotate 360 degrees to the left
        body.style.transition = 'transform 1s ease';
        body.style.transform = 'rotate(-360deg)';
    }

    // Toggle the rotation state
    isRotatedLeft = !isRotatedLeft;

    // Reset the rotation after the animation
    setTimeout(() => {
        body.style.transition = 'none';
        body.style.transform = 'none';
    }, 1000);
});
// Local Storage DB
let users = JSON.parse(localStorage.getItem('users')) || [];

// Add User
const addForm = document.getElementById('add-user-form');
addForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const idCode = document.getElementById('id-code').value.trim();

    // Allow any letters (Unicode), disallow numbers/symbols
    const nameRegex = /^\p{L}+$/u;
    if (!nameRegex.test(firstName)) {
        alert('First name can only contain letters!');
        return;
    }
    if (!nameRegex.test(lastName)) {
        alert('Last name can only contain letters!');
        return;
    }

    // Latvian phone number validation
    // Local: 2XXXXXXX (8 digits), International: +371XXXXXXXX (11 digits)
    const latviaPhoneRegex = /^(2\d{7}|\+371\d{8})$/;
    if (!latviaPhoneRegex.test(phone)) {
        alert('Phone number must be a valid Latvian number (2XXXXXXX or +371XXXXXXXX)!');
        return;
    }

    const user = {
        id: Date.now(),
        firstName,
        lastName,
        phone,
        idCode
    };

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    alert('User added!');
    addForm.reset();
    updateUserSelects();
});


// Populate Edit/Delete Selects
const editSelect = document.getElementById('edit-user-select');
const deleteSelect = document.getElementById('delete-user-select');

function updateUserSelects() {
    [editSelect, deleteSelect].forEach(select => {
        select.innerHTML = '<option value="">Select user</option>';
        users.forEach(u => {
            select.innerHTML += `<option value="${u.id}">${u.firstName} ${u.lastName}</option>`;
        });
    });
}
updateUserSelects();

// Edit User
const editForm = document.getElementById('edit-user-form');
editSelect.addEventListener('change', function() {
    const user = users.find(u => u.id == this.value);
    if (user) {
        document.getElementById('edit-first-name').value = user.firstName;
        document.getElementById('edit-last-name').value = user.lastName;
        document.getElementById('edit-phone').value = user.phone;
        document.getElementById('edit-id-code').value = user.idCode;
    }
});

editForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const firstName = document.getElementById('edit-first-name').value.trim();
    const lastName = document.getElementById('edit-last-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const idCode = document.getElementById('edit-id-code').value.trim();

    // Allow any kind of letter (Unicode), disallow numbers/symbols
    const nameRegex = /^\p{L}+$/u;
    if (!nameRegex.test(firstName)) {
        alert('First name can only contain letters!');
        return;
    }
    if (!nameRegex.test(lastName)) {
        alert('Last name can only contain letters!');
        return;
    }

    // Latvian phone number validation
    // Local: 2XXXXXXX (8 digits), International: +371XXXXXXXX (11 digits)
    const latviaPhoneRegex = /^(2\d{7}|\+371\d{8})$/;
    if (!latviaPhoneRegex.test(phone)) {
        alert('Phone number must be a valid Latvian number (2XXXXXXX or +371XXXXXXXX)!');
        return;
    }

    const user = users.find(u => u.id == editSelect.value);
    if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.idCode = idCode;
        localStorage.setItem('users', JSON.stringify(users));
        alert('User updated!');
        updateUserSelects();
    }
});



// Delete User
document.getElementById('delete-user-button').addEventListener('click', function() {
    const id = deleteSelect.value;
    if (!id) return alert('Select a user first!');
    users = users.filter(u => u.id != id);
    localStorage.setItem('users', JSON.stringify(users));
    alert('User deleted!');
    updateUserSelects();
});
