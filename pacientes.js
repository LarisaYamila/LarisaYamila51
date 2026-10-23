
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
];
const listaPacientes = document.getElementById("lista-pacientes");
const pacientesInternados = document.getElementById("PacientesInternados"); // corregido id

function mostrarPacientes() {
  pacientes.forEach((paciente) => {
    listaPacientes.innerHTML += `
      <li class="list-group-item">
        ${paciente.tipoMascota} - ${paciente.Nombre} - ${paciente.NombreDueno || paciente.duenio?.NombreDuenio || ""}
      </li>`;
  });

  pacientesInternados.textContent = `Total: ${pacientes.length}`;
}

mostrarPacientes();





