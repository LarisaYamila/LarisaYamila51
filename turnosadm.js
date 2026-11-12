const CLAVE_TURNOS = "turnos";

const tabla = document.getElementById("tablaTurnos");
const sinTurnos = document.getElementById("sinTurnos");
const filtroEstado = document.getElementById("filtroEstado");
const spanPendientes = document.getElementById("contadorPendientes");
const spanConfirmados = document.getElementById("contadorConfirmados");
const spanCancelados = document.getElementById("contadorCancelados");


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


function formatearFecha(iso) {
  if (!iso) return "";
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function etiquetaEstado(estado) {
  const colores = { pendiente: "warning", confirmado: "success", cancelado: "secondary" };
  const color = colores[estado] || "secondary";
  return `<span class="badge text-bg-${color}">${escapar(estado || "pendiente")}</span>`;
}


function actualizarContadores(turnos) {
  const pendientes = turnos.filter(t => (!t.estado || t.estado === "pendiente")).length;
  const confirmados = turnos.filter(t => t.estado === "confirmado").length;
  const cancelados = turnos.filter(t => t.estado === "cancelado").length;

  if (spanPendientes) spanPendientes.textContent = pendientes;
  if (spanConfirmados) spanConfirmados.textContent = confirmados;
  if (spanCancelados) spanCancelados.textContent = cancelados;
}


function mostrarTurnosAdmin() {
  const todosLosTurnos = obtenerTurnos().sort((a, b) =>
    (a.fecha + a.hora).localeCompare(b.fecha + b.hora)
  );

  actualizarContadores(todosLosTurnos);

  const filtro = filtroEstado ? filtroEstado.value : "";
  const turnosFiltrados = todosLosTurnos.filter(t => {
    const estadoActual = t.estado || "pendiente";
    if (filtro === "") return true;
    return estadoActual === filtro;
  });

  tabla.innerHTML = "";
  sinTurnos.classList.toggle("d-none", turnosFiltrados.length > 0);

  turnosFiltrados.forEach(t => {
    const estadoActual = t.estado || "pendiente";
    const fila = document.createElement("tr");
    
    

    fila.innerHTML = `
      <td>${formatearFecha(t.fecha)}</td>
      <td>${t.hora}</td>
      <td>${escapar(t.vete)}</td>
      <td>${escapar(t.solicitante || "Anónimo")}</td>
      <td>${escapar(t.dueno)}</td>
      <td>${escapar(t.mascota)}</td>
      <td>${escapar(t.especie)}</td>
      <td>${escapar(t.motivo)}</td>
      <td>${etiquetaEstado(estadoActual)}</td>
      <td>
        <div class="btn-group btn-group-sm" role="group">
          ${estadoActual !== "confirmado" ? `<button class="btn btn-success btn-accion" data-id="${t.id}" data-accion="confirmar">Confirmar</button>` : ""}
          ${estadoActual !== "cancelado" ? `<button class="btn btn-danger btn-accion" data-id="${t.id}" data-accion="cancelar">Cancelar</button>` : ""}
        </div>
      </td>
    `;
    tabla.appendChild(fila);
  });
}


if (filtroEstado) {
  filtroEstado.addEventListener("change", mostrarTurnosAdmin);
}

tabla.addEventListener("click", (event) => {
  const boton = event.target.closest("button[data-id]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;
  const turnos = obtenerTurnos();
  const turno = turnos.find(t => t.id === id);

  if (!turno) return;

  if (accion === "confirmar") {
    turno.estado = "confirmado";
    guardarTurnos(turnos);
    mostrarTurnosAdmin();
  } else if (accion === "cancelar") {
    if (confirm("¿Estás seguro de cancelar este turno?")) {
      turno.estado = "cancelado";
      guardarTurnos(turnos);
      mostrarTurnosAdmin();
    }
  }
});



mostrarTurnosAdmin();
