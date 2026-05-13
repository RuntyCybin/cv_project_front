document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
    return;
  }

  setHeader();
  setFooter();

  const personaId = localStorage.getItem("personaId");
  if (personaId) {
    fetchCursos(personaId);
  }
});

async function fetchCursos(idPersona) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/cursos/persona/${idPersona}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();
    renderCursos(data);
  } catch (error) {
    console.error("Error fetching cursos:", error);
    document.getElementById("cursos-container").innerHTML =
      `<p class="text-danger">Error loading courses.</p>`;
  }
}


function renderCursos(cursos) {
  const container = document.getElementById("cursos-container");
  container.innerHTML = "";
  cursos.forEach(curso => {
    const col = document.createElement("a");
    col.classList.add("list-group-item", "list-group-item-action");
    col.href = "#";
    col.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${curso.nombre}</h5>
        <small>3 days ago</small>
      </div>
      <p class="mb-1">${curso.descripcion}</p>
      <small>And some small print.</small>
    `;
    container.appendChild(col);
  });
}

function createCurso() {
  const nombre = document.getElementById("curso-nombre").value;
  const portal = document.getElementById("curso-portal").value;
  const url = document.getElementById("curso-url").value;
  const autor = document.getElementById("curso-autor").value;
  const descripcion = document.getElementById("curso-descripcion").value;
  const periodo = document.getElementById("curso-periodo").value;
  const personaId = localStorage.getItem("personaId");

  if (!nombre || !descripcion || !portal || !url || !autor || !periodo) {
    alert("Please fill in all fields.");
    return;
  }
  
  const token = localStorage.getItem("token");
  fetch(`${CONFIG.API_BASE_URL}/cv/cursos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nombre, descripcion, portal, url, autor, periodo, personaId })
  })
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    bootstrap.Modal.getInstance(document.getElementById("createCursoModal")).hide();
    alert("Course created successfully!");
    createRelacionPersonaCurso(data.id);
  })
  .catch(error => {
    console.error("Error creating course:", error);
    alert("Error creating course.");
  });
}

function createRelacionPersonaCurso(cursoId) {
  const personaId = localStorage.getItem("personaId");

  if (!cursoId) {
    alert("Please select a course.");
    return;
  }

  const token = localStorage.getItem("token");
  fetch(`${CONFIG.API_BASE_URL}/cv/cursos/persona-curso`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ cursoId, personaId })
  })
  .then(response => {
    if (!response.ok) throw new Error("Network response was not ok");
    return response.json();
  })
  .then(data => {
    console.log("Course added to profile successfully!");
    document.getElementById("cursos-container").innerHTML = `
      <div class="col text-center text-body-secondary py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>`;
    setTimeout(() => fetchCursos(personaId), 2000);
  })
  .catch(error => {
    console.error("Error adding course to profile:", error);
    alert("Error adding course to profile.");
  });
}
