document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const startScreen = document.getElementById('start-screen');
    const instructionsScreen = document.getElementById('instructions-screen');
    const gameScreen = document.getElementById('game-screen');

    const playBtn = document.getElementById('play-btn');
    const readyBtn = document.getElementById('ready-btn');

    const circle1 = document.getElementById('circle-1');
    const circle2 = document.getElementById('circle-2');
    const timerDisplay = document.querySelector('.timer');
    const scoreCounter = document.querySelector('.score-counter');
    const victoryPopup = document.getElementById('victory-popup');
    const playAgainBtn = document.getElementById('play-again-btn');

    // --- Datos del Juego ---
    const allImages = [
        'Airampo.png', 'Arbusto.png', 'Bandurria.png', 'Cardón.png',
        'Chinchilla.png', 'Cóndor.png', 'Flamenco.png', 'Juncos.png',
        'Lagartija.png', 'Llama.png', 'Puma.png', 'Suri.png',
        'Vicuña.png', 'Vizcacha.png', 'Zorro.png'
    ];

    let currentRoundImages = [];
    let correctImage = '';
    let timerInterval;
    let score = 0;

    // --- Lógica de Transición de Pantallas ---
    playBtn.addEventListener('click', () => {
        startScreen.classList.remove('active');
        instructionsScreen.classList.add('active');
    });

    readyBtn.addEventListener('click', () => {
        instructionsScreen.classList.remove('active');
        gameScreen.classList.add('active');
        startGame();
    });

    // --- Lógica Principal del Juego (esqueleto) ---
    function startGame() {
        console.log("El juego ha comenzado");
        score = 1;
        // Aquí iniciaremos la primera ronda
        startRound();
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startRound() {
        circle1.innerHTML = '';
        circle2.innerHTML = '';

        const imagesPerCircle = 7; // 7 imágenes + 1 repetida = 8 total por círculo
        const shuffledImages = shuffle([...allImages]);

        // Seleccionar la imagen que se repetirá y las imágenes únicas
        correctImage = shuffledImages[0];
        const uniqueImages1 = shuffledImages.slice(1, imagesPerCircle);
        const uniqueImages2 = shuffledImages.slice(imagesPerCircle, imagesPerCircle * 2 - 1);

        // Crear los dos sets de imágenes y mezclarlos
        let circle1Images = shuffle([...uniqueImages1, correctImage]);
        let circle2Images = shuffle([...uniqueImages2, correctImage]);

        // Función para poblar un círculo
        const populateCircle = (circle, imageArray) => {
            imageArray.forEach(imgName => {
                const imgElement = document.createElement('img');
                imgElement.src = `assets/images/silu/${imgName}`;
                imgElement.classList.add('game-image');
                imgElement.dataset.name = imgName;
                
                // Posicionamiento aleatorio
                const posX = Math.random() * 70 + 10; // % dentro del círculo
                const posY = Math.random() * 70 + 10; // %
                imgElement.style.left = `${posX}%`;
                imgElement.style.top = `${posY}%`;
                imgElement.style.transform = `rotate(${Math.random() * 360}deg)`;

                imgElement.addEventListener('click', handleImageClick);
                circle.appendChild(imgElement);
            });
        };

        populateCircle(circle1, circle1Images);
        populateCircle(circle2, circle2Images);
    }

    function handleImageClick(event) {
        const clickedImage = event.target;
    
        // Evitar múltiples clics mientras se procesa una respuesta
        if (clickedImage.classList.contains('correct') || clickedImage.classList.contains('incorrect')) {
            return;
        }
    
        if (clickedImage.dataset.name === correctImage) {
            console.log(score)
            score++;
            scoreCounter.textContent = `${score} / 5`;
            document.querySelectorAll(`[data-name="${correctImage}"]`).forEach(img => img.classList.add('correct'));
    
            if (score >= 5) {
                // --- LÓGICA DE VICTORIA CORREGIDA ---
                setTimeout(() => {
                    gameScreen.classList.remove('active');
                    victoryPopup.classList.add('active');
                    
                    // Redirige a main.html después de 5 segundos
                    setTimeout(() => {
                        window.location.href = 'main.html';
                    }, 5000);
    
                }, 1000); // Espera 1 segundo para que se vea la última selección correcta
            } else {
                // Siguiente ronda
                setTimeout(() => {
                    startRound();
                }, 1000);
            }
        } else {
            clickedImage.classList.add('incorrect');
        }
    }


    function startTimer() {
        // Lógica del temporizador
    }

});