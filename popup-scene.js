document.addEventListener('DOMContentLoaded', () => {
    // Find all popup screens and apply the 3D interaction logic to each one
    const popups = document.querySelectorAll('.pantalla');

    popups.forEach(popup => {
        const modelContainer = popup.querySelector('#model-container');
        const model = popup.querySelector('#model');
        const camera = popup.querySelector('#camera');

        // If a popup doesn't have a model, skip it
        if (!modelContainer || !model || !camera) {
            return;
        }

        const isZoomEnabled = popup.dataset.zoomEnabled !== 'false'; // Default to true

        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        const rotationSpeed = 0.5;
        const MIN_ROTATION = -Math.PI * 0.4;
        const MAX_ROTATION = Math.PI * 0.4;
        let currentRotation = 0;
        let targetRotation = 0;
        const ROTATION_SMOOTHING = 0.1;

        const ZOOM_SPEED = 0.1;
        const MIN_ZOOM = 1.3;
        const MAX_ZOOM = 1.6;
        let currentZoom = 1.3;
        let initialDistance = 1.3;

        let animationFrameId;

        function animate() {
            currentRotation += (targetRotation - currentRotation) * ROTATION_SMOOTHING;
            if (modelContainer.object3D) {
                modelContainer.object3D.rotation.y = currentRotation;
            }
            animationFrameId = requestAnimationFrame(animate);
        }

        // --- Event Listeners attached to this specific popup ---

        popup.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
            model.setAttribute('animation', 'enabled', 'false');
        });

        popup.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - previousMousePosition.x;
            targetRotation = currentRotation - (deltaX * 0.01 * rotationSpeed);
            targetRotation = Math.max(MIN_ROTATION, Math.min(MAX_ROTATION, targetRotation));
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        popup.addEventListener('mouseup', () => {
            isDragging = false;
            model.setAttribute('animation', 'enabled', 'true');
        });

        popup.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                model.setAttribute('animation', 'enabled', 'true');
            }
        });

        if (isZoomEnabled) {
            popup.addEventListener('wheel', (e) => {
                e.preventDefault();
                const zoomAmount = e.deltaY > 0 ? ZOOM_SPEED : -ZOOM_SPEED;
                const newZoom = currentZoom + zoomAmount;

                if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
                    if (camera.object3D) {
                        camera.object3D.position.z = newZoom;
                    }
                    currentZoom = newZoom;
                }
            }, { passive: false });
        }

        popup.addEventListener('touchstart', (e) => {
            model.setAttribute('animation', 'enabled', 'false');
            if (e.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2 && isZoomEnabled) {
                isDragging = false;
                initialDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
            }
        }, { passive: false });

        popup.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && isDragging) {
                const deltaX = e.touches[0].clientX - previousMousePosition.x;
                targetRotation = currentRotation - (deltaX * 0.01 * rotationSpeed);
                targetRotation = Math.max(MIN_ROTATION, Math.min(MAX_ROTATION, targetRotation));
                previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            } else if (e.touches.length === 2 && initialDistance && isZoomEnabled) {
                const currentDistance = Math.hypot(
                    e.touches[0].pageX - e.touches[1].pageX,
                    e.touches[0].pageY - e.touches[1].pageY
                );
                const zoomAmount = (initialDistance - currentDistance) * 0.02;
                const newZoom = currentZoom - zoomAmount;

                if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
                    if (camera.object3D) {
                        camera.object3D.position.z = newZoom;
                    }
                    currentZoom = newZoom;
                }
                initialDistance = currentDistance;
            }
        }, { passive: false });

        popup.addEventListener('touchend', () => {
            isDragging = false;
            initialDistance = null;
            model.setAttribute('animation', 'enabled', 'true');
        });

        // --- Observer to control animation for this specific popup ---
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.attributeName === 'class') {
                    const isVisible = popup.classList.contains('visible');
                    if (isVisible) {
                        if (!animationFrameId) {
                            animate();
                        }
                    } else {
                        cancelAnimationFrame(animationFrameId);
                        animationFrameId = null;
                    }
                }
            });
        });

        observer.observe(popup, { attributes: true });
    });
});
