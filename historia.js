// Historia clínica: registrar, listar y filtrar por paciente.

const CLAVE = "historias_clinicas";
const VETERINARIOS = ["Dra. Sofia Perez", "Dr. Juan Gomez", "Dr. Carlos Benitez", "Dra. Laura Acuña"];

const form = document.getElementById("formHistoria");
const selectVet = document.getElementById("veterinario");
const inputFecha = document.getElementById("fecha");
const filtro = document.getElementById("filtroPaciente");
const tabla = document.getElementById("tablaHistoria");
const sinRegistros = document.getElementById("sinRegistros");
const mensaje = document.getElementById("mensaje");

function obtener() {
  try { return JSON.parse(localStorage.getItem(CLAVE)) || []; }
  catch { return []; }
}

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function formatearFecha(iso) {
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

function cargarVeterinarios() {
  selectVet.innerHTML = '<optionvalue="">Seleccionar...</option>';
  VETERINARIOS.forEach(v => selectVet.add(new Option(v, v)));
}

function cargarFiltro() {
  const actual = filtro.value;
  const pacientes = [...new Set(obtener().map(h => h.paciente))].sort();
  filtro.innerHTML = '<option value="">Todos los pacientes</option>';
  pacientes.forEach(p => filtro.add(new Option(p, p)));
  if (pacientes.includes(actual)) filtro.value = actual;
}

function mostrar() {
  const historias = obtener()
    .filter(h => !filtro.value || h.paciente === filtro.value)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  sinRegistros.classList.toggle("d-none", historias.length > 0);
  tabla.innerHTML = historias.map(h => `
    <tr>
      <td>${formatearFecha(h.fecha)}</td>
      <td><strong>${escapar(h.paciente)}</strong></td>
      <td>${escapar(h.veterinario)}</td>
      <td>${escapar(h.motivo)}</td>
      <td>${escapar(h.diagnostico)}</td>
      <td>${escapar(h.tratamiento)}</td>
      <td>${h.peso ? h.peso + " kg" : "-"}</td>
    </tr>`).join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const historias = obtener();
  historias.push({
    paciente: document.getElementById("paciente").value.trim(),
    veterinario: selectVet.value,
    fecha: inputFecha.value,
    peso: document.getElementById("peso").value,
    motivo: document.getElementById("motivo").value.trim(),
    diagnostico: document.getElementById("diagnostico").value.trim(),
    tratamiento: document.getElementById("tratamiento").value.trim()
  });
  localStorage.setItem(CLAVE, JSON.stringify(historias));

  mensaje.textContent = "Consulta guardada exitosamente.";
  mensaje.className = "d-block mb-2 text-success";

  form.reset();
  inputFecha.value = new Date().toLocaleDateString("en-CA");
  cargarFiltro();
  mostrar();
});

filtro.addEventListener("change", mostrar);

inputFecha.value = new Date().toLocaleDateString("en-CA");
cargarVeterinarios();
cargarFiltro();
mostrar();