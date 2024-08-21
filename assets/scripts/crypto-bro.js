console.info("include crypto-bro.js");

class CryptoBro {
  constructor(secretKey) {
    this.secretKey = secretKey;
  }

  secretKey = "max-secure-123";

  encrypString(plainText) {
    const encryptedMessage = [];
    const keyLength = this.secretKey.length;
    const messageLength = plainText.length;

    for (let i = 0; i < messageLength; i++) {
      const plainChar = plainText.charCodeAt(i);
      const keyChar = this.secretKey.charCodeAt(i % keyLength);
      const encryptedChar = plainChar ^ keyChar;

      encryptedMessage.push(String.fromCharCode(encryptedChar));
    }

    return encryptedMessage.join("");
  }

  decryptString(encryptedMessage) {
    const decryptedMessage = [];
    const keyLength = this.secretKey.length;
    const messageLength = encryptedMessage.length;

    for (let i = 0; i < messageLength; i++) {
      const encryptedChar = encryptedMessage.charCodeAt(i);
      const keyChar = this.secretKey.charCodeAt(i % keyLength);
      const decryptedChar = encryptedChar ^ keyChar;

      decryptedMessage.push(String.fromCharCode(decryptedChar));
    }

    return decryptedMessage.join("");
  }
}

function cryptoBroSelfTest(params) {
  const plainText = "Секретные материалы";
  const key = "max-secure-123";

  const cryptoBro = new CryptoBro(key);
  const encryptedMessage = cryptoBro.encrypString(plainText);
  const dercryptedMessage = cryptoBro.decryptString(encryptedMessage);

  result = {
    encryptString: encryptedMessage,
    decryptString: dercryptedMessage
  };
  return result;
}
