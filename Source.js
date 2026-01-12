const palette = document.getElementById("palette");

const ball = document.getElementById("ball");
let growing = true;
let scale = 1;
const speed = 0.01; // pulsate speed

let position = -100; // start outside container
const moveSpeed = 0.5;   // adjust for faster/slower
const paletteSpeed = 0.02; // Adjusted speed for palette animation
function animate() {
    position += moveSpeed;
    if (position >= 0) position = -100; // loop back
    palette.style.left = position + "%";

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


const container = document.getElementById("confetti-container");
const colors = ["#ff0", "#f00", "#0f0", "#0ff", "#f0f", "#fff"];

function createConfetti() {
  const confetti = document.createElement("div");
  confetti.classList.add("confetti");

  // random color, position, speed
  confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  confetti.style.left = Math.random() * window.innerWidth + "px";
  confetti.style.top = "-10px";

  const speed = 2 + Math.random() * 3;
  const rotation = Math.random() * 360;

  function fall() {
    const top = parseFloat(confetti.style.top);
    if (top > window.innerHeight) {
      container.removeChild(confetti); // remove when out of screen
      return;
    }
    confetti.style.top = top + speed + "px";
    confetti.style.transform = `rotate(${rotation + top}deg)`;
    requestAnimationFrame(fall);
  }

  container.appendChild(confetti);
  fall();
}

// create confetti every 50ms
setInterval(createConfetti, 50);
const btn = document.getElementById("flipBtn");

btn.addEventListener("click", () => {
    document.body.classList.remove("flip"); // reset animation
    void document.body.offsetWidth;         // trigger reflow
    document.body.classList.add("flip");    // start animation
});
const form = document.getElementById("userForm");
const message = document.getElementById("formMessage");

form.addEventListener("submit", function(e) {
  e.preventDefault(); // prevent default submission

  // HTML5 validation check
  if (!form.checkValidity()) {
    message.textContent = "Lūdzu ievadiet visus laukus pareizi!";
    return;
  }

  const firstName = form.firstName.value.trim();
  const lastName = form.lastName.value.trim();
  const phone = form.phone.value.trim();
  const personalCode = form.personalCode.value.trim();

  // Extra JS validation if needed
  if (!/^[A-Za-zĀ-ž\s]{2,50}$/.test(firstName)) {
    message.textContent = "Vārds nav derīgs!";
    return;
  }

  if (!/^[A-Za-zĀ-ž\s]{2,50}$/.test(lastName)) {
    message.textContent = "Uzvārds nav derīgs!";
    return;
  }

  if (!/^\+?371\d{8}$/.test(phone)) {
    message.textContent = "Telefona numurs nav derīgs!";
    return;
  }

  if (!/^\d{6}-\d{5}$/.test(personalCode)) {
    message.textContent = "Personas kods nav derīgs!";
    return;
  }

  message.style.color = "green";
  message.textContent = "Dati veiksmīgi iesniegti!";

  // Here you can send the data to your DB/backend via fetch/ajax
  console.log({ firstName, lastName, phone, personalCode });
});
const weatherEl = document.getElementById("weatherCurrent");

fetch("https://api.open-meteo.com/v1/forecast?latitude=57.31&longitude=25.27&current_weather=true&temperature_unit=celsius")
  .then(res => res.json())
  .then(data => {
    if (data.current_weather) {
      const { temperature, weathercode, windspeed } = data.current_weather;
      weatherEl.innerHTML = `
        🌡️ Temp: ${temperature.toFixed(1)}°C<br>
        💨 Wind: ${windspeed} m/s<br>
        📊 Code: ${weathercode}
      `;
    } else {
      weatherEl.textContent = "Dati nav pieejami";
    }
  })
  .catch(err => {
    weatherEl.textContent = "Kļūda ielādējot laikapstākļus";
    console.error(err);
  });
  let users = [
    { id: 1, firstName: "Jānis", lastName: "Bērziņš", phone: "+37112345678", personalCode: "010101-12345" },
    { id: 2, firstName: "Anna", lastName: "Ozoliņa", phone: "+37187654321", personalCode: "020202-54321" }
  ];
  const userSelect = document.getElementById("userSelect");
  const editForm = document.getElementById("editForm");
  const editMessage = document.getElementById("editMessage");
  
  // Populate dropdown
  function populateDropdown() {
    userSelect.innerHTML = '<option value="">--Izvēlies--</option>';
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `${user.firstName} ${user.lastName}`;
      userSelect.appendChild(option);
    });
  }
  
  populateDropdown();
  
  // Fill form when user selected
  userSelect.addEventListener("change", () => {
    const selectedId = parseInt(userSelect.value);
    const user = users.find(u => u.id === selectedId);
    if (user) {
      editForm.firstName.value = user.firstName;
      editForm.lastName.value = user.lastName;
      editForm.phone.value = user.phone;
      editForm.personalCode.value = user.personalCode;
    } else {
      editForm.reset();
    }
  });
  
  // Handle form submission
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const selectedId = parseInt(userSelect.value);
    if (!selectedId) {
      editMessage.style.color = "red";
      editMessage.textContent = "Lūdzu izvēlies lietotāju!";
      return;
    }
  
    const userIndex = users.findIndex(u => u.id === selectedId);
  
    // Update user
    users[userIndex] = {
      id: selectedId,
      firstName: editForm.firstName.value.trim(),
      lastName: editForm.lastName.value.trim(),
      phone: editForm.phone.value.trim(),
      personalCode: editForm.personalCode.value.trim()
    };
  
    editMessage.style.color = "green";
    editMessage.textContent = "Lietotājs veiksmīgi atjaunināts!";
  
    // Refresh dropdown text
    populateDropdown();
    userSelect.value = selectedId;
  });
const deleteUserSelect = document.getElementById("deleteUserSelect");
const deleteBtn = document.getElementById("deleteBtn");
const deleteMessage = document.getElementById("deleteMessage");
  
  // Populate dropdown
  function populateDeleteDropdown() {
    deleteUserSelect.innerHTML = '<option value="">--Izvēlies--</option>';
    users.forEach(user => {
      const option = document.createElement("option");
      option.value = user.id;
      option.textContent = `${user.firstName} ${user.lastName}`;
      deleteUserSelect.appendChild(option);
    });
  }
  
  populateDeleteDropdown();
  
  // Handle delete button click
  deleteBtn.addEventListener("click", () => {
    const selectedId = parseInt(deleteUserSelect.value);
    if (!selectedId) {
      deleteMessage.style.color = "red";
      deleteMessage.textContent = "Lūdzu izvēlies lietotāju!";
      return;
    }
  
    users = users.filter(user => user.id !== selectedId);
  
    deleteMessage.style.color = "green";
    deleteMessage.textContent = "Lietotājs veiksmīgi dzēsts!";
  
    // Refresh dropdowns
    populateDeleteDropdown();
  
    // Optional: clear selection
    deleteUserSelect.value = "";
  });
      