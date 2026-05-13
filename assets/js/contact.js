document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    console.log("Token encontrado. Cargando página de contacto...");

    if (window.location.pathname.endsWith("/contact.html") || window.location.pathname === "/") {
      setHeader();
      setFooter();
      if (localStorage.getItem("personaId")) {
        const personaId = localStorage.getItem("personaId");
        console.log("Persona ID encontrado en localStorage: " + personaId);
        fetchPersona();
      } else {
        console.warn("No se encontró personaId en localStorage.");
      }
    } else {
      console.warn("No se está en la página de contacto. Redirigiendo a index...");
      //window.location.href = "/index.html";
    }

  } else {
    console.log("No se encontró token. Redirigiendo a login...");
    window.location.href = "/login.html";
  }
});

function fetchPersona() {
  const nombre = localStorage.getItem("personaNombre");
  const apellidos = localStorage.getItem("personaApellidos");
  const fechaNacimiento = localStorage.getItem("personaFechaNacimiento");
  const telefono = localStorage.getItem("personaTelefono");
  const email = localStorage.getItem("personaEmail");
  const calle = localStorage.getItem("personaCalle");
  const via = localStorage.getItem("personaVia");
  const numero = localStorage.getItem("personaNumero");
  const cp = localStorage.getItem("personaCP");
  const ciudad = localStorage.getItem("personaCiudad");
  const provincia = localStorage.getItem("personaProvincia");
  const pais = localStorage.getItem("personaPais");
  const nacion = localStorage.getItem("personaNacion");
  if (nombre) {
    document.getElementById("persdata_nombre").textContent = nombre;
  }
  if (apellidos) {
    document.getElementById("persdata_apellidos").textContent = apellidos;
  }
  if (fechaNacimiento) {
    document.getElementById("persdata_fecha_nacimiento").textContent = fechaNacimiento;
  }
  if (telefono) {
    document.getElementById("persdata_telefono").textContent = telefono;
  }
  if (email) {
    document.getElementById("persdata_email").textContent = email;
  }
  if (calle) {
    document.getElementById("persdata_calle").textContent = calle;
  }
  if (via) {
    document.getElementById("persdata_via").textContent = via;
  }
  if (numero) {
    document.getElementById("persdata_numero").textContent = numero;
  }
  if (cp) {
    document.getElementById("persdata_cp").textContent = cp;
  }
  if (ciudad) {
    document.getElementById("persdata_ciudad").textContent = ciudad;
  }
  if (provincia) {
    document.getElementById("persdata_provincia").textContent = provincia;
  }
  if (pais) {
    document.getElementById("persdata_pais").textContent = pais;
  }
  if (nacion) {
    document.getElementById("persdata_nacion").textContent = nacion;
  }

}

function setFooter() {
  fetch("./footer.html")
    .then((response) => response.text())
    .then((html) => {
      const placeholder = document.getElementById("footer-placeholder");
      if (placeholder) placeholder.innerHTML = html;
    })
    .catch((error) => console.error("Error loading footer:", error));
}

function setHeader() {
  fetch("./header.html")
    .then((response) => response.text())
    .then((html) => {
      const placeholder = document.getElementById("header-placeholder");
      if (!placeholder) return;

      placeholder.innerHTML = html;
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const activePageByRoute = {
        "": "index.html",
        "index.html": "index.html",
        "contact.html": "contact.html",
      };
      const activePage = activePageByRoute[currentPage] || "";

      placeholder.querySelectorAll("[data-nav]").forEach((link) => {
        const targetPath = link.getAttribute("data-nav");
        const isActive = targetPath === activePage;

        link.classList.toggle("active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    })
    .catch((error) => console.error("Error loading header:", error));
}