import CryptoJS from "crypto-js";

export const encryptText = (text: string, password: string) => {
  return CryptoJS.AES.encrypt(text, password).toString();
};
