document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".contactForm form");
    const submitButton = form.querySelector('.btnSend');
    const originalButtonText = submitButton.innerHTML;

    // Função para mostrar mensagens traduzidas
    function getTranslatedMessage(key) {
        if (window.languageManager) {
            const translation = window.languageManager.getTranslation(key);
            return translation || getDefaultMessage(key);
        }
        return getDefaultMessage(key);
    }

    function getDefaultMessage(key) {
        const messages = {
            'name-required': 'Por favor, preencha o nome.',
            'email-required': 'Por favor, insira um e-mail válido.',
            'subject-required': 'Por favor, preencha o assunto.',
            'message-required': 'Por favor, escreva sua mensagem.',
            'sending': 'Enviando...',
            'success': 'Mensagem enviada com sucesso!',
            'error': 'Ocorreu um erro ao enviar. Tente novamente.',
            'connection-error': 'Falha na conexão. Verifique sua internet.'
        };
        return messages[key] || 'Erro desconhecido';
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Desabilita o botão e mostra loading
        submitButton.disabled = true;
        submitButton.innerHTML = '<span>Enviando...</span>';

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const subject = form.subject.value.trim();
        const message = form.message.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validações
        if (!name) {
            window.emailService?.showNotification(getTranslatedMessage('name-required'), 'error');
            resetButton();
            return;
        }

        if (!emailRegex.test(email)) {
            window.emailService?.showNotification(getTranslatedMessage('email-required'), 'error');
            resetButton();
            return;
        }

        if (!subject) {
            window.emailService?.showNotification(getTranslatedMessage('subject-required'), 'error');
            resetButton();
            return;
        }

        if (!message) {
            window.emailService?.showNotification(getTranslatedMessage('message-required'), 'error');
            resetButton();
            return;
        }

        try {
            // Aguarda o EmailJS estar pronto
            if (!window.emailService?.isInitialized) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const result = await window.emailService.sendEmail({
                name,
                email,
                subject,
                message
            });

            if (result.success) {
                window.emailService.showNotification(getTranslatedMessage('success'), 'success');
                form.reset();
            } else {
                window.emailService.showNotification(getTranslatedMessage('error'), 'error');
            }

        } catch (error) {
            console.error('Erro no envio:', error);
            window.emailService?.showNotification(getTranslatedMessage('connection-error'), 'error');
        } finally {
            resetButton();
        }
    });

    function resetButton() {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
});