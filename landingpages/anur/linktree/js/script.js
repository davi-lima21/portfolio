document.addEventListener('DOMContentLoaded', () => {

    // Seleciona o botão que ativa o dropdown e o container de links
    const toggleButton = document.getElementById('content-toggle');
    const dropdownContent = document.getElementById('content-links');

    // Verifica se os elementos existem na página para evitar erros
    if (toggleButton && dropdownContent) {
        
        // Adiciona um "ouvinte de evento" que espera por um clique no botão
        toggleButton.addEventListener('click', () => {
            
            // Adiciona ou remove a classe 'open' do botão para girar a seta
            toggleButton.classList.toggle('open');
            
            // Adiciona ou remove a classe 'show' do conteúdo para exibir ou esconder
            dropdownContent.classList.toggle('show');
        });
    }
});