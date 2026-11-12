const CLAVE_TURNOS = "turnos";
const CLAVE_USUARIO = "usuario"; 

const HORARIOS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"];

const form = document.getElementById("formTurno");
const selectHora = document.getElementById("hora");
const inputFecha = document.getElementById("fecha");
const mensaje = document.getElementById("mensaje");
const tabla = document.getElementById("tablaTurnos");
const sinTurnos = document.getElementById("sinTurnos");


function obtenerTurnos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_TURNOS)) || [];
  } catch {
    return [];
  }
} 
function guardarTurnos(turnos) {
  localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnos));
}


function obtenerSolicitante() {
  return sessionStorage.getItem(CLAVE_USUARIO) || "Anónimo";
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "d-block mb-2 text-" + tipo;
}

function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}


function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function estadoDe(turno) {
  return turno.estado || "pendiente";
}

function etiquetaEstado(estado) {
  const colores = { pendiente: "warning", confirmado: "success", cancelado: "secondary" };
  const color = colores[estado] || "secondary";
  return `<span class="badge text-bg-${color} me-2">${escapar(estado)}</span>`;
}


function cargarHorarios() {
  const fecha = inputFecha.value;
  const ocupados = obtenerTurnos()
    .filter(t => t.fecha === fecha && estadoDe(t) !== "cancelado")
    .map(t => t.hora);

  selectHora.innerHTML = '<option value="">Seleccionar...</option>';
  HORARIOS.forEach(h => {
    if (!ocupados.includes(h)) {
      const opcion = document.createElement("option");
      opcion.value = h;
      opcion.textContent = h;
      selectHora.appendChild(opcion);
    }
  });
}


function mostrarTurnos() {
  const yo = obtenerSolicitante();
  const turnos = obtenerTurnos()
    .filter(t => (t.solicitante || "Anónimo") === yo)
    .sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  tabla.innerHTML = "";
  sinTurnos.classList.toggle("d-none", turnos.length > 0);

  turnos.forEach(t => {
    const estado = estadoDe(t);
    const botonCancelar = estado !== "cancelado"
      ? `<button class="btn btn-sm btn-danger" data-id="${t.id}">Cancelar</button>`
      : "";

    const fila = document.createElement("tr");
    
    fila.innerHTML = `
      <td>${formatearFecha(t.fecha)}</td>
      <td>${t.hora}</td>
      <td>${escapar(t.dueno)}</td>
      <td>${escapar(t.vete)}</td>
      <td>${escapar(t.mascota)}</td>
      <td>${escapar(t.especie)}</td>
      <td>${escapar(t.motivo)}</td>
      <td>${etiquetaEstado(estado)}${botonCancelar}</td>
    `;
    tabla.appendChild(fila);
  });
}

inputFecha.addEventListener("change", cargarHorarios);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const turno = {
    id: Date.now(),
    solicitante: obtenerSolicitante(),
    estado: "pendiente",
    dueno: document.getElementById("dueno").value.trim(),
    mascota: document.getElementById("mascota").value.trim(),
    especie: document.getElementById("especie").value,
    vete: document.getElementById("vete").value, 
    fecha: inputFecha.value,
    hora: selectHora.value,
    motivo: document.getElementById("motivo").value.trim(),
  };

  
  const repetido = obtenerTurnos().some(
    t => t.fecha === turno.fecha && t.hora === turno.hora && estadoDe(t) !== "cancelado"
  );
  if (repetido) {
    mostrarMensaje("Ese horario ya fue tomado. Elegí otro.", "danger");
    cargarHorarios();
    return;
  }

  const turnos = obtenerTurnos();
  turnos.push(turno);
  guardarTurnos(turnos);

  mostrarMensaje(`Turno solicitado con ${turno.vete} para el ${formatearFecha(turno.fecha)} a las ${turno.hora}. Queda pendiente de confirmación.`, "success");
  form.reset();
  cargarHorarios();
  mostrarTurnos();
});

// Cancelar turno
tabla.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-id]");
  if (!boton) return;

  if (confirm("¿Cancelar este turno?")) {
    const id = Number(boton.dataset.id);
    const turnos = obtenerTurnos();
    const turno = turnos.find(t => t.id === id);
    if (!turno) return;

    turno.estado = "cancelado";
    guardarTurnos(turnos);
    cargarHorarios();
    mostrarTurnos();
  }
});


const hoy = new Date().toISOString().split("T")[0];
inputFecha.min = hoy; 
mostrarTurnos();