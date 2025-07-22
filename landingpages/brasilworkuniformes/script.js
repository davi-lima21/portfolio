document.addEventListener('DOMContentLoaded', function() {
    
    // =======================================================
    // LÓGICA EXISTENTE PARA O FORMULÁRIO DE CONTATO
    // =======================================================
    const leadForm = document.getElementById('lead-form');
    const formResponse = document.getElementById('form-response');

    // Verifica se o formulário existe na página antes de adicionar o listener
    if (leadForm) {
        leadForm.addEventListener('submit', function(event) {
            // Previne o envio padrão do formulário
            event.preventDefault();

            // Pega os valores (apenas para simulação)
            const nomeInput = document.getElementById('nome');
            const nome = nomeInput ? nomeInput.value : 'Cliente';


            // Validação simples para garantir que o nome não está vazio
            if (nome.trim() === '') {
                formResponse.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Por favor, preencha seu nome para continuar.
                    </div>
                `;
                return;
            }

            // Exibe a mensagem de sucesso
            formResponse.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <strong>Obrigado, ${nome}!</strong> Sua mensagem foi recebida com sucesso. Em breve, nossa equipe entrará em contato.
                </div>
            `;

            // Limpa o formulário após o envio
            leadForm.reset();

            // Remove a mensagem de sucesso após alguns segundos
            setTimeout(() => {
                formResponse.innerHTML = '';
            }, 6000); // 6 segundos
        });
    }

    // =================================================================
    // NOVA LÓGICA PARA FECHAR O MENU NAVBAR NO CLIQUE (CELULAR)
    // =================================================================
    
    // 1. Seleciona todos os links dentro do menu de navegação
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // 2. Seleciona o elemento do menu que colapsa (o que abre e fecha)
    const menuToggle = document.getElementById('navbarNav');
    
    // 3. Cria uma instância do componente Collapse do Bootstrap para controlá-lo via JS
    const bsCollapse = new bootstrap.Collapse(menuToggle, {
      toggle: false // Define como false para não abrir/fechar ao ser inicializado
    });
    
    // 4. Adiciona um "ouvinte" de clique para cada link do menu
    navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            // 5. Verifica se o menu está visível (aberto)
            if (menuToggle.classList.contains('show')) {
                // 6. Se estiver aberto, usa o método do Bootstrap para fechá-lo
                bsCollapse.hide();
            }
        });
    });

});