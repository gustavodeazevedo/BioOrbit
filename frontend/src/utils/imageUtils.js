/**
 * Utilitários para manipulação de imagens
 */

/**
 * Converte uma imagem para base64
 * @param {string} imagePath - Caminho da imagem
 * @returns {Promise<string>} - Imagem em base64
 */
export const imageToBase64 = (imagePath) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            ctx.drawImage(this, 0, 0);

            try {
                const dataURL = canvas.toDataURL('image/png');
                resolve(dataURL);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = function () {
            reject(new Error('Erro ao carregar a imagem'));
        };

        img.src = imagePath;
    });
};

/**
 * Logo da empresa em base64 (fallback caso não consiga carregar dinamicamente)
 */
export const LOGO_BASE64_FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
