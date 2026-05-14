document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    console.log("Token cargado. Cargando página principal...");

    if (window.location.pathname.endsWith("/index.html") || window.location.pathname === "/") {
      if (localStorage.getItem("personaId")) {
        const personaId = localStorage.getItem("personaId");

        setHeader();
        setFooter();
        fetchCursos(personaId);
      } else {
        console.warn("No se encontró personaId en localStorage.");
      }
    }

  } else {
    console.log("No se encontró token. Redirigiendo a login...");
    window.location.href = "/login.html";
  }
});

// Función para cargar 3 cursos
async function fetchCursos(idPersona) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/cursos/persona/${idPersona}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const cursosContainer = document.getElementById("cursos-container");
    cursosContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar los cursos
    const renderCursos = (cursos) => {
      cursosContainer.innerHTML = "";
      cursosContainer.classList.add("justify-content-center");
      cursos.forEach(curso => {
        const cursoElement = document.createElement("div");
        cursoElement.classList.add("col", "d-flex", "align-items-start");
        cursoElement.innerHTML = `
          <i class="bi bi-mortarboard text-body-secondary flex-shrink-0 me-3" style="font-size: 1.75em;" aria-hidden="true"></i>
          <div>
            <h3 class="fw-bold mb-0 fs-4 text-body-emphasis">${curso.nombre}</h3>
            <p>${curso.descripcion}</p>
          </div>
        `;
        cursosContainer.appendChild(cursoElement);
      });
    };

    renderCursos(data.slice(0, 3));
    return data;
  } catch (error) {
    console.error("Error fetching cursos:", error);
    return null;
  }
}

