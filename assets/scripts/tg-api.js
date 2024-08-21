console.info("include tg-api.js");

const appURL =
  "https://script.google.com/macros/s/AKfycbxUfah08M6mnKmQoArrr6L37QZgKf_1L_dDKQtaa8egMvF88vKZ-4yKRQyiUkrTSHgr/exec";
const appScriptId = "1m-d6mXdpbPmSqNVNulU8rCaub9S4PaxUUS8h-T9c7U5k3Zv8o3gZ8fO9";

const tgToken = "5211032957:AAFzvaxLthV_PT1Yr038sJO3tGhuioy0K6E";
const tgCharinID = "304725070";
const tgInfoBotID = "5211032957";

const cryptoKey = "max-security-123";

async function sendMessageToBot(messageText) {
  const chatID = tgCharinID; // ID чата, куда будет отправлено сообщение

  const url = `https://api.telegram.org/bot${tgToken}/sendMessage`;
  const params = {
    chat_id: chatID,
    text: messageText,
    parse_mode: "HTML"
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    });

    const data = await response.json();
    if (data.ok) {
      console.log("Message sent successfully:", data);
      alert("Сообщение отправлено успешно!");
    } else {
      console.error("Failed to send message:", data);
      alert("Не удалось отправить сообщение.");
    }
  } catch (error) {
    console.error("Error occurred while sending message:", error);
    alert("Произошла ошибка при отправке сообщения.");
  }
}

// Send file via bot
function sendFileToTelegram(chatId, file) {
  const url = `https://api.telegram.org/bot${tgToken}/sendDocument`;
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("document", file);
  fetch(url, {
    method: "POST",
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        console.log("File sent successfully:", data);
        alert("Файл отправлен успешно!");
      } else {
        console.error("Failed to send file:", data);
        alert("Не удалось отправить файл.");
      }
    })
    .catch((error) => {
      console.error("Error occurred while sending file:", error);
      alert("Произошла ошибка при отправке файла.");
    });
}

function sendMessage() {
  const message = document.getElementById("message").value;
  sendMessageToBot(message);
}
