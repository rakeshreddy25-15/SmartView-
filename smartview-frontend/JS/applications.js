document.addEventListener("DOMContentLoaded", () => {

  // ===== Theme Toggle =====
  document.getElementById("theme-toggle-btn").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const icon = document.querySelector("#theme-toggle-btn i");
    icon.classList.toggle("fa-sun");
    icon.classList.toggle("fa-moon");
  });

  // ===== Logout =====
  document.getElementById("logout-link").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("currentUserEmail");
    alert("You have been logged out.");
    window.location.href = "index.html";
  });

  const form = document.getElementById("applicationForm");
  const tableBody = document.querySelector("#applicationsTable tbody");
  let editingId = null;

  // ===== Fetch Applications =====
  async function fetchApplications() {
    const email = localStorage.getItem("currentUserEmail");
    if (!email) {
      alert("Please login first!");
      window.location.href = "index.html";
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/applications?email=${email}`);
      if (!res.ok) throw new Error("Failed to fetch applications");

      const apps = await res.json();
      renderTable(apps);
    } catch (err) {
      console.error(err);
      alert("Error loading applications.");
    }
  }

  // ===== Render Table =====
  function renderTable(applications) {
    tableBody.innerHTML = "";
    applications.forEach(app => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${app.company}</td>
        <td>${app.position}</td>
        <td>${app.status}</td>
        <td>${app.date}</td>
        <td>
          <button class="edit-btn" data-id="${app.id}">Edit</button>
          <button class="delete-btn" data-id="${app.id}">Delete</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  // ===== Save / Update =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("currentUserEmail");
    if (!email) {
      alert("Please login first!");
      return;
    }

    const newApp = {
      email,
      company: document.getElementById("company").value,
      position: document.getElementById("position").value,
      status: document.getElementById("status").value,
      date: document.getElementById("date").value,
    };

    try {
      if (editingId) {
        await fetch(`http://localhost:8080/api/applications/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newApp)
        });
        editingId = null;
      } else {
        await fetch("http://localhost:8080/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newApp)
        });
      }

      form.reset();
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Error saving application");
    }
  });

  // ===== Handle Edit / Delete =====
  tableBody.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
      try {
        await fetch(`http://localhost:8080/api/applications/${id}`, { method: "DELETE" });
        fetchApplications();
      } catch (err) {
        console.error(err);
        alert("Error deleting application");
      }
    }

    if (e.target.classList.contains("edit-btn")) {
      try {
        const email = localStorage.getItem("currentUserEmail");
        const res = await fetch(`http://localhost:8080/api/applications?email=${email}`);
        const apps = await res.json();
        const app = apps.find(a => a.id == id);

        document.getElementById("company").value = app.company;
        document.getElementById("position").value = app.position;
        document.getElementById("status").value = app.status;
        document.getElementById("date").value = app.date;

        editingId = id;
      } catch (err) {
        console.error(err);
        alert("Error loading application for edit");
      }
    }
  });

  // ===== Init =====
  fetchApplications();
});
