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
        'https://drive.google.com/uc?id=1V4ZNrl8rMOvq0iHQyWjGv3uTSzguxGEN', 'https://drive.google.com/uc?id=1py_Z1t1oHylbI3sBqvwAw5TpFFFuCLkP', 'https://drive.google.com/uc?id=1kVBH9DznQ7I2EzzbCMQI7bKLBNnWsiP1', 'https://drive.google.com/uc?id=1AhIhdJzCBNBKUarJRHSjq63evlzuiXbG',
        'https://drive.google.com/uc?id=1UvJku7Hbfy0bfd39jViAiaGaL-g59z_D', 'https://drive.google.com/uc?id=10eD5nKWtXMso8GaJ5gByp4o-D3XRQhou', 'https://drive.google.com/uc?id=17oqx6clebuKf7-OlRgJ0ILK5m6eP62Cs', 'https://drive.google.com/uc?id=1qA2TgzXQz5dIL2VsTGgIF9dvofYuGlrr',
        'https://drive.google.com/uc?id=1hA4lBCnsBm-8s_rBXsqKHRKqOdrYP-Xa', 'https://drive.google.com/uc?id=13ZgSkq1QhZaVe6EM0G1zZ23dT4PU9Fo-', 'https://drive.google.com/uc?id=117k_RyXWgWWyIpLOslogeXcqEoDNatmZ', 'https://drive.google.com/uc?id=1A-RoZioU1n6Hwid0vQ1oZcRPIfpA5mbe',
        'https://drive.google.com/uc?id=186e7ijk_WntGEEm6u09cp0e9xDF2OaDV', 'https://drive.google.com/uc?id=17H1YPgIuobU7EtlkH7qvsvF3gaGWGqfE', 'https://drive.google.com/uc?id=1YJLvZE8Q5SE_cx6Od2HbacOsXiLjHcjO'
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
                imgElement.src = imgName;
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