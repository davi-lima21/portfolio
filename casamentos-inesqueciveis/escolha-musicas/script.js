document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DA PÁGINA DE REPERTÓRIO (LISTA DETALHADA) ---
    if (document.body.classList.contains('repertorio-body-light')) {

        const musicMoments = document.querySelectorAll('.music-moment');

        musicMoments.forEach(moment => {
            const songItems = moment.querySelectorAll('.song-item-selectable');
            const customInput = moment.querySelector('.custom-song-input-light');

            songItems.forEach(item => {
                item.addEventListener('click', function() {
                    songItems.forEach(li => li.classList.remove('selected'));
                    this.classList.add('selected');

                    if (this.dataset.value === 'outra') {
                        customInput.style.display = 'block';
                    } else {
                        customInput.style.display = 'none';
                        customInput.value = '';
                    }
                });
            });

            // Previne que o clique no ícone do YouTube selecione a música
            const youtubeLinks = moment.querySelectorAll('.youtube-play-icon');
            youtubeLinks.forEach(link => {
                link.addEventListener('click', function(event) {
                    event.stopPropagation();
                });
            });
        });

        const sendButton = document.getElementById('send-whatsapp');
        sendButton.addEventListener('click', function() {
            let message = 'Olá, Rafael! Segue a minha seleção de músicas para o casamento:\n\n';
            let hasSelection = false;
            
            musicMoments.forEach(moment => {
                const momentTitle = moment.getAttribute('data-moment');
                const selectedItem = moment.querySelector('.song-item-selectable.selected');
                let selectedSong = '';

                if (selectedItem) {
                    hasSelection = true;
                    if (selectedItem.dataset.value === 'outra') {
                        const customInput = moment.querySelector('.custom-song-input-light');
                        selectedSong = customInput.value.trim() || 'A ser definida';
                    } else {
                        selectedSong = selectedItem.dataset.value;
                    }
                    message += `*${momentTitle}:* ${selectedSong}\n`;
                }
            });

            if (!hasSelection) {
                alert('Você não selecionou nenhuma música ainda.');
                return;
            }

            // --- ALTERAÇÃO AQUI ---
            
            // 1. Defina o número de telefone em uma variável (sem espaços ou caracteres especiais)
            const phoneNumber = '5554999248998'; 

            // 2. Formate a nova URL incluindo o número e o texto
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
            
            // --- FIM DA ALTERAÇÃO ---

            window.open(whatsappUrl, '_blank');
        });
    }

    // --- CÓDIGO DO SEU SITE PRINCIPAL (INDEX.HTML) ---
    // (Lógica da navbar, animações, etc.)
});