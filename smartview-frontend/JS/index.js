// ====== THEME TOGGLE ======
document.getElementById('theme-toggle-btn').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const icon = document.querySelector("#theme-toggle-btn i");
  icon.classList.toggle("fa-sun");
  icon.classList.toggle("fa-moon");
});

// ====== TOGGLE BETWEEN LOGIN & SIGNUP ======
function toggleForm(formType) {
  const loginBox = document.getElementById("login-box");
  const signupBox = document.getElementById("signup-box");

  if (formType === "signup") {
    loginBox.classList.add("hidden");
    signupBox.classList.remove("hidden");
  } else {
    signupBox.classList.add("hidden");
    loginBox.classList.remove("hidden");
  }
}

// ====== LOGIN USING BACKEND (with JWT) ======
async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    return alert("Please fill out all fields.");
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok && result.token) {
      alert(result.message);

      // ✅ Store JWT token and user email in localStorage
      localStorage.setItem("jwtToken", result.token);
      localStorage.setItem("currentUserEmail", email);

      // Redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      alert(result.message || "Login failed");
    }
  } catch (error) {
    console.error(error);
    alert("Error connecting to server");
  }
}

// ====== SIGNUP USING BACKEND ======
async function registerUser(event) {
  event.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  if (!name || !email || !password) {
    return alert("All fields are required.");
  }

  try {
    const response = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message);
      toggleForm("login"); // switch to login form
    } else {
      alert(result.message || "Signup failed");
    }
  } catch (error) {
    console.error(error);
    alert("Error connecting to server");
  }
}

// ====== ATTACH EVENTS TO FORMS ======
document.getElementById("login-form").addEventListener("submit", loginUser);
document.getElementById("signup-form").addEventListener("submit", registerUser);
