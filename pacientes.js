/*
const pacientes = [
    {
        tipoMascota: "PequeñOS animales",
        Nombre: "Max",
        duenio: {
            NombreDuenio: "Juan Pérez",
            Direccion: "Calle Falsa 123",
            Telefono: "123-456-7890",
            edad: 30,
            
        },
        
        Color : "Marrón",
        Edad: 5,
        Peso: 25,            
    },
    {
        tipoMascota: "exoticos",
        Nombre: "Luna",
        NombreDueno: "María López",
        Color: "Blanco",
        Edad: 3,
        Peso: 10,
    },
    {
        tipoMascota: "Ovino",
        Nombre: "Bobby",
        NombreDueno: "Carlos García",
        Color: "Blanco",
        Edad: 2,
        Peso: 15,
    }
];*/

// Recuperar pacientes desde LocalStorage
const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

// Referencias a elementos del DOM
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const pacientesInternados = document.getElementById("PacientesInternados"); 
const formulario = document.getElementById("formPaciente");

// Mostrar pacientes en la tabla
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
                    <button class="btn btn-warning btn-sm btn-editar" data-id="${paciente.IdMascota}" type="button">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-id="${paciente.IdMascota}" type="button">Eliminar</button>
                </td>
            </tr>
        `;
    });

    // Actualizar contador
    pacientesInternados.textContent = pacientes.length;

    // Activar botones eliminar
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarPaciente(btn.dataset.id));
    });

    // Activar botones editar
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => editarPaciente(btn.dataset.id));
    });
}

// Guardar en LocalStorage
function guardarLocalStorage() {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

// Función para eliminar paciente
function eliminarPaciente(id) {
    const index = pacientes.findIndex(p => p.IdMascota === id);
    if (index !== -1) {
        if (confirm("¿Seguro que deseas eliminar este paciente?")) {
            pacientes.splice(index, 1);
            guardarLocalStorage();
            mostrarPacientes();
        }
    }
}

// Función para editar paciente
function editarPaciente(id) {
    const paciente = pacientes.find(p => p.IdMascota === id);
    if (paciente) {
        // Cargar datos en el formulario
        document.getElementById('altaMascota').value = paciente.tipoMascota;
        document.getElementById('nombreMascota').value = paciente.Nombre;
        document.getElementById('nombreDuenio').value = paciente.NombreDueno;
        document.getElementById('color').value = paciente.Color;
        document.getElementById('edad').value = paciente.Edad;
        document.getElementById('peso').value = paciente.Peso;

        // Eliminar el paciente viejo para reemplazarlo al guardar
        eliminarPaciente(id);
    }
}

// Evento submit del formulario
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nuevoPaciente = {
        IdMascota: crypto.randomUUID().slice(0, 8), 
        tipoMascota: document.getElementById('altaMascota').value,
        Nombre: document.getElementById('nombreMascota').value.trim(), 
        NombreDueno: document.getElementById('nombreDuenio').value.trim(), 
        Color: document.getElementById('color').value,
        Edad: document.getElementById('edad').value,
        Peso: parseFloat(document.getElementById('peso').value)
    };

    pacientes.push(nuevoPaciente);
    guardarLocalStorage();
    mostrarPacientes();
    formulario.reset();
});

// Inicializar tabla al cargar
mostrarPacientes();
