# Moovy

## Contexto e Requisitos

1. **Busca de Filmes**
   - Como um entusiasta de filmes, eu quero buscar filmes para aprender mais sobre eles.
   - A busca deve exibir uma lista de filmes com nome, pôster e classificação IMDB.
   - A lista deve ser filtrada em tempo real conforme o usuário digita.
   - Tela: Busca de filmes (Web).

2. **Gerenciamento da Biblioteca**
   - **Adicionar à Biblioteca**: Como um entusiasta de filmes, eu quero armazenar os filmes que assisti para lembrá-los no futuro.
     - Haverá uma lista chamada "Minha Biblioteca".
     - O sistema exibirá uma mensagem de sucesso ao adicionar um filme.
     - Telas: Busca (Web) e Biblioteca (Mobile).
   - **Visualizar Biblioteca**: Como um entusiasta de filmes, eu quero visualizar os filmes da minha biblioteca para manter o controle.
     - A lista mostrará nome, pôster e classificação IMDB dos filmes.
     - Tela: Biblioteca (Web e Mobile).
   - **Remover da Biblioteca**: Como um entusiasta de filmes, eu quero remover filmes da minha biblioteca para manter a lista atualizada.
     - Haverá botões para remover filmes tanto na busca quanto na biblioteca.
     - Telas: Biblioteca (Web e Mobile).

3. **Review de Áudio**
   - **Criar Review de Áudio**: Como um entusiasta de filmes, eu quero gravar resenhas em áudio dos filmes da minha biblioteca.
     - A gravação só pode ser feita em dispositivos móveis e offline, com sincronização automática ao reconectar à internet.
     - O status da gravação deve ser exibido como "Sincronizado" ou "Pendente".
     - Tela: Gravação de Áudio (Mobile).
   - **Ouvir Review de Áudio**: Como um entusiasta de filmes, eu quero ouvir minhas resenhas para relembrar e avaliar os filmes.
     - A reprodução deve estar disponível tanto no app móvel quanto no web.
     - Tela: Reprodução de Review (Mobile e Web).
   - **Excluir Review de Áudio**: Como um entusiasta de filmes, eu quero deletar minhas resenhas em áudio caso mude de opinião.
     - Somente reviews já gravadas podem ser deletadas, e isso só pode ser feito no app móvel.
     - Tela: Deletar Review de Áudio (Mobile).

Para atender aos requisitos, foram realizadas as seguintes etapas:
1. **Prototipação do Sistema**: Foi criada uma prototipação das telas do sistema utilizando a ferramenta Figma.
   - [Prototipação do Sistema](https://www.figma.com/design/byH2CT5gkq5mKMEXtaAcDE/Dev-Challenge-2021%2F1?node-id=78-62&node-type=canvas)
   
2. **Modelagem do Banco de Dados Relacional**: Foi elaborada uma modelagem do banco de dados relacional para definir as entidades e seus relacionamentos.
   - [Modelagem do Banco de Dados](https://dbdiagram.io/d/Moovy-App-66ea3005a0828f8aa62fbafc)

3. **Documentação de rotas em http**: As rotas e requerimentos dos endpoints utilizados no sistema através do Postman.
   - [Documentação das Rotas](https://documenter.getpostman.com/view/15123575/2sAXqtc2Zd)

## Decisões de Projeto

### Linguagem e Tecnologias Utilizadas
- **Linguagem Principal**: TypeScript, escolhido pela sua capacidade de detectar erros de tipo em tempo de compilação, garantindo maior segurança e robustez ao código.
- **Backend**:
  - **ORM**: Prisma, pela sua integração com TypeScript e praticidade na manipulação de dados.
  - **Testes**: Jest, escolhido pela familiaridade e capacidade de realizar testes paralelos com resultados confiáveis.
- **Frontend**:
  - **Framework**: Vite, devido à sua capacidade de oferecer uma experiência de desenvolvimento mais rápida com recarga rápida (fast refresh).
  - **Estilização**: Styled Components, pela praticidade no reaproveitamento de código e criação de componentes estilizados.
  - **Bibliotecas Auxiliares**: MUI (Material-UI) para componentes de paginação e ícones.

### Estrutura do Projeto
- **Backend**: Foram criados serviços e controladores para cada classe do sistema (Paciente, Médico, Responsável, Lembrete), seguindo uma arquitetura de pastas organizada.
- **Frontend**: Foram criados 4 componentes principais (Box, Button, Input, Text) para reaproveitamento ao longo do projeto, além de um hook para monitoramento da dimensão da tela, garantindo melhor responsividade.
- **Estilização Global**: Definiu-se um arquivo `theme.tsx` com a estilização presente em todo o código, garantindo consistência visual em toda a aplicação.

## Instruções para Execução do Sistema

Claro, aqui está a complementação:

## Instruções para Execução do Sistema

Antes de iniciar o sistema, é necessário adicionar um arquivo `.env` na raiz do diretório `server` com as seguintes informações:

```plaintext
DATABASE_URL="file:./database.sqlite"
PORT=3030
APP_URL='http://localhost:5173'
APP_URL_NATIVE='http://192.168.0.78:8081'
```

1. **Clone o Repositório**:
   ```bash
   git clone https://github.com/FelippeVelosoMarinho/LembretesSystem.git
   ```

2. **Backend**:
   - Abra um terminal e navegue até a pasta do backend:
     ```bash
     cd server
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Inicie o servidor:
     ```bash
     npm run start
     ```

3. **Frontend**:
   - Abra outro terminal e navegue até a pasta do frontend:
     ```bash
     cd client
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Inicie o cliente:
     ```bash
     npm run dev
     ```

     Seguindo esse passo a passo o sistema poderá ser utilizado em seu navegador pelo endereço: http://localhost:5173/

4. **App Native**:
   - Abra outro terminal e navegue até a pasta do frontend:
     ```bash
     cd client-app
     ```
   - Instale as dependências:
     ```bash
     npm install
     ```
   - Inicie o cliente:
     ```bash
     npm run android
     ```

     Seguindo esse passo a passo o app irá rodar aaplicação em expo go ou em um emulador pelo endereço: http://192.168.0.78:8081