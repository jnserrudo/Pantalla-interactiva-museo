document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.map-container');
    if (!container) return; // Exit if map container not found

    const mapImage = document.querySelector('.map-image');
    const buttons = document.querySelectorAll('.interactive-button[data-popup-target]');
    const introGeo = document.getElementById('intro_geo');
    const backToMapCards = document.querySelectorAll('.volver-mapa-card');

    // Hide the map until the intro video is done
    if (container) container.style.visibility = 'hidden';

    // --- Intro Video Handling ---
    if (introGeo) {
        introGeo.addEventListener('ended', fadeOutVideo);
        introGeo.addEventListener('error', fadeOutVideo); // Skip if video fails
    } else {
        // If no video, show map immediately
        showMap();
    }

    function fadeOutVideo() {
        if (introGeo) {
            introGeo.classList.add('fade-out');
            // Wait for the fade-out animation to finish before showing the map
            introGeo.addEventListener('animationend', showMap);
        }
    }

    function showMap() {
        if (container) container.style.visibility = 'visible';
        if (introGeo) introGeo.style.display = 'none';
        
        let isDragging = false;
        let startX, startY;
        let currentX = 0, currentY = 0;
        let dragStartX = 0, dragStartY = 0;

        function updatePositions() {
            const transform = `translate(${currentX}px, ${currentY}px)`;
            mapImage.style.transform = transform;
        }

        function centerMap() {
            const containerRect = container.getBoundingClientRect();
            const mapRect = mapImage.getBoundingClientRect();
            currentX = (containerRect.width - mapRect.width) / 2;
            currentY = (containerRect.height - mapRect.height) / 2;
            updatePositions();
        }

        function onDragStart(e) {
            e.preventDefault();
            isDragging = true;
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            dragStartX = currentX;
            dragStartY = currentY;
            container.style.cursor = 'grabbing';
        }

        function onDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const y = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
            const deltaX = x - startX;
            const deltaY = y - startY;
            
            currentX = dragStartX + deltaX;
            currentY = dragStartY + deltaY;

            const containerRect = container.getBoundingClientRect();
            const mapRect = mapImage.getBoundingClientRect();

            currentX = Math.min(0, Math.max(containerRect.width - mapRect.width, currentX));
            currentY = Math.min(0, Math.max(containerRect.height - mapRect.height, currentY));

            updatePositions();
        }

        function onDragEnd() {
            isDragging = false;
            container.style.cursor = 'grab';
        }

        // --- Setup ---
        buttons.forEach(button => {
            button.style.left = button.dataset.x;
            button.style.top = button.dataset.y;
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const popupSelector = button.dataset.popupTarget;
                const popup = document.querySelector(popupSelector);

                if (popup) {
                    popup.classList.add('visible');
                    container.style.display = 'none';
                    const scene = popup.querySelector('a-scene');
                    if (scene) {
                        scene.play();
                        setTimeout(() => scene.resize(), 10);
                    }
                }
            });
        });

        backToMapCards.forEach(card => {
            card.addEventListener('click', () => {
                const popup = card.closest('.pantalla');
                if (popup) {
                    popup.classList.remove('visible');
                    container.style.display = 'block';
                    const scene = popup.querySelector('a-scene');
                    if (scene) {
                        scene.pause();
                    }
                }
            });
        });

        // Add mouse event listeners
        container.addEventListener('mousedown', onDragStart);
        container.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', onDragEnd);

        // Add touch event listeners
        container.addEventListener('touchstart', onDragStart, { passive: false });
        container.addEventListener('touchmove', onDrag, { passive: false });
        window.addEventListener('touchend', onDragEnd);

        // Initial map setup
        centerMap();
        container.style.cursor = 'grab';
    }
});
