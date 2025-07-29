document.addEventListener("DOMContentLoaded", () => {
    function cambiarPantalla(idBoton, pantallaOrigen, pantallaDestino) {
        const boton = document.getElementById(idBoton);
        const preDiv = document.getElementById(pantallaOrigen);
        const postDiv = document.getElementById(pantallaDestino);
        
        if (!boton || !preDiv || !postDiv) {
            console.error(`Elementos no encontrados: ${idBoton}, ${pantallaOrigen}, ${pantallaDestino}`);
            return;
        }

        const handleClick = () => {
            // Agregar clase fade a la pantalla actual
            preDiv.classList.add('fade-out');
            
            // Esperar a que termine la animación de fade out
            setTimeout(() => {
                // Ocultar todas las pantallas
                document.querySelectorAll('.pantalla').forEach(pantalla => {
                    pantalla.classList.add('oculto');
                    pantalla.classList.remove('fade-out', 'fade-in');
                });
                
                // Mostrar la nueva pantalla con animación
                postDiv.classList.remove('oculto');
                postDiv.classList.add('fade-in');
                
                // Eliminar la clase de animación después de que termine
                setTimeout(() => {
                    postDiv.classList.remove('fade-in');
                }, 500);
                
            }, 300); // Tiempo de la animación de fade out
        };

        // Limpiar y agregar nuevo evento
        boton.replaceWith(boton.cloneNode(true));
        const nuevoBoton = document.getElementById(idBoton);
        nuevoBoton.addEventListener("click", handleClick);
        
        // Initialize memory game when showing the memory game screen
        if (pantallaDestino === 'pantalla_juegos_memoria') {
            setTimeout(initMemoryGame, 100);
        }
    }

    // Configurar navegaciones en orden de jerarquía
    cambiarPantalla("boton_ingreso", "pantalla_titulo", "pantalla_menu");
    cambiarPantalla("ramal_btn", "pantalla_menu", "pantalla_ramal_1");
    cambiarPantalla("juegos_btn", "pantalla_menu", "pantalla_menu_juegos");
    cambiarPantalla("boton_tren_a_las_nubes", "pantalla_ramal_1", "pantalla_ramal_3");
    cambiarPantalla("boton_historia_ramal", "pantalla_ramal_1", "pantalla_ramal_2");
    cambiarPantalla("boton_volver_ramal", "pantalla_ramal_1", "pantalla_menu");
    cambiarPantalla("boton_volver_ramal_2", "pantalla_ramal_2", "pantalla_ramal_1");
    cambiarPantalla("boton_volver_ramal_3", "pantalla_ramal_3", "pantalla_ramal_1");
    cambiarPantalla("chaccu_btn", "pantalla_menu", "pantalla_chaccu");
    cambiarPantalla("boton_volver_chaccu", "pantalla_chaccu", "pantalla_menu");
    cambiarPantalla("boton_socompa", "pantalla_mapa_puna", "popup_modelo_volcan_socompa");
    cambiarPantalla("boton_volver_juegos", "pantalla_menu_juegos", "pantalla_menu");
    //Manejo de Popups
    function manejarPopup(idBoton, idPopup) {
    const boton = document.getElementById(idBoton);
    const popup = document.getElementById(idPopup);
    const pantallaChaccu = document.getElementById('pantalla_chaccu');
    
    if (!boton || !popup || !pantallaChaccu) {
        console.error(`Elementos no encontrados`);
        return;
    }

    // Abrir popup
    boton.addEventListener("click", (e) => {
        e.stopPropagation();
        popup.classList.add('visible');
    });

    // Cerrar popup cuando se hace click en la pantalla de fondo
    pantallaChaccu.addEventListener("click", (e) => {
        // Verificar que el click no fue en el popup ni en el botón
        if (!popup.contains(e.target) && e.target !== boton) {
            popup.classList.remove('visible');
        }
    });
    }

    // Configurar los popups
    manejarPopup("boton_popup_1", "popup_chaccu_1");
    manejarPopup("boton_popup_2", "popup_chaccu_2");
    manejarPopup("boton_popup_3", "popup_chaccu_3");
    manejarPopup("boton_popup_4", "popup_chaccu_4");
    manejarPopup("boton_popup_5", "popup_chaccu_5");
    manejarPopup("boton_popup_6", "popup_chaccu_6");
    manejarPopup("boton_popup_7", "popup_chaccu_7");

    // Selector de imágenes de ramal_2
    const miniaturas = document.querySelectorAll('#pantalla_ramal_2 .miniatura');
    const imagenGrande = document.getElementById('imagen-grande');

    miniaturas.forEach(miniatura => {
        miniatura.addEventListener('click', function() {
            imagenGrande.src = this.src;
            miniaturas.forEach(m => m.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    
});