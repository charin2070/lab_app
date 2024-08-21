// Тестирование функций
log("include check-app.js");

function checkSendToTelegram() {
  selectFile().then = () => {
    sendFileToTelegram(tgCharinID, "Message HERE!");
  };
}
