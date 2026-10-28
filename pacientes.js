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


const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];


const cuerpoTabla = document.getElementById("cuerpo-tabla");
const pacientesInternados = document.getElementById("PacientesInternados"); 
const formulario = document.getElementById("formPaciente");


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

    
    pacientesInternados.textContent = pacientes.length;

    
    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", () => eliminarPaciente(btn.dataset.id));
    });

    
    document.querySelectorAll(".btn-editar").forEach(btn => {
        btn.addEventListener("click", () => editarPaciente(btn.dataset.id));
    });
}


function guardarLocalStorage() {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}


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


function editarPaciente(id) {
    const paciente = pacientes.find(p => p.IdMascota === id);
    if (paciente) {
        
        document.getElementById('altaMascota').value = paciente.tipoMascota;
        document.getElementById('nombreMascota').value = paciente.Nombre;
        document.getElementById('nombreDuenio').value = paciente.NombreDueno;
        document.getElementById('color').value = paciente.Color;
        document.getElementById('edad').value = paciente.Edad;
        document.getElementById('peso').value = paciente.Peso;

        
        eliminarPaciente(id);
    }
}


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


mostrarPacientes();
