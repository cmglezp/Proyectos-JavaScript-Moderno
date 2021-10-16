//  Variables y selectores
const formulario = document.querySelector('.container__formulario');
const listGastos = document.querySelector('.list-group');




// Clases
class Presupuesto{
    constructor(total){
        this.presupuesto = Number(total);
        this.restante = this.presupuesto;
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
    }

    calcGasto(){
        let gastado = 0;
        this.gastos.forEach(g => gastado += g.cantidad);
        return gastado;
    }    
    getPresupuesto(){
        return this.presupuesto;
    }
}
class UI{
    insertarPresupuesto(cantidad) {
        const{presupuesto, restante} = cantidad;
        document.querySelector('#presupuesto span').textContent = presupuesto;
        document.querySelector('#restante span').textContent = restante;
    }

    showMessage(message, tipo){
        const div = document.createElement('div');
        div.classList.add(tipo);
        div.textContent = message;

        formulario.insertBefore(div, document.querySelector('.formulario-label'));
        setTimeout(() => {
            div.remove();
        }, 3000);
    }

    mostrarGasto(gastos){

        clearHTML();

        // Iterar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;
            
            //  Crear el bloque de HTML
            const nuevoGasto = document.createElement('li');
            nuevoGasto.classList.add('style-gasto');
            nuevoGasto.dataset.id = id;  // esto es lo mismo que esto: nuevoGasto.setAttribute('data-id', id);
    
            nuevoGasto.innerHTML = `${nombre} <span class = 'style-gasto-cantidad'>$${cantidad}</span>`;
            
            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('style-gasto-boton');
            btnBorrar.innerHTML = 'Borrar &times;';        
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            };
            
            // Mostrar gasto en el HTML
            nuevoGasto.appendChild(btnBorrar);
            listGastos.insertBefore(nuevoGasto, listGastos.firstChild);
        });

    }

    updateRestante(presupuesto, gastado){
        const restante = presupuesto - gastado;
        const div = document.querySelector('#restante span');
        div.textContent = restante;

        if(presupuesto / 2 < restante) div.parentElement.dataset.color = 'bastante-capital';

        // Comprobando 50%
        if(presupuesto / 2 > restante) div.parentElement.dataset.color = 'poco-capital';

        //  Comprobando 25%
        if(presupuesto / 4 > restante) div.parentElement.dataset.color = 'muy-poco-capital';

        // Comprobando <= 0
        if(restante <= 0){
            ui.showMessage('El presupuesto se ha agotado', 'error');
            document.querySelector('.formulario-submit').disabled = true;
        }else{
            document.querySelector('.formulario-submit').disabled = false;
        }
    }
}


const ui = new UI();
let presupuesto;



// Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto("Cual es tu presupuesto?"))
    formulario.addEventListener('submit', agregarGasto);
}


// Funciones

// Limpiar HTML del la lista de gastos
function clearHTML(){
    while(listGastos.firstChild){
        listGastos.firstChild.remove();
    }
}

    // Preguntar por el presupuesto al cargar la paguina
function preguntarPresupuesto(question){

    const presupuestoUsuario = prompt(question);

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario)  || presupuestoUsuario <= 0){
        preguntarPresupuesto("No introducistes un numero. Cual es tu presupuesto?");
        return;
        // window.location.reload();
    }

    //  Instanciar Presupuesto Valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}



    // Validar formulario y agregar gastos
function agregarGasto(e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Comprobando que los campos no esten vacios
    if(nombre == '' || cantidad == 0){
        ui.showMessage('Ambos campos son obligatorios.', 'error');
        return;
    }

    //  Crear un nuevo gasto
    const gasto = {nombre, cantidad, id: Date.now()};
    // anadir el nuevo gasto
    presupuesto.nuevoGasto( gasto );
    
    // Mensaje Correcto
    ui.showMessage('Gasto agregado Correctamente', 'correcto');

    // Imprimir los gastos
    const {gastos} = presupuesto;
    ui.mostrarGasto(gastos);
    ui.updateRestante(presupuesto.getPresupuesto(), presupuesto.calcGasto());

    // Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){

    const {gastos} = presupuesto;
    
    const newGastos = gastos.filter(iGasto => {
        return Number(iGasto.id != id);
    })

    presupuesto.gastos = newGastos;
    ui.mostrarGasto(presupuesto.gastos);
    ui.updateRestante(presupuesto.getPresupuesto(), presupuesto.calcGasto());
}