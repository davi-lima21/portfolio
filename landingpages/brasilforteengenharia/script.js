document.addEventListener('DOMContentLoaded', function () {

    // Inicializa a biblioteca AOS (Animate on Scroll)
    AOS.init({
        duration: 800,        // Duração da animação em milissegundos
        easing: 'ease-in-out',  // Curva de aceleração da animação
        once: true,           // A animação acontece apenas uma vez
        offset: 100           // Distância do elemento para o início da animação
    });

    // Função para enviar formulário para o WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Pegar os valores dos campos
            const name = document.getElementById('formName').value;
            const email = document.getElementById('formEmail').value;
            const phone = document.getElementById('formPhone').value;
            const service = document.getElementById('formService').value;
            const auth = document.getElementById('formAuth').checked;

            // Validar se o checkbox de autorização foi marcado
            if (!auth) {
                alert("Por favor, autorize o contato para continuar.");
                return;
            }

            // Número de telefone da Brasil Forte Engenharia
            const whatsappNumber = '5571988066774';

            // Montar a mensagem
            const whatsappMessage = `Olá! Gostaria de fazer um orçamento.\n\n*Nome:* ${name}\n*E-mail:* ${email}\n*Telefone:* ${phone}\n*Serviço de Interesse:* ${service}`;

            // Codificar a mensagem para URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // Criar o link do WhatsApp
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

            // Abrir o link em uma nova aba
            window.open(whatsappUrl, '_blank');
        });
    }

    // ==================================================================
    // CÓDIGO ATUALIZADO: FECHAR O NAVBAR MOBILE AO CLICAR EM UM LINK OU BOTÃO
    // ==================================================================
    
    // Seleciona tanto os links quanto o botão de orçamento dentro do menu colapsado
    const elementsToCloseMenu = document.querySelectorAll('.navbar-nav .nav-link, .navbar-collapse .btn-brand');
    const menuToggle = document.getElementById('navbarNav');
    
    if (menuToggle) {
        const bsCollapse = new bootstrap.Collapse(menuToggle, {
            toggle: false
        });

        elementsToCloseMenu.forEach(function (element) {
            element.addEventListener('click', function () {
                // Verifica se o menu está aberto (visível) antes de tentar fechar
                if (menuToggle.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }
});