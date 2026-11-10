
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const cuerpoTabla = document.getElementById('cuerpo-tabla');
const spanVeterinarios = document.getElementById('Veterinarios'); 
const formulario = document.getElementById('formVeterinario');
const formEditar = document.getElementById('formEditar');
const modalElement = document.getElementById('modalEditar');
const modalEditar = modalElement ? new bootstrap.Modal(modalElement) : null;
let idEditando = null;

function guardarLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}



function mostrarVeterinarios() {
    cuerpoTabla.innerHTML = '';

    veterinarios.forEach((v) => {
        cuerpoTabla.innerHTML += `
            <tr>
                <td>${v.IdVeterinario}</td>
                <td>${v.nombre}</td>
                <td>${v.matricula}</td>
                <td>${v.especialidad}</td>
                <td>$${v.ValorConsulta}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarVeterinario('${v.IdVeterinario}')" type="button">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarVeterinario('${v.IdVeterinario}')" type="button">Eliminar</button>
                </td>
            </tr>
        `;
    });

    spanVeterinarios.textContent = veterinarios.length;
}

function eliminarVeterinario(id) {
    const index = veterinarios.findIndex(v => v.IdVeterinario === id);
    if (index !== -1 && confirm('¿Seguro que deseas eliminar este veterinario?')) {
        veterinarios.splice(index, 1);
        guardarLocalStorage();
        mostrarVeterinarios();
    }
}
window.eliminarVeterinario = eliminarVeterinario;

function editarVeterinario(id) {
    const v = veterinarios.find(item => item.IdVeterinario === id);
    if (!v) return;

    idEditando = id;
    document.getElementById('editNombre').value = v.nombre;
    document.getElementById('editMatricula').value = v.matricula;
    document.getElementById('editEspecialidad').value = v.especialidad;
    document.getElementById('editValorConsulta').value = v.ValorConsulta;

    if (modalEditar) modalEditar.show();
}
window.editarVeterinario = editarVeterinario;


if (formEditar) {
    formEditar.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const v = veterinarios.find(item => item.IdVeterinario === idEditando);
        if (v) {
            v.nombre = document.getElementById('editNombre').value.trim();
            v.matricula = document.getElementById('editMatricula').value.trim();
            v.especialidad = document.getElementById('editEspecialidad').value.trim();
            v.ValorConsulta = parseFloat(document.getElementById('editValorConsulta').value);

            guardarLocalStorage();
            mostrarVeterinarios();
            modalEditar.hide();
        }
    });
}


formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nuevoVeterinario = {
        IdVeterinario: crypto.randomUUID().slice(0, 8),
        nombre: document.getElementById('nombreVeterinario').value.trim(),
        matricula: document.getElementById('matricula').value.trim(),
        especialidad: document.getElementById('especialidad').value.trim(),
        ValorConsulta: parseFloat(document.getElementById('ValorConsulta').value)
    };

    veterinarios.push(nuevoVeterinario);
    guardarLocalStorage();
    mostrarVeterinarios();
    formulario.reset();
});

mostrarVeterinarios();