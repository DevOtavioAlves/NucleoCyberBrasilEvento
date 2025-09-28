# 🚀 Plataforma Conectada: Rede Social Acadêmica

Bem-vindo à nossa rede social acadêmica! Esta plataforma foi projetada para conectar estudantes, professores e pesquisadores, facilitando a troca de conhecimento, a colaboração em projetos e o desenvolvimento de carreiras.

---

## Índice

- [📖 Guia de Usuário](#-guia-de-usuário)
  - [Primeiros Passos](#primeiros-passos)
  - [Funcionalidades Principais](#funcionalidades-principais)
  - [Perguntas Frequentes (FAQ)](#perguntas-frequentes-faq)
- [⚙️ Configuração do Ambiente e Execução](#️-configuração-do-ambiente-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Passo a Passo da Instalação](#passo-a-passo-da-instalação)
- [Suporte](#suporte)

---

## 📖 Guia de Usuário

Este guia irá orientá-lo através das principais funcionalidades do nosso aplicativo.

### Primeiros Passos

#### 1. Cadastro e Login
Para começar, crie uma conta usando seu e-mail acadêmico. Após o cadastro, você poderá acessar a plataforma com seu login e senha.

#### 2. Configurando seu Perfil
Um perfil completo é seu cartão de visitas na comunidade.
- Acesse a página de **Perfil** através do ícone no menu.
- Adicione uma foto e uma imagem de capa.
- Escreva uma breve biografia sobre você.
- Adicione suas **Áreas de Interesse** para que outros usuários com interesses similares possam te encontrar.

### Funcionalidades Principais

#### 🏠 Home (Feed Principal)
A página inicial é o coração da nossa comunidade. Aqui você pode:
- Ver as publicações mais recentes de outros membros.
- Criar suas próprias publicações, compartilhando artigos, vídeos ou pensamentos.
- Interagir com o conteúdo através de curtidas e comentários.

#### 👤 Perfil
Sua página de perfil centraliza suas informações e atividades.
- **Editar Bio:** Mantenha suas informações e interesses atualizados.
- **Minhas Publicações:** Veja um histórico de tudo que você já publicou.
- **Badges:** Conquiste e exiba medalhas por suas contribuições na plataforma.

#### 👥 Clubes
Os Clubes são espaços para grupos de estudo e discussão sobre temas específicos.
- **Explorar:** Encontre clubes existentes e peça para participar.
- **Criar Clube:** Inicie seu próprio grupo de estudos sobre um tema que você domina ou quer aprender mais.
- **Interagir:** Participe das discussões e compartilhe materiais dentro dos clubes dos quais você faz parte.

#### 💬 Fórum
O Fórum é o local ideal para tirar dúvidas e aprofundar discussões acadêmicas.
- **Filtre por Disciplina:** Encontre facilmente tópicos relacionados ao seu curso ou semestre.
- **Faça uma Pergunta:** Crie um novo tópico para que a comunidade possa te ajudar.
- **Responda e Ajude:** Compartilhe seu conhecimento respondendo às dúvidas de outros usuários.

#### 🏆 Ranking
A gamificação incentiva a participação!
- O ranking mostra os membros mais ativos e prestativos da comunidade.
- Ganhe pontos ao postar, comentar, receber curtidas e ajudar outros no Fórum.

#### 💼 Carreiras (Empregabilidade)
Conectamos você ao mercado de trabalho.
- **Vagas:** Encontre oportunidades de estágio e emprego na sua área.
- **Dicas:** Acesse conteúdos sobre carreira, LinkedIn e processos seletivos.
- **Networking:** Conecte-se com recrutadores e profissionais da sua área.

#### 🔔 Notificações
Fique por dentro de tudo que acontece.
- A página de notificações te avisa sobre novas curtidas, comentários, convites para clubes e respostas em tópicos do Fórum.

#### 🤖 Chat de Ajuda
Está com dúvidas sobre como usar a plataforma?
- Acesse nossa página de **Chat de Ajuda** através do link na sidebar.
- O chatbot possui respostas para as perguntas mais comuns sobre as funcionalidades do aplicativo.

### Perguntas Frequentes (FAQ)

**P: Como funciona a pontuação do Ranking?**
**R:** Você ganha pontos por interações positivas, como criar posts populares, responder dúvidas no Fórum e participar ativamente dos Clubes.

**P: Posso criar um clube sobre qualquer tema acadêmico?**
**R:** Sim! Encorajamos a criação de grupos de estudo sobre qualquer disciplina ou tema de interesse acadêmico.

---

## ⚙️ Configuração do Ambiente e Execução

Siga as instruções abaixo para configurar e executar o projeto em sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

Antes de começar, garanta que você tenha os seguintes softwares instalados:

* **[Node.js](https://nodejs.org/)**: Versão 18.x ou superior. (O `npm` é instalado automaticamente com o Node.js).
* **[Git](https://git-scm.com/)**: Para clonar o repositório.
* Um editor de código de sua preferência (recomendamos o **[VS Code](https://code.visualstudio.com/)**).

### Passo a Passo da Instalação

#### 1. Clonar o Repositório
Primeiro, clone este repositório para a sua máquina local usando o Git.
```bash
git clone [URL-do-seu-repositório-git]
```

#### 2. Navegar para a Pasta do Projeto
Entre na pasta do projeto que você acabou de clonar.
```bash
cd [nome-da-pasta-do-projeto]
```

#### 3. Instalar as Dependências
Este projeto utiliza `npm` para gerenciar seus pacotes. Execute o comando abaixo para instalar tudo que é necessário (Express, EJS, etc.).
```bash
npm install
```

#### 4. Configurar as Variáveis de Ambiente
Crie um arquivo chamado `.env` na raiz do projeto e adicione as variáveis necessárias. Para começar, apenas a porta do servidor é essencial.
```env
# .env
# Porta em que o servidor irá rodar
PORT=8081
```

#### 5. Inicializar o Servidor
Com tudo configurado, você pode iniciar a aplicação.

* **Para desenvolvimento (recomendado, reinicia automaticamente ao salvar):**
    ```bash
    npm run dev
    ```
* **Para produção:**
    ```bash
    npm start
    ```

Após executar o comando, você verá uma mensagem no terminal confirmando que o servidor está no ar: `Servidor rodando em http://localhost:8081`

#### 6. Acessar a Aplicação
Abra seu navegador e acesse a URL: **[http://localhost:8081](http://localhost:8081)**

---