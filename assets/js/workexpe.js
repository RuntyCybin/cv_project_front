document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
    return;
  }

  setHeader();
  setFooter();

  const personaId = localStorage.getItem("personaId");
  if (personaId) {
    fetchExperiences(personaId);
  }
});

async function fetchExperiences(idPersona) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/experiencias/persona/${idPersona}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    renderExperiences(data);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    document.getElementById("experiences-container").innerHTML =
      `<p class="text-danger">Error loading experiences.</p>`;
  }
}

function renderExperiences(experiences) {
  const container = document.getElementById("experiences-container");
  container.innerHTML = "";
  experiences.forEach(exp => {
    const col = document.createElement("div");
    col.classList.add("col");
    //col.href = "#";
    col.innerHTML = `
      <div class="card shadow-sm">
          <svg aria-label="Placeholder: Thumbnail" class="bd-placeholder-img card-img-top" height="225"
          preserveAspectRatio="xMidYMid slice" role="img" width="100%" xmlns="http://www.w3.org/2000/svg">
              <title>${exp.empresa}</title>
              <rect width="100%" height="100%" fill="#55595c"></rect>
              <text x="50%" y="50%" fill="#eceeef" dy=".3em">
                  ${exp.puesto}
              </text>
          </svg>
          <div class="card-body">
          <p class="card-text">
              ${exp.descripcion}
          </p>
          <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
              <button type="button" class="btn btn-sm btn-outline-secondary">
                  View
              </button>
              <button type="button" class="btn btn-sm btn-outline-secondary">
                  Edit
              </button>
              </div>
              <small class="text-body-secondary">9 mins</small>
          </div>
          </div>
      </div>
    `;
    container.appendChild(col);
  });
}

function createExperience() {
  const empresa = document.getElementById("expCompany").value;
  const puesto = document.getElementById("expRole").value;
  const descripcion = document.getElementById("expDescription").value;
  const periodo = document.getElementById("expPeriod").value;
  const personaId = localStorage.getItem("personaId");

  // Aquí puedes agregar la lógica para enviar esta información al backend
  if (!empresa || !puesto || !descripcion || !periodo) {
    alert("Please fill in all fields.");
    return;
  }
  
  const token = localStorage.getItem("token");
  fetch(`${CONFIG.API_BASE_URL}/cv/experiencias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ puesto, empresa, descripcion, periodo })
  })
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    bootstrap.Modal.getInstance(document.getElementById("createExperienciaModal")).hide();
    alert("Experience created successfully!");
    createRelacionPersonaExperiencia(data.id);
  })
  .catch(error => {
    console.error("Error creating experience:", error);
    alert("Error creating experience. Please try again.");
  });
}

function createRelacionPersonaExperiencia(experienciaId) {
  const personaId = localStorage.getItem("personaId");

  if (!experienciaId) {
    alert("Error enviando id de experiencia.");
    return;
  }

  const token = localStorage.getItem("token");
  fetch(`${CONFIG.API_BASE_URL}/cv/experiencias/persona`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ personaId, experienciaId })
  })
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    console.log("RelacionPersonaExperiencia created:", data);
    document.getElementById("experiences-container").innerHTML = `
      <div class="col text-center text-body-secondary py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
    fetchExperiences(personaId);
  })
  .catch(error => {
    console.error("Error creating RelacionPersonaExperiencia:", error);
    alert("Error linking experience to person. Please try again.");
  });
}