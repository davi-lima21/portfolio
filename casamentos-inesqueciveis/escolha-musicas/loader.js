// Arquivo: loader.js
// Responsável por carregar componentes, definir o link ativo e avisar quando a navbar estiver pronta.

document.addEventListener('DOMContentLoaded', function() {

    const loadHTML = (filePath, elementId) => {
        return fetch(filePath)
            .then(response => {
                if (!response.ok) throw new Error(`Não foi possível carregar: ${filePath}`);
                return response.text();
            })
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) element.innerHTML = data;
            })
            .catch(error => console.error('Erro ao carregar HTML:', error));
    };

    // Carrega a navbar e, em seguida, define o link ativo e dispara o evento.
    loadHTML('../navbar-footer/navbar.html', 'navbar-placeholder').then(() => {
        
        // --- LÓGICA DE LINK ATIVO (CORRIGIDA E MAIS PRECISA) ---
        const currentPathname = window.location.pathname;
        const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');

        let bestMatch = null;

        navLinks.forEach(link => {
            const linkPathname = new URL(link.href, window.location.origin).pathname;
            
            // Limpa a classe 'active' de todos
            link.classList.remove('active');

            // Encontra o link que corresponde exatamente à página atual, sem ser um link de âncora (#)
            if (currentPathname === linkPathname && !link.href.includes('#')) {
                bestMatch = link;
            }
        });

        // Ativa apenas o link que for a melhor correspondência (o link da página em si)
        if (bestMatch) {
            bestMatch.classList.add('active');
        } else {
            // Caso especial: se estiver na homepage ('/'), ativa o link "Início"
             const homeLink = document.querySelector('#navbar-placeholder .nav-link[href="index.html"]');
             if(homeLink && (currentPathname === '/' || currentPathname.endsWith('index.html'))) {
                 homeLink.classList.add('active');
             }
        }

        // Dispara um evento customizado para avisar aos outros scripts que a navbar foi carregada.
        document.dispatchEvent(new Event('navbarLoaded'));
    });

    // Carrega o rodapé
    loadHTML('../navbar-footer/footer.html', 'footer-placeholder');
});