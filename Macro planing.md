FASE 1: A Fundação (Infraestrutura e Painel)
O seu objetivo aqui é criar a "cabeça" do sistema (O Headless CMS) para que o cliente tenha onde cadastrar os produtos.

✅ Instalar o Payload CMS: Você vai criar um novo projeto Node.js no seu Optiplex 790 usando o Payload CMS.

✅ Conectar ao Cofre: Você vai apontar o arquivo .env do Payload para o seu banco de dados MongoDB que roda blindado no Optiplex 3010.

Plugar o MinIO: Você vai instalar o plugin oficial do S3 no Payload e configurá-lo com as chaves do seu MinIO (que já está configurado no túnel do Cloudflare). Assim, quando o cliente arrastar uma foto no painel do Payload, a foto vai direto pro seu HD de 1TB.

Modelar os Dados: No código do Payload, você vai criar uma Collection (Tabela) chamada Produtos. Você vai definir via código os campos: Nome, Descricao, Preco, Imagem, e o campo opcional urlMercadoLivre.

O que o cliente faz aqui: Ele recebe de você um login e senha. Ele entra no painel, vê uma interface bonita e começa a cadastrar as capas e cases dele.

FASE 2: A Vitrine (Pacote Básico)
Aqui você entrega a primeira versão funcional do site, usando a estratégia de redirecionar para o Mercado Livre.

Abertura da API: O Payload já gera a API automaticamente. Você só precisa garantir que a rota GET /api/produtos esteja pública para leitura.

Integração com a Landing Page: Você vai orientar o seu amigo. Ele vai colocar um script JavaScript simples no HTML dele que "bate" na sua API, pega o JSON dos produtos cadastrados e cria os cards (as fotos e preços) dinamicamente na tela.

O Botão Condicional: No JavaScript da Landing Page, vocês vão programar a regra: "Se esse produto tiver um link no campo urlMercadoLivre, o botão da página será 'Comprar no Mercado Livre' e levará o cliente pra lá."

O que o cliente ganha aqui: Um site lindo, sempre atualizado (pois ele mesmo muda os produtos no painel) e que usa a autoridade da página própria para fechar vendas na segurança do ML.

FASE 3: O Carrinho Próprio (Pacote Premium)
Aqui é onde você para de mandar o cliente para o ML e passa a reter o dinheiro e a margem de lucro no ecossistema de vocês.

Lógica de Carrinho (Frontend): Seu amigo (ou você ajudando ele) vai criar a função de salvar os itens escolhidos no localStorage do navegador e criar a telinha lateral de "Resumo do Pedido" na Landing Page.

Criação da Rota de Checkout (Backend): Você vai criar uma rota customizada no Payload (ex: POST /api/checkout). Ela vai receber apenas os IDs dos produtos que o cliente quer comprar.

Integração com Gateway: O seu código no Payload vai buscar os preços reais desses IDs no MongoDB, somar tudo, e fazer uma requisição (usando chaves secretas) para a API do PagBank ou Stripe.

Devolução do Link: A sua API devolve o "Link de Pagamento Seguro" para a Landing Page, e o cliente passa o cartão.

O que o cliente ganha aqui: Margem de lucro maior, fugindo das taxas abusivas dos marketplaces.

FASE 4: O Cérebro Logístico (Automação de Estoque e Webhooks)
O cliente pagou no PagBank. E agora? Aqui você automatiza o pós-venda para que o dono do site não precise fazer nada manualmente.

Ouvinte de Webhooks: Você vai criar uma rota no Payload (ex: POST /api/webhook/pagamento) para ficar "escutando" o PagBank. Quando o PagBank avisar que a fatura foi paga, essa rota entra em ação.

Baixa de Estoque: Respeitando a sua regra de Single Responsibility (SRP), você cria um Service que vai no banco de dados e diminui -1 no estoque daquele produto específico.

Aviso no Painel: O sistema cria um registro na coleção Pedidos dentro do Payload, para que o dono do site entre de manhã e veja: "Opa, tenho 3 pedidos novos pagos para enviar pelos Correios".

FASE 5: A Experiência Mágica (Integração Calango Bot - Pacote Ultimate)
A cereja do bolo. A automação de CRM usando sua infraestrutura existente.

Conexão de Microsserviços: Na mesma hora que o webhook do PagBank confirmar o pagamento (Fase 4), o seu Payload vai disparar uma requisição HTTP interna para o servidor do seu Calango Bot.

Disparo do WhatsApp: O Calango Bot pega o número do telefone do cliente que veio no pedido e manda a mensagem automática: "Fala, [Nome]! Pagamento aprovado! Já estamos separando a sua bag."