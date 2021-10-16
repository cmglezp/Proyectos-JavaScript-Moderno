// Variables
const formulario = document.querySelector('.container');

// Constructores
function Seguro(marca, year, seguro){
    this.marca = marca;
    this.year = year;
    this.tipo = seguro;
}

//  Interfas de Usuario
function UI() {}

// Realizar la cotizacion de los datos
Seguro.prototype.contizarSeguro = function() {
    /*
        Americano 1.15
        Asiatico 1.05
        3 Europeo 1.35
    */

    let cant, base = 2000;

    switch(this.marca){
        case 'Americano':
            cant = base * 1.15;
            break;
        case 'Asiatico':
            cant = base * 1.05;
            break;
        case 'Europeo':
            cant = base * 1.35;
            break;
        default:
            break;
    }

    // Cada year el costo del seguro se reduce en un 3%
    let diferencia = new Date().getFullYear() - this.year;
    diferencia *= 3;
    cant -= cant * diferencia / 100; 

    /*
        Si el seguro es basico se multiplica por un 30% mas
        Si el seguro es completo se multiplica por un 50% mas
    */

    cant = (this.tipo == 'Basico') ? cant * 1.3 : cant * 1.5;  

    return cant;
}



//  Llenando los years
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i >= min; i --){

        let option = document.createElement('option');
        option.textContent = i;
        option.value = i;

        selectYear.appendChild(option);
    }
}

// Muestras alertas en pantalla
UI.prototype.showMessage = (message, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error'){
        div.classList.add('error');
    }else{
        div.classList.add('correcto');
    }
    div.textContent = message;

    const spinner = document.querySelector('.spinner');
    if(tipo == 'correcto'){
        // Mostrar el spinner
        spinner.classList.remove('hidden');
        spinner.classList.add('visible');
    }
    

    // Incertar en el HTML
    formulario.insertBefore(div, document.querySelector('.container-submit'));

    //  Elimiar el mensaje del HTML
    setTimeout(() => {
        if(tipo == 'correcto'){
            //  Eliminar el spiner
            spinner.classList.remove('visible');
            spinner.classList.add('hidden');
        }
        div.remove();
    }, 3000);
}

UI.prototype.showResult = (total, seguro) => {
    
    const {marca, year, tipo} = seguro;

    // Crear el resultado
    const div = document.createElement('div');
    div.classList.add('result');
    div.innerHTML = `
        <p class = 'result-header'>TU RESUMEN</p>
        <p>Marca: <span> ${marca}</span></p>
        <p>Ano: <span> ${year}</span></p>
        <p>Tipo: <span> ${tipo}</span></p>
        <p>Total: <span> $${Math.round(total)}</span></p>
    `;

    setTimeout(() => {
        formulario.insertBefore(div, document.querySelector('.container-submit'));  
    }, 3000);
    
}


// Inciciar UI
const ui = new UI();



document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // Llenando los years 
    eventLiseners();
})



//  Lista de eventos
function eventLiseners() {
    formulario.addEventListener('submit', cotizarSeguro);
}


// Funciones
function cotizarSeguro(e) {
    e.preventDefault();
   
    const aux = document.querySelector('.result');
    if(aux)  aux.remove();
    
    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    // Leer el year seleccionado
    const year = document.querySelector('#year').value;

    // Leer el tipo de covertura
    const tipo = document.querySelector('input[name="seguro"]:checked').value;


    if(marca === '' || year === "" || tipo === ""){
        ui.showMessage('Todos los campos son obligatorios', 'error');
        return;
    }
    
    ui.showMessage('Cotizando...', 'correcto');

    // Instanciar el seguro
    const seguro = new Seguro(marca, year, tipo);
    const total = seguro.contizarSeguro();

    ui.showResult(total, seguro);

}


