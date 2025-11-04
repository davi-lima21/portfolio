document.addEventListener('DOMContentLoaded', () => {

  // --- DADOS FICTÍCIOS (Simulando um Banco de Dados) ---
  // Substitua '5581...' pelo seu número
  const SEU_WHATSAPP = "5581996975543"; 
  
  const mockData = [
    { 
      id: 1, 
      nome: "Rafael Nunes", 
      cpfCnpj: "123.456.789-00", 
      email: "rafael@email.com", 
      whats: "5581999998888", 
      motivo: "Limpar nome CPF", 
      data: "2025-11-04" 
    },
    { 
      id: 2, 
      nome: "Souza Solução em Energia", 
      cpfCnpj: "61.670.286/0001-07", 
      email: "contato@souza.com", 
      whats: "5511988887777", 
      motivo: "Limpar nome CNPJ", 
      data: "2025-11-03" 
    },
    { 
      id: 3, 
      nome: "Maria Oliveira", 
      cpfCnpj: "987.654.321-01", 
      email: "maria.oli@gmail.com", 
      whats: "5521977776666", 
      motivo: "Aumentar Score", 
      data: "2025-11-03" 
    },
    { 
      id: 4, 
      nome: "Casamentos Inesquecíveis", 
      cpfCnpj: "45.123.789/0001-02", 
      email: "falecom@casamentos.com", 
      whats: "5531966665555", 
      motivo: "Quero ser Associado", 
      data: "2025-11-02" 
    },
     { 
      id: 5, 
      nome: "Pedro Santos", 
      cpfCnpj: "111.222.333-44", 
      email: "pedro.s@hotmail.com", 
      whats: "5548955554444", 
      motivo: "Cartão de Crédito Parceiro", 
      data: "2025-11-01" 
    },
    { 
      id: 6, 
      nome: "DLR Web Studio", 
      cpfCnpj: "33.444.555/0001-06", 
      email: "contato@dlrweb.com", 
      whats: "5581944443333", 
      motivo: "Limpar nome CNPJ", 
      data: "2025-10-31" 
    }
  ];

  const tableBody = document.getElementById('leadsTableBody');
  const filterForm = document.getElementById('filterForm');
  const clearButton = document.getElementById('clearButton');
  const rowCountSpan = document.getElementById('rowCount');
  
  // --- FUNÇÃO PARA RENDERIZAR A TABELA ---
  function renderTable(data) {
    tableBody.innerHTML = ''; // Limpa a tabela

    if (data.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="6" class="text-center p-5">Nenhum registro encontrado.</td></tr>';
      rowCountSpan.textContent = '0';
      return;
    }

    data.forEach(lead => {
      // Formata a data (de AAAA-MM-DD para DD/MM/AAAA)
      const dataFormatada = new Date(lead.data + 'T00:00:00').toLocaleDateString('pt-BR');

      // Gera os botões de ação
      const whatsappLink = `https://wa.me/${lead.whats}?text=Ol%C3%A1%2C+${lead.nome.split(' ')[0]}!+Sou+da+RN+Consultoria+e+estou+entrando+em+contato+sobre+seu+interesse+em+%22${lead.motivo}%22.`;
      const telLink = `tel:${lead.whats}`;

      const row = `
        <tr>
          <td>
            <span class="fw-bold">${lead.nome}</span>
          </td>
          <td>${lead.cpfCnpj}</td>
          <td>
            <span class="contact-info"><strong>Email:</strong> ${lead.email}</span>
            <span class="contact-info"><strong>Whats:</strong> ${lead.whats}</span>
          </td>
          <td>
            <span class="badge text-bg-secondary">${lead.motivo}</span>
          </td>
          <td>${dataFormatada}</td>
          <td class="text-nowrap">
            <a href="${whatsappLink}" target="_blank" class="btn btn-sm btn-success btn-action" title="Chamar no WhatsApp">
              <i class="bi bi-whatsapp"></i>
            </a>
            <a href="${telLink}" class="btn btn-sm btn-info btn-action" title="Ligar">
              <i class="bi bi-telephone-fill"></i>
            </a>
            <button class="btn btn-sm btn-outline-secondary btn-action" title="Marcar como Concluído">
              <i class="bi bi-check-lg"></i>
            </button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
    
    rowCountSpan.textContent = data.length;
  }

  // --- FUNÇÃO PARA FILTRAR OS DADOS ---
  function filterData(event) {
    event.preventDefault();
    const nomeVal = document.getElementById('filterNome').value.toLowerCase();
    const motivoVal = document.getElementById('filterMotivo').value;
    const dataVal = document.getElementById('filterData').value;

    const filteredData = mockData.filter(lead => {
      const matchNome = lead.nome.toLowerCase().includes(nomeVal);
      const matchMotivo = (motivoVal === "") ? true : lead.motivo === motivoVal;
      const matchData = (dataVal === "") ? true : lead.data === dataVal;
      
      return matchNome && matchMotivo && matchData;
    });

    renderTable(filteredData);
  }

  // --- FUNÇÃO PARA LIMPAR O FILTRO ---
  function clearFilter() {
    filterForm.reset();
    renderTable(mockData);
  }

  // --- INICIALIZAÇÃO E EVENTOS ---
  
  // Renderiza a tabela inicial com todos os dados
  // Adiciona um pequeno delay para simular o carregamento
  setTimeout(() => {
     renderTable(mockData);
  }, 500); 

  // Adiciona os eventos aos botões
  filterForm.addEventListener('submit', filterData);
  clearButton.addEventListener('click', clearFilter);

  // --- LÓGICA DO MENU MOBILE (OFFCANVAS) ---
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileMenu) {
    const sidebarContent = document.querySelector('.sidebar .nav').cloneNode(true);
    mobileMenu.querySelector('.offcanvas-body').appendChild(sidebarContent);
  }

});