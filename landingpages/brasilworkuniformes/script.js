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

            // --- INÍCIO DAS MODIFICAÇÕES ---

            // 1. Pega os valores de todos os campos do formulário
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const empresa = document.getElementById('empresa').value;
            const mensagem = document.getElementById('mensagem').value;
            const whatsappNumber = '5571981539425';

            // Validação simples para garantir que os campos obrigatórios não estão vazios
            if (nome.trim() === '' || email.trim() === '' || telefone.trim() === '' || mensagem.trim() === '') {
                formResponse.innerHTML = `
                    <div class="alert alert-danger" role="alert">
                        Por favor, preencha todos os campos obrigatórios.
                    </div>
                `;
                // Remove a mensagem de erro após alguns segundos
                setTimeout(() => {
                    formResponse.innerHTML = '';
                }, 4000);
                return;
            }

            // 2. Monta a mensagem que será enviada para o WhatsApp
            let messageText = `*Novo Contato do Site*\n\n` +
                              `*Nome:* ${nome}\n` +
                              `*E-mail:* ${email}\n` +
                              `*Telefone:* ${telefone}\n`;
            
            // Adiciona a empresa à mensagem somente se o campo for preenchido
            if (empresa) {
                messageText += `*Empresa:* ${empresa}\n`;
            }

            messageText += `\n*Mensagem:*\n${mensagem}`;

            // 3. Codifica a mensagem e cria o link do WhatsApp
            const encodedMessage = encodeURIComponent(messageText);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

            // 4. Abre o WhatsApp em uma nova aba
            window.open(whatsappUrl, '_blank');
            
            // --- FIM DAS MODIFICAÇÕES ---


            // Exibe a mensagem de sucesso (lógica original mantida)
            formResponse.innerHTML = `
                <div class="alert alert-success" role="alert">
                    <strong>Obrigado, ${nome}!</strong> Seus dados foram preparados para envio. Conclua a ação no WhatsApp.
                </div>
            `;

            // Limpa o formulário após o envio (lógica original mantida)
            leadForm.reset();

            // Remove a mensagem de sucesso após alguns segundos (lógica original mantida)
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
    // Adicionado um 'try-catch' para não dar erro se o elemento não existir
    try {
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
    } catch (e) {
        // console.log("Elemento #navbarNav não encontrado, lógica de collapse do menu não aplicada.");
    }

});