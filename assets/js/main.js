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
        fetchScocials(personaId);
      } else {
        console.warn("No se encontró personaId en localStorage.");
      }
    }

  } else {
    console.error("No se encontró token. Redirigiendo a login...");
    window.location.href = "/login.html";
  }
});

async function fetchScocials(idPersona) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/socials/persona/${idPersona}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Socials fetched:", data);
    const socialsContainer = document.getElementById("redes_sociales_persona");
    socialsContainer.innerHTML = "";
    const renderSocials = (socials) => {
      socials.forEach(social => {
        socialsContainer.innerHTML += `
        <li class="d-flex align-items-center mb-2">
          <i class="bi bi-linkedin me-2" aria-hidden="true"></i>
          <a class="link-body-emphasis text-decoration-none" href="${social.linkedIn}"
            aria-label="LinkedIn">LinkedIn</a>
        </li>
        <li class="d-flex align-items-center mb-2">
          <i class="bi bi-github me-2" aria-hidden="true"></i>
          <a class="link-body-emphasis text-decoration-none" href="${social.github}"
            aria-label="GitHub">GitHub</a>
        </li>
        <li class="d-flex align-items-center mb-2">
          <i class="bi bi-telegram me-2" aria-hidden="true"></i>
          <a class="link-body-emphasis text-decoration-none" href="${social.telegram}"
            aria-label="Telegram">Telegram</a>
        </li>
        <li class="d-flex align-items-center">
          <i class="bi bi-whatsapp me-2" aria-hidden="true"></i>
          <a class="link-body-emphasis text-decoration-none" href="${social.whatsapp}"
            aria-label="WhatsApp">WhatsApp</a>
        </li>`;
      });
    };
    renderSocials(data);
  } catch (error) {
    console.error("Error fetching socials:", error);
  }
}



