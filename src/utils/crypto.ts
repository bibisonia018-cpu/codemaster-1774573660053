import CryptoJS from 'crypto-js';

export const encryptMessage = (text: string, secretKey: string): string => {
  if (!text || !secretKey) return text;
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decryptMessage = (encryptedText: string, secretKey: string): string => {
  if (!encryptedText || !secretKey) return encryptedText;
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    
    // If decryption yields empty string but there was text, wrong password was used
    if (!originalText && encryptedText) {
      return "🔒 [رسالة مشفرة - كلمة سر خاطئة]";
    }
    return originalText;
  } catch (error) {
    return "🔒 [رسالة مشفرة - غير قادر على فك التشفير]";
  }
};

export const generateRandomRoomId = () => {
  return Math.random().toString(36).substring(2, 10);
};