document.addEventListener("DOMContentLoaded", () => {

  // ===== Theme Toggle =====
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const icon = themeBtn.querySelector("i");
      icon.classList.toggle("fa-sun");
      icon.classList.toggle("fa-moon");
    });
  }

  // ===== Logout =====
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUserEmail");
      alert("You have been logged out.");
      window.location.href = "index.html";
    });
  }

  // ===== Fetch Applications from Backend =====
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

      const applications = await res.json();

      // Update cards
      document.getElementById("total-apps").textContent = applications.length;
      document.getElementById("upcoming-interviews").textContent =
        applications.filter(app => app.status === "Interviewed").length;
      document.getElementById("offers-received").textContent =
        applications.filter(app => app.status === "Offered").length;

      // Count by status for chart
      const statusCounts = { Pending: 0, Interviewed: 0, Rejected: 0, Offered: 0 };
      applications.forEach(app => {
        if (statusCounts[app.status] !== undefined) {
          statusCounts[app.status]++;
        }
      });

      renderChart(statusCounts);
    } catch (err) {
      console.error("Error fetching applications:", err);
      alert("Could not load dashboard data.");
    }
  }

  // ===== Chart =====
  let chartInstance = null;
  function renderChart(statusCounts) {
    const ctx = document.getElementById("statusChart").getContext("2d");

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Pending", "Interviewed", "Rejected", "Offered"],
        datasets: [{
          label: "Applications",
          data: [
            statusCounts.Pending,
            statusCounts.Interviewed,
            statusCounts.Rejected,
            statusCounts.Offered
          ],
          backgroundColor: ["#f1c40f", "#3498db", "#e74c3c", "#2ecc71"],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  // ===== Init =====
  fetchApplications();
});
