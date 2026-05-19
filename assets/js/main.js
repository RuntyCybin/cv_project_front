document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    console.log("Token cargado. Cargando página principal...");

    if (window.location.pathname.endsWith("/index.html") || window.location.pathname === "/") {
      if (localStorage.getItem("personaId")) {
        const personaId = localStorage.getItem("personaId");

        setHeader();
        setFooter();
        fetchCursos(personaId);
        fetchSkills(personaId);
      } else {
        console.warn("No se encontró personaId en localStorage.");
      }
    }

  } else {
    console.error("No se encontró token. Redirigiendo a login...");
    window.location.href = "/login.html";
  }
});



