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

async function fetchSkills(idPersona) {
  try {
    if (idPersona != 6) {
      const token = localStorage.getItem("token");
      const response = await fetch(`${CONFIG.API_BASE_URL}/cv/skills/persona/${idPersona}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      renderSkills(data);
    } else {
      console.warn("Persona ID 6 detectado, cargando habilidades del Mmmmakena...");
    }

  } catch (error) {
    console.error("Error fetching skills:", error);
  }
}

function renderSkills(skills) {
  const container = document.getElementById("skills_container");
  const indicators = document.querySelector("#skillsCarousel .carousel-indicators");
  container.innerHTML = "";
  indicators.innerHTML = "";

  const colors = ["text-warning", "text-success", "text-danger", "text-primary", "text-info", "text-secondary"];
  const icons = ["bi-code-slash", "bi-gear", "bi-diagram-3", "bi-lightning-charge", "bi-database", "bi-cpu", "bi-braces", "bi-terminal"];

  const chunks = [];
  for (let i = 0; i < skills.length; i += 4) chunks.push(skills.slice(i, i + 4));

  chunks.forEach((chunk, slideIndex) => {
    const item = document.createElement("div");
    item.classList.add("carousel-item");
    if (slideIndex === 0) item.classList.add("active");

    const row = document.createElement("div");
    row.classList.add("row", "justify-content-center", "g-3");

    chunk.forEach((skill, skillIndex) => {
      const idx = slideIndex * 4 + skillIndex;
      const col = document.createElement("div");
      col.classList.add("col-6", "col-md-3");
      col.innerHTML = `
        <div class="p-3 border rounded-3 h-100">
          <i class="bi ${icons[idx % icons.length]} fs-1 ${colors[idx % colors.length]}"></i>
          <h6 class="mt-2 mb-0">${skill.titulo}</h6>
        </div>`;
      row.appendChild(col);
    });

    item.appendChild(row);
    container.appendChild(item);

    const btn = document.createElement("button");
    btn.type = "button";
    btn.setAttribute("data-bs-target", "#skillsCarousel");
    btn.setAttribute("data-bs-slide-to", slideIndex);
    btn.classList.add("bg-secondary");
    if (slideIndex === 0) { btn.classList.add("active"); btn.setAttribute("aria-current", "true"); }
    indicators.appendChild(btn);
  });
}
