document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Lógica para el Filtro de Temporadas ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const episodeCards = document.querySelectorAll('.episode-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedSeason = button.getAttribute('data-season');

            // 1.1. Manejo de la clase 'active' para el estilo del botón
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 1.2. Filtrado de episodios
            episodeCards.forEach(card => {
                const cardSeason = card.getAttribute('data-season');
                
                // Si se selecciona 'all', o si la temporada de la tarjeta coincide con la seleccionada, se muestra.
                if (selectedSeason === 'all' || cardSeason === selectedSeason) {
                    // Muestra el episodio. Usamos 'flex' porque el CSS de la tarjeta es display: flex
                    card.style.display = 'flex'; 
                } else {
                    // Oculta el episodio.
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 2. Lógica para el botón de Marcar como Visto ---
    const watchedButtons = document.querySelectorAll('.mark-watched');

    watchedButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Utilizamos LocalStorage para guardar el estado VISTO en el navegador
            const episodeId = this.closest('.episode-card').getAttribute('data-id');
            const isWatched = this.getAttribute('data-watched') === 'true';

            if (isWatched) {
                // Marcar como NO VISTO
                this.setAttribute('data-watched', 'false');
                this.classList.remove('watched');
                this.textContent = 'Marcar como VISTO';
                localStorage.removeItem(`watched_${episodeId}`); // Elimina el estado guardado
            } else {
                // Marcar como VISTO
                this.setAttribute('data-watched', 'true');
                this.classList.add('watched');
                this.textContent = 'VISTO ✅';
                localStorage.setItem(`watched_${episodeId}`, 'true'); // Guarda el estado
            }
        });
    });

    // --- 3. Cargar el estado VISTO al iniciar la página ---
    episodeCards.forEach(card => {
        const episodeId = card.getAttribute('data-id');
        const watchedState = localStorage.getItem(`watched_${episodeId}`);
        const button = card.querySelector('.mark-watched');

        if (watchedState === 'true') {
            button.setAttribute('data-watched', 'true');
            button.classList.add('watched');
            button.textContent = 'VISTO ✅';
        }
    });

    // --- 4. Ejecutar el filtro de la T.1 al cargar la página ---
    // Esto asegura que al abrir la web, solo se vea la T.1 (que es el filtro 'active' por defecto)
    const initialFilterButton = document.querySelector('.filter-btn.active');
    if (initialFilterButton) {
        initialFilterButton.click();
    }
});
//buscar
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('episode-search');
    const cards = document.querySelectorAll('.episode-card');
    const countDisplay = document.getElementById('search-results-count');

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        let foundCount = 0;

        cards.forEach(card => {
            const title = card.querySelector('.ep-title').textContent.toLowerCase();
            const id = card.getAttribute('data-id');
            const season = card.getAttribute('data-season');
            
            // Busca en título, ID del episodio o temporada
            if (title.includes(term) || id.includes(term)) {
                card.style.display = "block";
                foundCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Opcional: Mostrar cuántos resultados hay
        if (term !== "") {
            countDisplay.textContent = `Encontrados: ${foundCount}`;
        } else {
            countDisplay.textContent = "";
        }
    });
});
//random episode
document.getElementById('random-btn').addEventListener('click', function(e) {
    e.preventDefault(); // Evita que la página suba arriba al pulsar el enlace

    // Buscamos todas las tarjetas de episodios o películas
    const episodes = document.querySelectorAll('.episode-card');
    
    if (episodes.length > 0) {
        // Elegimos un número al azar entre 0 y el total de episodios
        const randomIndex = Math.floor(Math.random() * episodes.length);
        const randomEpisode = episodes[randomIndex];
        
        // Obtenemos el enlace (href) de esa tarjeta aleatoria
        const link = randomEpisode.querySelector('.episode-link').href;
        
        // Abrimos el capítulo en una pestaña nueva
        window.open(link, '_blank');
    } else {
        alert("No se encontraron episodios en esta página.");
    }
});
//reseña
// Esperamos a que todo el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    
    const modal = document.getElementById('review-modal');
    const textarea = document.getElementById('review-text');
    const btnGuardar = document.getElementById('save-review');
    const btnCerrar = document.getElementById('close-modal');

    // 1. Abrir Modal al pulsar en "Reseña"
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('review-link')) {
            e.preventDefault();

            const href = e.target.getAttribute('href');
            const episodeId = href.split('-').pop(); 
            
            // Guardamos el ID en una variable del modal
            modal.setAttribute('data-current-id', episodeId);
            
            // Cargamos lo que haya guardado
            const savedText = localStorage.getItem('review-' + episodeId) || '';
            textarea.value = savedText;
            
            modal.style.display = 'flex';
        }
    });

    // 2. Acción del botón GUARDAR
    if (btnGuardar) {
        btnGuardar.onclick = function() {
            const episodeId = modal.getAttribute('data-current-id');
            const text = textarea.value;
            
            localStorage.setItem('review-' + episodeId, text);
            modal.style.display = 'none';
            console.log('Reseña guardada para el ID:', episodeId);
        };
    }

    // 3. Acción del botón CERRAR
    if (btnCerrar) {
        btnCerrar.onclick = function() {
            modal.style.display = 'none';
        };
    }

    // 4. Cerrar si se pulsa fuera del cuadro negro
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }
});