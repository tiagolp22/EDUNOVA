
/**
 * Simula o envio de um email
 * @param {string} to - Endereço de email do destinatário.
 * @param {string} subject - Assunto do email.
 * @param {string} message - Mensagem do email.
 * @returns {Object} - Retorna uma mensagem de sucesso.
 */
exports.sendEmail = async (to, subject, message) => {
    // Implemente a lógica de envio de email aqui
    console.log(`Enviando email para ${to} com o assunto: ${subject}`);
    return { success: true, message: 'Email enviado com sucesso' };
};
