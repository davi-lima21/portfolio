# -*- coding: utf-8 -*-

# Este script requer a biblioteca reportlab
# Instale com: pip install reportlab

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
import datetime
import locale # Para formatar o mês em português

def gerar_pdf_contrato():
    # --- Configura a data atual em português ---
    try:
        # Tenta configurar o locale para Português do Brasil
        locale.setlocale(locale.LC_TIME, 'pt_BR.UTF-8')
    except locale.Error:
        try:
            # Tenta um padrão alternativo para Windows
            locale.setlocale(locale.LC_TIME, 'Portuguese_Brazil.1252')
        except locale.Error:
            # Fallback se a configuração do locale falhar
            print("Aviso: Não foi possível configurar o locale pt_BR. O mês pode aparecer em inglês.")
            locale.setlocale(locale.LC_TIME, '') # Usa o locale padrão do sistema

    hoje = datetime.date.today()
    # Formata a data: 04 de novembro de 2025
    data_formatada = hoje.strftime("%d de %B de %Y")
    local_e_data = f"Florianópolis, {data_formatada}."
    # --- Fim da configuração de data ---

    # Nome do arquivo de saída
    nome_arquivo = "contrato_perola_pay.pdf"
    
    # Configuração do Documento
    doc = SimpleDocTemplate(nome_arquivo, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)
    
    # Lista de elementos (parágrafos, espaços, etc.)
    story = []
    
    # --- DEFINIÇÃO DE ESTILOS ---
    styles = getSampleStyleSheet()
    
    # Estilo do Título Principal
    styles.add(ParagraphStyle(name='TituloPrincipal',
                              parent=styles['h1'],
                              fontSize=14,
                              alignment=TA_CENTER,
                              spaceAfter=14))

    # Estilo para as partes (CONTRATANTE / CONTRATADO)
    # Estilo modificado para Título da Parte (Negrito)
    styles.add(ParagraphStyle(name='TituloParte',
                              parent=styles['Normal'],
                              fontSize=10,
                              fontName='Helvetica-Bold',
                              spaceAfter=2,
                              leading=14))

    # Estilo para os dados da Parte
    styles.add(ParagraphStyle(name='DadosParte',
                              parent=styles['Normal'],
                              fontSize=10,
                              spaceAfter=10, # Espaço após o bloco da parte
                              leading=14)) # Espaçamento entre linhas

    # Estilo para o título da Cláusula (negrito)
    styles.add(ParagraphStyle(name='TituloClausula',
                              parent=styles['Normal'],
                              fontSize=10,
                              fontName='Helvetica-Bold',
                              spaceAfter=4,
                              spaceBefore=10))

    # Estilo para o corpo do texto (justificado)
    styles.add(ParagraphStyle(name='CorpoTexto',
                              parent=styles['Normal'],
                              fontSize=10,
                              alignment=TA_JUSTIFY,
                              leading=14,
                              spaceAfter=6))
                              
    # Estilo para o rodapé (local/data)
    styles.add(ParagraphStyle(name='LocalData',
                              parent=styles['Normal'],
                              fontSize=10,
                              alignment=TA_LEFT,
                              spaceBefore=20,
                              spaceAfter=20))

    # Estilo para as assinaturas
    styles.add(ParagraphStyle(name='Assinatura',
                              parent=styles['Normal'],
                              fontSize=10,
                              alignment=TA_LEFT,
                              leading=14,
                              spaceAfter=2))

    # --- CONTEÚDO DO CONTRATO ---

    story.append(Paragraph("CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO DE WEBSITE", styles['TituloPrincipal']))

    story.append(Paragraph(
        "Pelo presente instrumento particular, as partes abaixo identificadas:",
        styles['CorpoTexto']
    ))
    
    # CONTRATANTE
    story.append(Paragraph("CONTRATANTE", styles['TituloParte']))
    story.append(Paragraph(
        "<b>Razão Social:</b> Pérola Pay Intermediação Financeira LTDA<br/>"
        "<b>Nome Fantasia:</b> Pérola Pay<br/>"
        "<b>CNPJ:</b> 61.670.286/0001-07<br/>"
        "<b>Endereço:</b> Rua Siqueira Campos, nº 45, Sala 0902, Edf. Lygia Uchoa de Medeiros, Bairro Santo Antônio, Recife/PE, CEP 50010-010<br/>"
        "<b>Representante Legal:</b> Rafael Nunes Morato (Sócio-Administrador)",
        styles['DadosParte']
    ))

    # CONTRATADA
    story.append(Paragraph("CONTRATADA", styles['TituloParte']))
    story.append(Paragraph(
        "<b>Razão Social:</b> Davi de Lima Rosa Desenvolvimento de Software LTDA<br/>"
        "<b>Nome Fantasia:</b> DLR Web Studio<br/>"
        "<b>CNPJ:</b> 63.386.640/0001-00<br/>"
        "<b>Endereço:</b> Avenida Prefeito Osmar Cunha, nº 416, Sala 1108, Centro, Florianópolis/SC, CEP 88015-100<br/>"
        "<b>E-mail:</b> contato@dlrwebstudio.com<br/>"
        "<b>PIX:</b> limarosa.lr21@gmail.com",
        styles['DadosParte']
    ))

    # --- CLÁUSULAS (Pérola Pay) ---

    clausulas = [
        ("CLÁUSULA 1 – DO OBJETO",
         "O presente contrato tem por objeto a prestação de serviços de desenvolvimento de website institucional, contendo duas páginas principais, conforme escopo previamente definido e acordado entre as partes via comunicação pelo aplicativo WhatsApp, incluindo:<br/><br/>"
         "<ul>"
         "<li>Criação e configuração do site institucional da Pérola Pay;</li>"
         "<li>Integração de formulário de contato/captura de leads;</li>"
         "<li>Desenvolvimento de um painel (dashboard) para visualização dos leads cadastrados.</li>"
         "</ul>"),
        
        ("CLÁUSULA 2 – DO PRAZO DE ENTREGA",
         "O prazo estimado para entrega do website completo é de até <b>7 (sete) dias úteis</b>, contados a partir da confirmação do pagamento da primeira parcela e do envio de todo o material necessário (textos, logotipo, imagens e informações).<br/><br/>"
         "Eventuais atrasos decorrentes da não entrega de materiais pelo CONTRATANTE suspenderão o prazo de conclusão até a regularização."),

        ("CLÁUSULA 3 – DO VALOR E FORMA DE PAGAMENTO",
         "O valor total dos serviços de desenvolvimento é de <b>R$ 512,00 (quinhentos e doze reais)</b>.<br/>"
         "O valor da primeira anuidade de hospedagem e manutenção básica é de <b>R$ 120,00 (cento e vinte reais)</b>.<br/><br/>"
         "O pagamento total (R$ 632,00) será dividido em duas parcelas iguais, da seguinte forma:<br/><br/>"
         "<ul>"
         "<li><b>1ª Parcela (Sinal): R$ 316,00 (Trezentos e dezesseis reais)</b>, pagos no ato da assinatura deste contrato (referente a R$ 256,00 dos serviços + R$ 60,00 da anuidade).</li>"
         "<li><b>2ª Parcela (Entrega): R$ 316,00 (Trezentos e dezesseis reais)</b>, pagos após a entrega final e aprovação do site (referente a R$ 256,00 dos serviços + R$ 60,00 da anuidade).</li>"
         "</ul>"
         "<br/>A renovação da hospedagem e manutenção para os anos seguintes terá o custo de R$ 120,00 anuais, conforme Cláusula 4."
         "<br/>Os pagamentos deverão ser realizados via PIX para a chave <b>limarosa.lr21@gmail.com</b>."),

        ("CLÁUSULA 4 – DA MANUTENÇÃO ANUAL",
         "O valor anual de R$ 120,00 cobre hospedagem, suporte técnico básico e renovação de domínio (quando aplicável).<br/><br/>"
         "Alterações estruturais, inclusão de novas páginas, funcionalidades ou reformulações visuais não estão incluídas e serão objeto de novo orçamento."),

        ("CLÁUSULA 5 – DA PROPRIETADE E DIREITOS DE USO",
         "Após a quitação integral dos valores acordados, o CONTRATANTE passa a deter o direito de uso integral e não exclusivo do website, incluindo seus arquivos e conteúdo.<br/><br/>"
         "O código-fonte e componentes técnicos desenvolvidos pela CONTRATADA permanecem de propriedade intelectual da mesma, podendo ser utilizados em outros projetos."),

        ("CLÁUSULA 6 – DAS RESPONSABILIDADES",
         "<b>À CONTRATADA cabe:</b><br/>"
         "<ul>"
         "<li>Desenvolver o website conforme o escopo definido;</li>"
         "<li>Manter confidencialidade sobre as informações fornecidas;</li>"
         "<li>Garantir suporte técnico básico durante o período de hospedagem contratado.</li>"
         "</ul>"
         "<br/><b>Ao CONTRATANTE cabe:</b><br/>"
         "<ul>"
         "<li>Fornecer os materiais e informações necessárias à execução do projeto;</li>"
         "<li>Efetuar os pagamentos nas condições acordadas;</li>"
         "<li>Testar e aprovar o produto final dentro do prazo estabelecido.</li>"
         "</ul>"),

        ("CLÁUSULA 7 – DA RESCISÃO",
         "Em caso de desistência por parte do CONTRATANTE após o início dos trabalhos, o valor pago na primeira parcela não será devolvido, servindo para cobrir os custos de desenvolvimento já realizados.<br/><br/>"
         "A CONTRATADA poderá rescindir o contrato caso o CONTRATANTE descumpra obrigações contratuais, sem prejuízo de cobrança pelos serviços prestados."),
        
        ("CLÁUSULA 8 – DO FORO",
         "Fica eleito o foro da Comarca de Florianópolis/SC, com renúncia expressa de qualquer outro, por mais privilegiado que seja, para dirimir eventuais dúvidas ou litígios oriundos deste contrato.")
    ]

    for titulo, texto in clausulas:
        story.append(Paragraph(titulo, styles['TituloClausula']))
        story.append(Paragraph(texto, styles['CorpoTexto']))

    # --- FECHAMENTO E ASSINATURAS ---
    
    story.append(Paragraph(
        "E, por estarem justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma.",
        styles['CorpoTexto']
    ))

    # Adiciona a data formatada dinamicamente
    story.append(Paragraph(local_e_data, styles['LocalData']))

    # Assinatura CONTRATANTE
    story.append(Paragraph("<b>CONTRATANTE</b>", styles['Assinatura']))
    story.append(Paragraph("Pérola Pay Intermediação Financeira LTDA", styles['Assinatura'])) 
    story.append(Paragraph("CNPJ: 61.670.286/0001-07", styles['Assinatura']))
    story.append(Paragraph("Representante: Rafael Nunes Morato", styles['Assinatura'])) 
    story.append(Spacer(1, 0.2 * inch)) # Espaço para assinatura
    story.append(Paragraph("Assinatura: ____________________________", styles['Assinatura']))
    
    story.append(Spacer(1, 0.5 * inch)) # Espaço entre assinaturas

    # Assinatura CONTRATADA
    story.append(Paragraph("<b>CONTRATADA</b>", styles['Assinatura']))
    story.append(Paragraph("Davi de Lima Rosa Desenvolvimento de Software LTDA (DLR Web Studio)", styles['Assinatura']))
    story.append(Paragraph("CNPJ: 63.386.640/0001-00", styles['Assinatura']))
    story.append(Spacer(1, 0.2 * inch)) # Espaço para assinatura
    story.append(Paragraph("Assinatura: ____________________________", styles['Assinatura']))

    # --- GERAR O PDF ---
    try:
        doc.build(story)
        print(f"PDF '{nome_arquivo}' gerado com sucesso na mesma pasta do script.")
    except Exception as e:
        print(f"Erro ao gerar o PDF: {e}")

# Executa a função
if __name__ == "__main__":
    gerar_pdf_contrato()

