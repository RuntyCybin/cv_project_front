document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
    return;
  }

  setHeader();
  setFooter();

  const personaId = localStorage.getItem("personaId");
  if (personaId) {
    fetchProjects(personaId);
  } else {
    console.warn("No se encontró personaId en localStorage.");
  }

});

async function fetchProjects(idPersona) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/projects/persona/${idPersona}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    console.log("Projects fetched successfully:", data);
    renderProjects(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
}

function renderProjects(projects) {
  const projectsContainer = document.getElementById("projects-container");
  projectsContainer.innerHTML = "";
  projectsContainer.innerHTML = "";
  projects.forEach(project => {
    const projectElement = document.createElement("div");
    projectElement.classList.add("col");
    projectElement.innerHTML = `
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <i class="bi bi-code-slash fs-2 text-warning me-3"></i>
              <h5 class="card-title mb-0">${project.titulo}</h5>
            </div>
            <p class="card-text">${project.descripcion}</p>
            <div class="d-flex gap-2 flex-wrap mt-3">
              <span class="badge bg-warning text-dark">Java</span>
              <span class="badge bg-success">Spring Boot</span>
              <span class="badge bg-danger">Redis</span>
              <span class="badge bg-info text-dark">Docker</span>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-between text-body-secondary small">
            <span><i class="bi bi-building me-1"></i>${project.consultora}</span>
            <span><i class="bi bi-calendar me-1"></i>${project.periodo}</span>
          </div>
        </div>
      `;
    projectsContainer.appendChild(projectElement);
  });
}

function createProject() {
  const token = localStorage.getItem("token");
  const personaId = localStorage.getItem("personaId");
  const titulo = document.getElementById("project-name").value;
  const descripcion = document.getElementById("project-descripcion").value;
  const consultora = document.getElementById("project-company").value;
  const periodo = document.getElementById("project-periodo").value;

  if (!titulo || !descripcion || !consultora || !periodo) {
    alert("Please fill in all fields.");
    return;
  }

  const projectData = {
    titulo,
    descripcion,
    consultora,
    periodo,
    persona: { id: personaId }
  };

  fetch(`${CONFIG.API_BASE_URL}/cv/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(projectData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      bootstrap.Modal.getInstance(document.getElementById("createProjectModal")).hide();
      console.log("Project created successfully:", data);
      createRelacionPersonaProject(data.id);
    })
    .catch(error => {
      console.error("Error creating project:", error);
    });
}

function createRelacionPersonaProject(proyectoId) {
  const personaId = localStorage.getItem("personaId");

  if (!proyectoId) {
    alert("Please select a project.");
    return;
  }

  const token = localStorage.getItem("token");
  fetch(`${CONFIG.API_BASE_URL}/cv/projects/persona-project`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ personaId, proyectoId })
  })
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      console.log("RelacionPersonaProject created successfully:", data);
      document.getElementById("projects-container").innerHTML = `
        <div class="col text-center text-body-secondary py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>`;
      setTimeout(() => fetchProjects(personaId), 2000);
    })
    .catch(error => {
      console.error("Error creating RelacionPersonaProject:", error);
      alert("Error associating project with persona.");
    });
}