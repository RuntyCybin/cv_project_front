function setFooter() {
  const personaDireccion = localStorage.getItem("personaDireccion");
  const personaEmail = localStorage.getItem("personaEmail");
  const personaTelefono = localStorage.getItem("personaTelefono");
  fetch("./footer.html")
    .then((response) => response.text())
    .then((html) => {
      const placeholder = document.getElementById("footer-placeholder");
      if (placeholder) {
        placeholder.innerHTML = html;
        if (personaDireccion) document.getElementById("direccion_persona").textContent = personaDireccion;
        if (personaEmail) document.getElementById("email_persona").textContent = personaEmail;
        if (personaTelefono) document.getElementById("telefono_persona").textContent = personaTelefono;
      }
    })
    .catch((error) => console.error("Error loading footer:", error));
}

function setHeader() {
  const nombre = localStorage.getItem("personaNombre");
  const apellidos = localStorage.getItem("personaApellidos");
  if (nombre && apellidos) {
    document.getElementById("personNameTitleH1").textContent = `${nombre} ${apellidos}`;
  }

  fetch("./header.html")
    .then((response) => response.text())
    .then((html) => {
      const placeholder = document.getElementById("header-placeholder");
      if (!placeholder) return;
      placeholder.innerHTML = html;
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      placeholder.querySelectorAll("[data-nav]").forEach((link) => {
        const isActive = link.getAttribute("data-nav") === currentPage;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    })
    .catch((error) => console.error("Error loading header:", error));
}
