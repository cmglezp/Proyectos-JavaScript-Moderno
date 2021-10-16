// Variables
const formulario = document.querySelector('.others-tweet');
const listaTweet = document.querySelector('.show-tweets');
let tweets = [];


// Event Liseners
formulario.addEventListener('submit', addTweet);
document.querySelector('.tweet-tweet').addEventListener('keydown',e => {
    if(e.keyCode == '13')
        addTweet(e);
});

// Cuando de recarga la paguina
document.addEventListener('DOMContentLoaded', () => {
    tweets = JSON.parse(localStorage.getItem('tweets')) || [];
    showTweets();
})



//Funciones
function addTweet(e){
    e.preventDefault();
    const tweet = document.querySelector(".tweet-tweet").value;

    // Validacion
    if(tweet == ''){
        showMessageError('Un tweet no puede ir vacio');
        return;
    }

    const tweetObj = {
        id: Date.now(),
        tweet
    }

    //  Anadir al arreglo de tweets
    tweets = [...tweets, tweetObj];

    // Mostrar tweet
    showTweets();

    // Reiniciar el formulario
    formulario.reset();  
}

function showMessageError(error){

    // console.log(formulario.lastChild.classList.conteins('error'));

    const messageError = document.createElement('p');
    messageError.textContent = error;
    messageError.classList.add('error');

    //  Insertar mensaje de error
    formulario.appendChild(messageError);

    //  Eliminar mensaje de error despues de 3s
    setTimeout(() => {messageError.remove();}, 3000);
}

// Mostrar los Tweets
function showTweets(){
    if(tweets.length <= 0){
        listaTweet.innerHTML = '';
        return;
    }

    //  Limpiar HTML
    clearTweets();

    // Mostrar los tweets
    tweets.forEach(tweet => {
        // Agregar un boton para eliminar Tweet
        const btnRemove = document.createElement('a');
        btnRemove.classList.add('remove-tweet');
        btnRemove.textContent = 'X';

        // Crear evento para el boton de Eliminar
        btnRemove.addEventListener('click', RemoveTweet);


        //  Crear el HTML
        const li = document.createElement('li');
        li.textContent = tweet.tweet;
        li.id = tweet.id;
        li.classList.add('style-list');
        li.appendChild(btnRemove);
        listaTweet.appendChild(li);




    })

    syncStorage();
}

// Limpiar el HTML
function clearTweets(){
    while(listaTweet.firstChild)
        listaTweet.removeChild(listaTweet.firstChild);
}


// Sincronizar los tweets con el el localStorage
function syncStorage(){
    localStorage.setItem('tweets', JSON.stringify(tweets));
}


// Eliminar un tweet
function RemoveTweet(e){
    onlyTweet = e.target.parentElement;

    tweets = tweets.filter(iTweet => iTweet.id != onlyTweet.id);

    localStorage.setItem('tweets', JSON.stringify(tweets));
    showTweets();

}
