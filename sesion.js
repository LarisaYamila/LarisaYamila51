
function obtenerToken() {
  return sessionStorage.getItem("token");
}

function obtenerRol() {
  return sessionStorage.getItem("rol");
}

function usuarioLogueado() {
  return obtenerToken() !== null;
}


function protegerPagina(rolesPermitidos) {
  if (!usuarioLogueado() || !rolesPermitidos.includes(obtenerRol())) {
    window.location.href = "Inicio.html";
  }
}

function cerrarSesion() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("usuario");
  sessionStorage.removeItem("rol");
  window.location.href = "Inicio.html";
}