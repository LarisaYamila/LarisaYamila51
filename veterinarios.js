
let veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];
let idEditando = null; 

const cuerpoTabla = document.getElementById('cuerpo-tabla');
const spanVeterinarios = document.getElementById('Veterinarios'); 
const formulario = document.getElementById('formVeterinario');

function MostrarVeterinarios() {
    if (!cuerpoTabla) return;
    cuerpoTabla.innerHTML = '';

    veterinarios.forEach((veterinario) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${veterinario.IdVeterinario}</td>
            <td>${veterinario.nombre}</td>
            <td>${veterinario.matricula}</td>
            <td>${veterinario.especialidad}</td>
            <td>$${veterinario.ValorConsulta}</td>
            <td>
              <button class="btn btn-warning btn-sm btn-editar" data-id="${veterinario.IdVeterinario}" type="button">Editar</button>
              <button class="btn btn-danger btn-sm btn-eliminar" data-id="${veterinario.IdVeterinario}" type="button">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    if (spanVeterinarios) {
        spanVeterinarios.textContent = veterinarios.length;
    }

    
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', (e) => editarVeterinario(e.target.dataset.id));
    });

    document.querySelectorAll('.btn-eliminar').forEach(btn => {
        btn.addEventListener('click', (e) => eliminarVeterinario(e.target.dataset.id));
    });
}

function guardarLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
}

if (formulario) {
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();

        const nombre = document.getElementById('nombreVeterinario').value.trim();
        const matricula = document.getElementById('matricula').value.trim();
        const especialidad = document.getElementById('especialidad').value.trim();
        const ValorConsulta = parseFloat(document.getElementById('ValorConsulta').value);

        if (idEditando) {
            const v = veterinarios.find(item => item.IdVeterinario === idEditando);
            if (v) {
                v.nombre = nombre;
                v.matricula = matricula;
                v.especialidad = especialidad;
                v.ValorConsulta = ValorConsulta;
            }
            idEditando = null; 
        } else {
            const nuevoVeterinario = {
                IdVeterinario: crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).substring(2, 10), 
                nombre: nombre,
                matricula: matricula,
                especialidad: especialidad,
                ValorConsulta: ValorConsulta
            };
            veterinarios.push(nuevoVeterinario);
        }

        guardarLocalStorage(); 
        MostrarVeterinarios();
        formulario.reset();
    });
}

function editarVeterinario(id) {
    const v = veterinarios.find(item => item.IdVeterinario === id);
    if (v) {
        document.getElementById('nombreVeterinario').value = v.nombre;
        document.getElementById('matricula').value = v.matricula;
        document.getElementById('especialidad').value = v.especialidad;
        document.getElementById('ValorConsulta').value = v.ValorConsulta;
        idEditando = id;
    }
}

function eliminarVeterinario(id) {
    if (confirm("¿Seguro que deseas eliminar este veterinario?")) {
        veterinarios = veterinarios.filter(item => item.IdVeterinario !== id);
        guardarLocalStorage();
        MostrarVeterinarios();
    }
}


MostrarVeterinarios();