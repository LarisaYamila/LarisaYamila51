const CLAVE_HISTORIA = "historias_clinicas";
const CLAVE_TURNOS = "turnos";

const form = document.getElementById("formHistoria");
const inputPaciente = document.getElementById("paciente");
const listaPacientes = document.getElementById("listaPacientes");
const selectVeterinario = document.getElementById("veterinario");
const inputFecha = document.getElementById("fecha");
const inputPeso = document.getElementById("peso");
const inputMotivo = document.getElementById("motivo");
const inputDiagnostico = document.getElementById("diagnostico");
const inputTratamiento = document.getElementById("tratamiento");
const inputObservaciones = document.getElementById("observaciones");
const mensaje = document.getElementById("mensaje");

const tablaHistoria = document.getElementById("tablaHistoria");
const sinRegistros = document.getElementById("sinRegistros");
const filtroPaciente = document.getElementById("filtroPaciente");
const avisoDatos = document.getElementById("avisoDatos");



let editandoId = null;


const VETERINARIOS_DISPONIBLES = [
  "Dra. Sofia Perez",
  "Dr. Juan Gomez",
  "Dr. Carlos Benitez",
  "Dra. Laura Acuña"
];


function obtenerHistorias() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_HISTORIA)) || [];
  } catch {
    return [];
  }
}

function guardarHistorias(historias) {
  localStorage.setItem(CLAVE_HISTORIA, JSON.stringify(historias));
}

function obtenerTurnos() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_TURNOS)) || [];
  } catch {
    return [];
  }
}


function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = "d-block mb-2 text-" + tipo;
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


function cargarSelectsYListas() {
  const turnos = obtenerTurnos();

  
  const pacientesUnicos = [...new Set(turnos.map(t => t.mascota).filter(Boolean))].sort();

  
  listaPacientes.innerHTML = "";
  filtroPaciente.innerHTML = '<option value="">Todos los pacientes</option>';
  
  pacientesUnicos.forEach(paciente => {
    const optionData = document.createElement("option");
    optionData.value = paciente;
    listaPacientes.appendChild(optionData);

    const optionFiltro = document.createElement("option");
    optionFiltro.value = paciente;
    optionFiltro.textContent = paciente;
    filtroPaciente.appendChild(optionFiltro);
  });

  if (pacientesUnicos.length === 0) {
    avisoDatos.textContent = "Aviso: No hay pacientes registrados en los turnos todavía. Podés escribir el nombre manualmente.";
    avisoDatos.classList.remove("d-none");
  } else {
    avisoDatos.classList.add("d-none");
  }

  


  selectVeterinario.innerHTML = '<option value="">Seleccionar...</option>';
  VETERINARIOS_DISPONIBLES.forEach(vete => {
    const option = document.createElement("option");
    option.value = vete;
    option.textContent = vete;
    selectVeterinario.appendChild(option);
  });
}


function mostrarHistoriaClinica() {
  const historias = obtenerHistorias().sort((a, b) => b.fecha.localeCompare(a.fecha));
  const pacienteFiltro = filtroPaciente.value;

  const historiasFiltradas = historias.filter(h => {
    if (!pacienteFiltro) return true;
    return h.paciente.toLowerCase() === pacienteFiltro.toLowerCase();
  });

  tablaHistoria.innerHTML = "";
  sinRegistros.classList.toggle("d-none", historiasFiltradas.length > 0);

  historiasFiltradas.forEach(h => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${formatearFecha(h.fecha)}</td>
      <td><strong>${escapar(h.paciente)}</strong></td>
      <td>${escapar(h.veterinario)}</td>
      <td>${escapar(h.motivo)}</td>
      <td>${escapar(h.diagnostico)}</td>
      <td>${escapar(h.tratamiento)}</td>
      <td>${h.peso ? h.peso + " kg" : "-"}</td>
      <td>
        <div class="btn-group btn-group-sm" role="group">
          <button class="btn btn-warning btn-editar" data-id="${h.id}">Editar</button>
          <button class="btn btn-danger btn-borrar" data-id="${h.id}">Borrar</button>
        </div>
      </td>
    `;
    tablaHistoria.appendChild(fila);
  });
}




form.addEventListener("submit", (event) => {
  event.preventDefault();

  const historias = obtenerHistorias();

  const nuevaConsulta = {
    id: editandoId ? editandoId : Date.now(),
    paciente: inputPaciente.value.trim(),
    veterinario: selectVeterinario.value,
    fecha: inputFecha.value,
    peso: inputPeso.value ? Number(inputPeso.value) : null,
    motivo: inputMotivo.value.trim(),
    diagnostico: inputDiagnostico.value.trim(),
    tratamiento: inputTratamiento.value.trim(),
    observaciones: inputObservaciones.value.trim()
  };

  if (editandoId) {
    
    const index = historias.findIndex(h => h.id === editandoId);
    if (index !== -1) {
      historias[index] = nuevaConsulta;
      guardarHistorias(historias);
      mostrarMensaje("Historia clínica actualizada exitosamente.", "success");
    }
    editandoId = null;
    form.querySelector("button[type='submit']").textContent = "Guardar consulta";
  } else {
    
    historias.push(nuevaConsulta);
    guardarHistorias(historias);
    mostrarMensaje("Consulta guardada exitosamente.", "success");
  }

  form.reset();
  
  inputFecha.value = new Date().toISOString().split("T")[0];
  
  cargarSelectsYListas();
  mostrarHistoriaClinica();
});




tablaHistoria.addEventListener("click", (event) => {
  const boton = event.target;
  const id = Number(boton.dataset.id);
  if (!id) return;

  const historias = obtenerHistorias();

  if (boton.classList.contains("btn-borrar")) {
    if (confirm("¿Estás seguro de eliminar este registro de la historia clínica?")) {
      const historiasFiltradas = historias.filter(h => h.id !== id);
      guardarHistorias(historiasFiltradas);
      mostrarHistoriaClinica();
      mostrarMensaje("Registro eliminado.", "secondary");
    }
  } else if (boton.classList.contains("btn-editar")) {
    const consulta = historias.find(h => h.id === id);
    if (!consulta) return;

    


    inputPaciente.value = consulta.paciente;
    selectVeterinario.value = consulta.veterinario;
    inputFecha.value = consulta.fecha;
    inputPeso.value = consulta.peso || "";
    inputMotivo.value = consulta.motivo;
    inputDiagnostico.value = consulta.diagnostico;
    inputTratamiento.value = consulta.tratamiento;
    inputObservaciones.value = consulta.observaciones || "";

    editandoId = id;
    form.querySelector("button[type='submit']").textContent = "Actualizar consulta";
    window.scrollTo({ top: 0, behavior: 'smooth' });
    mostrarMensaje("Modificando consulta seleccionada...", "warning");
  }
});


filtroPaciente.addEventListener("change", mostrarHistoriaClinica);


inputFecha.value = new Date().toISOString().split("T")[0]; // Settea la fecha actual por defecto
cargarSelectsYListas();
mostrarHistoriaClinica();