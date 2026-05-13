const PERSONA_API_BASE_URL = "http://localhost:8082";
const AUTENTICACION_API_BASE_URL = "http://localhost:8083";


// Llamamos a la API para registrar un nuevo usuario al hacer submit del formulario de registro
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".form_registro_usuario");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const username = document.getElementById("registerUsername").value;
      const email = document.getElementById("registerEmail").value;
      const password = document.getElementById("registerPassword").value;
      const surname = document.getElementById("registerSurname").value;
      const birthdate = document.getElementById("registerBirthday").value;
      const phonenumber = document.getElementById("registerPhone").value;
      const strtype = document.getElementById("registerVia").value;
      const strname = document.getElementById("registerStr").value;
      const strnumber = document.getElementById("registerNumber").value;
      const postalcode = document.getElementById("registerPostalCode").value;
      const city = document.getElementById("registerCity").value;
      const county = document.getElementById("registerProvince").value;
      const country = document.getElementById("registerCountry").value;
      const nationality = document.getElementById("registerNacionalidad").value;

      console.log("Starting the user registration");
      const resultPersona = await registerUser(username, surname, birthdate, phonenumber, email, strname, strtype,
        strnumber, postalcode, city, county, country, nationality);
      
      if (resultPersona) {
        console.log("Usuario registrado exitosamente. Id de Persona recuperado: " + resultPersona.id);

        const resultAuth = await createAuth(email, password);

        if (resultAuth) {
          console.log("Autenticacion registrada exitosamente. Id de Autenticacion recuperado: " + resultAuth.id);

          const resultPersonaAuth = await createPersonaAutenticacion(resultPersona.id, resultAuth.id);

          console.log("La relacion Persona-Autenticacion registrada registrada con exito. id: " + resultPersonaAuth.id);
        }
        window.location.href = "/login.html";
      } else {
        alert("Error al registrar el usuario. Por favor, inténtelo de nuevo.");
      }
    });
  }
});

// Función para llamar a la API de registro de usuarios
async function registerUser(username, surname, birthdate, phonenumber, email, strname, strtype,
  strnumber, postalcode, city, county, country, nationality) {
  try {
    const response = await fetch(`${PERSONA_API_BASE_URL}/cv/persona`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: username,
        apellidos: surname,
        fecha_nacimiento: birthdate,
        telefono: phonenumber,
        email: email,
        calle: strname,
        via: strtype,
        numero_casa: strnumber,
        codigo_postal: postalcode,
        ciudad: city,
        provincia: county,
        pais: country,
        nacionalidad: nationality
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("User registered successfully:", data);
    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}

// Funcion para llamar la API de crear Autenticacion y Persona-Autenticacion
async function createAuth(email, password) {
  try {
    const response = await fetch(`${AUTENTICACION_API_BASE_URL}/cv/autenticacion`, {
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
    console.log("autenticacion registered successfully:", data);
    return data;
  } catch (error) {
    console.error("Error registering autenticacion:", error);
    return null;
  }
}

// Funcion para llamar la API de crear la relacion Persona - Autenticacion
async function createPersonaAutenticacion(personaId, autenticacionId) {
  try {
    const response = await fetch(`${AUTENTICACION_API_BASE_URL}/cv/persona-autenticacion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personaId: personaId,
        autenticacionId: autenticacionId
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("persona - autenticacion registered successfully:", data);
    return data;
  } catch (error) {
    console.error("Error registering persona - autenticacion:", error);
    return null;
  }
}
