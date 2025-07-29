document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const victoryPopup = document.getElementById('victory-popup');
    const startBtn = document.getElementById('start-btn');
    const readyBtn = document.getElementById('ready-btn');
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.querySelector('.timer-display');

    // Configuración del juego con imágenes de minerales
    const cardData = [
        { name: 'TURMALINA NEGRA', image: '3. Turmalina Negra.png' },
        { name: 'CUARZO BLANCO', image: '4. Cuarzo Blanco.png' },
        { name: 'MALAQUITA', image: '5._Malaquita-removebg-preview.png' },
        { name: 'YESO', image: '8._Yeso-removebg-preview.png' },
        { name: 'CALCITA ROSADA', image: '9._Calcita_Rosada_1-removebg-preview.png' },
        { name: 'GALENA', image: '13._galena-removebg-preview.png' }
    ];

    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let canFlip = false;
    let timerInterval;
    let timeLeft = 60; // 60 segundos para el juego

    // --- Funciones del Juego ---

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function createGameBoard() {
        cards = [...cardData, ...cardData];
        shuffle(cards);
        gameBoard.innerHTML = '';
        matchedPairs = 0;

        cards.forEach(cardInfo => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.name = cardInfo.name;

            cardElement.innerHTML = `
                <div class="card-face card-front">
                    <img src="assets/images/cards/${cardInfo.image}" alt="${cardInfo.name}">
                    <div class="card-name">${cardInfo.name}</div>
                </div>
                <div class="card-face card-back"></div>
            `;
            gameBoard.appendChild(cardElement);
            cardElement.addEventListener('click', () => handleCardClick(cardElement));
        });
    }

    function handleCardClick(card) {
        if (!canFlip || !card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.remove('flipped'); // Show the mineral
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkForMatch();
        }
    }

    function checkForMatch() {
        canFlip = false;
        const [card1, card2] = flippedCards;

        if (card1.dataset.name === card2.dataset.name) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === cardData.length) {
                winGame();
            }
        } else {
            // No es un match, voltearlas de nuevo
            setTimeout(() => {
                card1.classList.add('flipped');
                card2.classList.add('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    function startMemorizePhase() {
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        createGameBoard(); // Cards are face-up by default

        timerDisplay.textContent = 'Memoriza las posiciones';
        readyBtn.style.display = 'block';
        canFlip = false; // Can't flip during memorization
    }

    function startGame() {
        readyBtn.style.display = 'none';
        // Flip all cards face-down to start the game
        document.querySelectorAll('.card:not(.matched)').forEach(card => card.classList.add('flipped'));
        canFlip = true;
        startTimer();
    }

    function startTimer() {
        timeLeft = 60;
        timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('¡Se acabó el tiempo! Inténtalo de nuevo.');
                initGame();
            }
        }, 1000);
    }

    function winGame() {
        clearInterval(timerInterval);
        // Pequeño delay para asegurar que la animación de la última carta termine
        setTimeout(() => {
            victoryPopup.classList.add('active');

            // Redirigir después de 10 segundos
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 10000);
        }, 700); // Un poco más que la duración de la animación (0.6s)
    }

    function initGame() {
        victoryPopup.classList.remove('active');
        gameScreen.classList.remove('active');
        startScreen.classList.add('active');
        if (timerInterval) clearInterval(timerInterval);
    }

    // --- Event Listeners ---
    startBtn.addEventListener('click', startMemorizePhase);
    readyBtn.addEventListener('click', startGame);


    // Inicializar el juego por primera vez
    initGame();
});