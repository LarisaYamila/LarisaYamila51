
const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

const cuerpoTabla = document.getElementById("cuerpo-tabla");
const pacientesInternados = document.getElementById("PacientesInternados");
const formulario = document.getElementById("formPaciente");
const formeditar = document.getElementById('formEditar');
const modalElement = document.getElementById('modalEditar');
const modalEditar = modalElement ? new bootstrap.Modal(modalElement) : null;
let idPacienteEditar = null;

function guardarLocalStorage() {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

function mostrarPacientes() {
    cuerpoTabla.innerHTML = '';

    pacientes.forEach((paciente) => {
        const duenio = paciente.NombreDueno;

        cuerpoTabla.innerHTML += `
            <tr>
                <td>${paciente.IdMascota}</td>
                <td>${paciente.Nombre}</td>
                <td>${paciente.tipoMascota}</td>
                <td>${duenio}</td>
                <td>${paciente.Color}</td>
                <td>${paciente.Edad}</td>
                <td>${paciente.Peso}</td>
                <td>
                    <button class="btn btn-warning btn-sm btn-editar" onclick="editarPaciente('${paciente.IdMascota}')" type="button">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" onclick="eliminarPaciente('${paciente.IdMascota}')" type="button">Eliminar</button>
                </td>
            </tr>
        `;
    });

    pacientesInternados.textContent = pacientes.length;
}

function eliminarPaciente(id) {
    const index = pacientes.findIndex(paciente => paciente.IdMascota === id);
    if (index !== -1) {
        if (confirm("¿Seguro que deseas eliminar este paciente?")) {
            pacientes.splice(index, 1);
            guardarLocalStorage();
            mostrarPacientes();
        }
    }
}

window.eliminarPaciente = eliminarPaciente;

function editarPaciente(id) {
    idPacienteEditar = id;
    const paciente = pacientes.find((paciente) => paciente.IdMascota === id);
    if (!paciente) return;

    document.getElementById('editaltaMascota').value = paciente.altaMascota || '';
    document.getElementById('editipoMascota').value = paciente.tipoMascota;
    document.getElementById('editnombreMascota').value = paciente.Nombre;
    document.getElementById('editnombreDuenio').value = paciente.NombreDueno;
    document.getElementById('editcolor').value = paciente.Color;
    document.getElementById('editedad').value = paciente.Edad;
    document.getElementById('editpeso').value = paciente.Peso;

    if (modalEditar) modalEditar.show();
}

window.editarPaciente = editarPaciente;

if (formeditar) {
    formeditar.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const paciente = pacientes.find((p) => p.IdMascota === idPacienteEditar);

        if (paciente) {
            paciente.altaMascota = document.getElementById('editaltaMascota').value;
            paciente.Nombre = document.getElementById('editnombreMascota').value.trim();
            paciente.tipoMascota = document.getElementById('editipoMascota').value.trim();
            paciente.NombreDueno = document.getElementById('editnombreDuenio').value.trim();
            paciente.Color = document.getElementById('editcolor').value.trim();
            paciente.Edad = document.getElementById('editedad').value;
            paciente.Peso = parseFloat(document.getElementById('editpeso').value);

            guardarLocalStorage();
            mostrarPacientes();
            modalEditar.hide();
        }
    });
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nuevoPaciente = {
        IdMascota: crypto.randomUUID().slice(0, 8),
        altaMascota: document.getElementById('altaMascota').value,
        tipoMascota: document.getElementById('tipoMascota').value.trim(),
        Nombre: document.getElementById('nombreMascota').value.trim(),
        NombreDueno: document.getElementById('nombreDuenio').value.trim(),
        Color: document.getElementById('color').value.trim(),
        Edad: document.getElementById('edad').value,
        Peso: parseFloat(document.getElementById('peso').value)
    };

    pacientes.push(nuevoPaciente);
    guardarLocalStorage();
    mostrarPacientes();
    formulario.reset();
});

mostrarPacientes();