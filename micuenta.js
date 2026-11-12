
const LOGIN_URL = "https://dummyjson.com/auth/login";
const ID_MIN = 4;   
const ID_MAX = 8;   
 
const DESTINO = "turnos.html";   

const form = document.getElementById("loginForm");

const mensajeError = document.getElementById("errorMessage");
const botonIniciarSesion = document.getElementById("btnform");


form.addEventListener("submit", async (event) => {
  event.preventDefault();
  mensajeError.textContent = "";
  botonIniciarSesion.disabled = true;
  botonIniciarSesion.textContent = "Iniciando...";

  try {
    const credenciales = {
      username: document.getElementById("username").value.trim(),
      password: document.getElementById("password").value.trim(),
    };

    const respuesta = await fetch(LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciales),
    });

    if (!respuesta.ok) {
      mensajeError.textContent = "Usuario o contraseña incorrectos";
      return;
    }

    const datos = await respuesta.json();

    if (datos.id < ID_MIN || datos.id > ID_MAX) {
      mensajeError.textContent = "Este usuario no tiene acceso a esta sección";
      return;
    }

    sessionStorage.setItem("token", datos.accessToken ?? datos.token);
    sessionStorage.setItem("usuario", JSON.stringify(datos));
    sessionStorage.setItem("rol", "usuario");

    window.location.href = DESTINO;
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    mensajeError.textContent = "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
  } finally {
    botonIniciarSesion.disabled = false;
    botonIniciarSesion.textContent = "Iniciar Sesión";
  }
});