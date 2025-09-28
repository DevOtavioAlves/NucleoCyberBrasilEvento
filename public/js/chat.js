document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do DOM
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');

    // VERIFICAÇÃO IMPORTANTE:
    // Se não encontrar os elementos do chat, o script para aqui.
    // Isso garante que ele só execute na página /chat.
    if (!messagesContainer || !optionsContainer) {
        return; 
    }

    // --- CONTEÚDO DO CHAT ---
    const chatScript = {
        perguntaInicial: "Olá! Sou seu assistente virtual. Como posso te ajudar hoje?",
        opcoes: [
            {
                texto: "Dúvidas sobre o Fórum",
                resposta: "O Fórum é o lugar para você tirar dúvidas acadêmicas, discutir temas e interagir com monitores e professores. Explore os tópicos e participe!"
            },
            {
                texto: "Como funcionam os Clubes?",
                resposta: "Os Clubes são grupos de estudo criados por alunos ou professores para aprofundar conhecimentos em áreas específicas. Você pode criar ou participar de um clube existente na página 'Meus Clubes'."
            },
            {
                texto: "O que são as Recompensas?",
                resposta: "Você ganha pontos e medalhas ao participar da comunidade (postando, comentando, ajudando outros alunos). Acompanhe suas conquistas na página 'Minhas Recompensas'!"
            }
        ]
    };

    // Função para adicionar uma mensagem na tela
    const adicionarMensagem = (texto, tipo) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${tipo}-message`;
        messageDiv.textContent = texto;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Função para iniciar o chat
    const iniciarChat = () => {
        messagesContainer.innerHTML = '';
        optionsContainer.innerHTML = '';
        adicionarMensagem(chatScript.perguntaInicial, 'bot');

        chatScript.opcoes.forEach(opcao => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = opcao.texto;
            button.onclick = () => {
                adicionarMensagem(opcao.texto, 'user');
                setTimeout(() => {
                    adicionarMensagem(opcao.resposta, 'bot');
                }, 500);
                optionsContainer.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
            };
            optionsContainer.appendChild(button);
        });
    };

    // INICIA O CHAT ASSIM QUE A PÁGINA CARREGA
    iniciarChat();
});