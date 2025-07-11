document.addEventListener('DOMContentLoaded', function() {
    // Adiciona classe 'scrolled' ao navbar ao rolar a página para uma leve sombra/alteração de cor
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) { // Ajuste o limite de rolagem conforme necessário
            navbar.classList.add('scrolled'); // Você pode adicionar um estilo diferente para 'scrolled' no CSS
            navbar.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        }
    });

    // Rolagem suave para links de navegação
    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Fechar o menu hamburguer (navbar-collapse) após clicar em um link no mobile
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click(); // Simula um clique no botão para fechar
                }

                // Ajusta o scroll para um pouco acima da seção para que o título não fique escondido pelo navbar fixo
                const navbar = document.querySelector('.navbar'); // Pega o navbar para calcular a altura
                const offset = navbar.offsetHeight + 20; // Altura do navbar + um pequeno padding
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lógica do formulário de contato WhatsApp
    const whatsappForm = document.getElementById('whatsappForm');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const nome = document.getElementById('nomeWhatsapp').value;
            const whatsapp = document.getElementById('telWhatsapp').value.replace(/\D/g, ''); // Remove caracteres não numéricos
            const mensagem = document.getElementById('msgWhatsapp').value;

            // ATENÇÃO: SUBSTITUA 'SEUNUMEROAQUI' PELO SEU NÚMERO DE TELEFONE DO WHATSAPP (com código do país e DDD, sem + ou outros caracteres)
            // Exemplo para Brasil, SC: '5548999998888'
            const SEUNUMERO_WHATSAPP = '5548999998888'; // <--- MUDE AQUI!

            let textoParaWhatsapp = `Olá! Meu nome é ${nome} e meu WhatsApp é ${whatsapp}.%0A%0A`; // %0A é o código para quebra de linha
            textoParaWhatsapp += `Mensagem: %0A${mensagem}`;

            const whatsappLink = `https://wa.me/${SEUNUMERO_WHATSAPP}?text=${textoParaWhatsapp}`;
            
            window.open(whatsappLink, '_blank'); // Abre o link em uma nova aba

            // Opcional: limpar o formulário após o "envio"
            this.reset();
        });
    }

    // Inicialização do Carousel de Depoimentos
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        new bootstrap.Carousel(testimonialCarousel, {
            interval: 6000, // Troca de slide a cada 6 segundos
            wrap: true // Volta para o primeiro slide após o último
        });
    }
});