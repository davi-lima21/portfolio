document.addEventListener('DOMContentLoaded', function() {
    const leadForm = document.getElementById('lead-form');
    const formResponse = document.getElementById('form-response');

    leadForm.addEventListener('submit', function(event) {
        // Previne o envio padrão do formulário
        event.preventDefault();

        // Pega os valores (apenas para simulação)
        const nome = document.getElementById('nome').value;

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
});