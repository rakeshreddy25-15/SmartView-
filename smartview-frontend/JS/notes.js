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

  // ===== Notes Logic =====
  const noteInput = document.getElementById("noteInput");
  const notesList = document.getElementById("notesList");

  async function addNote() {
    if (!noteInput.value.trim()) return alert("Please write something!");

    try {
      const res = await fetch("http://localhost:8080/api/notes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: noteInput.value.trim(),
          userEmail: localStorage.getItem("currentUserEmail") || "guest"
        })
      });

      if (!res.ok) throw new Error("Failed to save note");

      const savedNote = await res.json();
      renderNote(savedNote);

      noteInput.value = "";
    } catch (err) {
      console.error(err);
      alert("Error saving note");
    }
  }

  function renderNote(note) {
    const li = document.createElement("li");
    li.textContent = note.content;
    notesList.appendChild(li);
  }

  // ===== Attachments Logic =====
  const fileInput = document.getElementById("fileInput");
  const attachmentsList = document.getElementById("attachmentsList");

 async function addAttachment() {
  if (!fileInput.files[0]) return alert("Please select a file!");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const res = await fetch("http://localhost:8080/api/notes/upload", {
      method: "POST",
      body: formData
    });

    if (!res.ok) throw new Error("Upload failed");

    const fileName = await res.text();

    alert("Uploaded successfully ✅");

    renderAttachment(fileName);
    fileInput.value = "";
  } catch (err) {
    console.error(err);
    alert("Error uploading file");
  }
}


  function renderAttachment(fileName) {
    const li = document.createElement("li");

    const link = document.createElement("a");
    link.href = `http://localhost:8080/uploads/${fileName}`;
    link.textContent = fileName;
    link.target = "_blank";

    li.appendChild(link);
    attachmentsList.appendChild(li);
  }

  // ===== Attach Button Events =====
  window.addNote = addNote;
  window.addAttachment = addAttachment;
});
