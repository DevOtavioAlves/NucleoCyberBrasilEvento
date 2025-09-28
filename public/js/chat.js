// Função principal para rodar o chat
function rodarChat() {
    const messagesContainer = document.getElementById('chat-messages');
    const optionsContainer = document.getElementById('chat-options');

    // Se não estiver na página do chat, não faz nada.
    if (!messagesContainer || !optionsContainer) {
        return;
    }

    const chatScript = {
        perguntaInicial: "Olá! Sou seu assistente virtual. Como posso te ajudar hoje?",
        perguntaRetorno: "Posso ajudar com algo mais?",
        opcoes: [
            { texto: "Dúvidas sobre o Fórum", resposta: "O Fórum é o lugar para você tirar dúvidas acadêmicas, discutir temas e interagir com monitores e professores. Explore os tópicos e participe!" },
            { texto: "Como funcionam os Clubes?", resposta: "Os Clubes são grupos de estudo criados por alunos ou professores para aprofundar conhecimentos. Você pode criar ou participar de um na página 'Meus Clubes'." },
            { texto: "O que são as Recompensas?", resposta: "Você ganha pontos e medalhas ao participar da comunidade. Acompanhe suas conquistas na página 'Minhas Recompensas'!" },
            { texto: "Você pode me ajudar a elaborar um simulado?", resposta: "Infelizmente não no momento, mas futuramente irei conseguir te ajudar e avisarei quando puder!" }
        ]
    };

    const adicionarMensagem = (texto, tipo) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${tipo}-message`;
        messageDiv.textContent = texto;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Função que cria os botões de opção
    const mostrarOpcoes = () => {
        optionsContainer.innerHTML = ''; // Limpa opções antigas

        chatScript.opcoes.forEach(opcao => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = opcao.texto;

            button.onclick = () => {
                // 1. Mostra a escolha do usuário
                adicionarMensagem(opcao.texto, 'user');

                // 2. Limpa os botões de opção temporariamente
                optionsContainer.innerHTML = '';

                // 3. Mostra a resposta do bot após um pequeno delay
                setTimeout(() => {
                    adicionarMensagem(opcao.resposta, 'bot');
                    
                    // 4. Mostra a pergunta de retorno
                    setTimeout(() => {
                        adicionarMensagem(chatScript.perguntaRetorno, 'bot');
                        // 5. Mostra as opções novamente para a próxima pergunta
                        mostrarOpcoes();
                    }, 1000); // Delay para a pergunta de retorno

                }, 500); // Delay para a resposta
            };
            optionsContainer.appendChild(button);
        });
    };
    
    // Função que inicia a conversa
    const iniciarChat = () => {
        messagesContainer.innerHTML = '';
        adicionarMensagem(chatScript.perguntaInicial, 'bot');
        mostrarOpcoes();
    };

    iniciarChat();
}

// Garante que o DOM está carregado antes de executar o script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', rodarChat);
} else {
    rodarChat();
}