let veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const cuerpoTabla = document.getElementById('cuerpo-tabla');
const spanVeterinarios = document.getElementById('Veterinarios'); // Nombre consistente para el contador
const formulario = document.getElementById('formVeterinario');

function MostrarVeterinarios() {
    cuerpoTabla.innerHTML = '';

    veterinarios.forEach((veterinario) => {
        cuerpoTabla.innerHTML += `
            <tr>
                <td>${veterinario.IdVeterinario}</td>
                <td>${veterinario.nombre}</td>
                <td>${veterinario.matricula}</td>
                <td>${veterinario.especialidad}</td>
                <td>$${veterinario.ValorConsulta}</td>
            </tr>
        `;
    });

    if (spanVeterinarios) {
        spanVeterinarios.textContent = veterinarios.length;
    }
}

function guardarLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));
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
    MostrarVeterinarios();
    formulario.reset();
});


MostrarVeterinarios();