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

// Apuntamos al tbody de la tabla en el HTML
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
            </tr>
        `;
    });

    pacientesInternados.textContent = pacientes.length;
    // (Ya quitamos la llamada infinita de aquí adentro)
}

function guardarLocalStorage() {
    localStorage.setItem('pacientes', JSON.stringify(pacientes));
}

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const nuevoPaciente = {
        IdMascota: crypto.randomUUID().slice(0, 8), // Cortamos el UUID para que sea más corto y prolijo
        tipoMascota: document.getElementById('altaMascota').value,
        Nombre: document.getElementById('nombreMascota').value.trim(), // Agregado .value
        NombreDueno: document.getElementById('nombreDuenio').value.trim(), // Agregado .value
        Color: document.getElementById('color').value,
        Edad: document.getElementById('edad').value,
        Peso: parseFloat(document.getElementById('peso').value)
    };

    pacientes.push(nuevoPaciente);
    guardarLocalStorage();
    mostrarPacientes();
    formulario.reset();
});

// Ejecutamos la función una sola vez al cargar la página para pintar lo que haya en el LocalStorage
mostrarPacientes();