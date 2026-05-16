document.addEventListener("DOMContentLoaded", () => {

  if (localStorage.getItem("token")) {
    console.log("Token encontrado en localStorage. Redirigiendo a index.html...");
    window.location.href = "/index.html";
    return;
  } else {
    console.log("No se encontró token en localStorage. Accediendo a la página de login.");
  }

  const form = document.querySelector("#form_login");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("LOGIN CLICKED!");
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;

      console.log("Comprobar si existe en la bbdd el usuario por email y password");
      const resultAutenticacion = await buscarAutenticacion(email, password);

      if (resultAutenticacion) {
        console.log("Login encontrado con exito. Id de Autenticacion recuperado: " + resultAutenticacion.id);

        const token = resultAutenticacion.jwt;
        // Guardar el token en localStorage para su uso posterior
        localStorage.setItem("token", token);

        const resultPersonaAutenticacion = await buscarPersonaAutenticacion(resultAutenticacion.id);

        if (resultPersonaAutenticacion) {
          console.log("Relacion Persona - Autenticacion recuperada: " + resultPersonaAutenticacion.id);

          // Guardar el id de persona en localStorage para su uso posterior
          localStorage.setItem("personaId", resultPersonaAutenticacion.personaId);
          const resultPersona = await buscarPersona(resultPersonaAutenticacion.personaId);

          if (resultPersona) {
            console.log("Persona encontrada: " + resultPersona.nombre);
          }
        }
        window.location.href = "/index.html";
      } else {
        alert("Error al registrar el usuario. Por favor, inténtelo de nuevo.");
      }
    });
  }
});


function $(elid) {
  console.log("Getting element with id: " + elid);
  return document.getElementById(elid);
}

var cursor;
window.onload = init;

function init() {
  console.log("Metodo init() llamado");
}

// Función para buscar en la tabla de autenticacion por email y pwd - sign in
async function buscarAutenticacion(email, password) {
  try {
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/autenticacion/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        login: email,
        password: password
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Usuario logueado con exito:", data);
    return data;
  } catch (error) {
    console.error("Error logueando usuario:", error);
    return null;
  }
}

// Función para buscar en la tabla de persona-autenticacion por id de autenticacion
async function buscarPersonaAutenticacion(idautenticacion) {
  console.log("Buscando persona-autenticacion con id de autenticacion: " + idautenticacion);
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/persona-autenticacion/${idautenticacion}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("buscarPersonaAutenticacion - Network response was not ok");
    }

    const data = await response.json();
    console.log("Persona-Autenticacion encontrada:", data);
    return data;
  } catch (error) {
    console.error("Error buscando persona-autenticacion:", error);
    return null;
  }
}

// Función para buscar la persona por id
async function buscarPersona(idpersona) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${CONFIG.API_BASE_URL}/cv/persona/${idpersona}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Persona encontrada:", data);
    localStorage.setItem("personaNombre", data.nombre);
    localStorage.setItem("personaApellidos", data.apellidos);
    localStorage.setItem("personaFechaNacimiento", data.fecha_nacimiento);
    localStorage.setItem("personaTelefono", data.telefono);
    localStorage.setItem("personaEmail", data.email);
    localStorage.setItem("personaCalle", data.calle);
    localStorage.setItem("personaVia", data.via);
    localStorage.setItem("personaNumero", data.numero_casa);
    localStorage.setItem("personaCP", data.codigo_postal);
    localStorage.setItem("personaCiudad", data.ciudad);
    localStorage.setItem("personaProvincia", data.provincia);
    localStorage.setItem("personaPais", data.pais);
    localStorage.setItem("personaNacion", data.nacionalidad);
    const direccion = `Direccion: ${data.calle} ${data.numero_casa}, ${data.ciudad}, ${data.provincia}, ${data.pais}`;
    localStorage.setItem("personaDireccion", direccion);

    // TODO: Guardar el resto de campos de persona en localStorage si es necesario
    return data;
  } catch (error) {
    console.error("Error buscando persona:", error);
    return null;
  }
}