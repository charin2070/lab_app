// Функции для работы с файлами

// URL веб-приложения Google Apps Script, который принимает POST-запрос
const url =
  "https://script.google.com/macros/s/AKfycbxw0vyjd2SKCMl-Yt5lq1NVSFJRMEfOOHhHnpitq3IPY2LvY3zV4kyGx7dB2rhJXJyM/exec";

// Генерирует бинарную строку из файла file
function fileToBinaryString(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      // Получаем бинарные данные как Base64 строку
      const binaryString = btoa(event.target.result); // Преобразуем бинарные данные в Base64
      resolve(binaryString);
    };
    reader.onerror = function (event) {
      reject(new Error("Ошибка чтения файла: " + event.target.error.code));
    };
    reader.readAsBinaryString(file); // Читаем файл как бинарную строку
  });
}

function binaryStringToFile(
  binaryString,
  mimeType = "application/octet-stream"
) {
  // Генерация имени файла на основе MIME типа и текущей даты
  const extension = mimeType.split("/")[1] || "bin"; // Используем расширение на основе MIME типа
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-"); // Временная метка без двоеточий и точек
  const fileName = `file_${mimeType.replace(
    "/",
    "_"
  )}_${timestamp}.${extension}`;

  // Преобразование бинарной строки в Blob
  const byteCharacters = atob(binaryString);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  // Создание ссылки для скачивания файла
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);

  log(link, "binaryStringToFile. link");

  link.download = fileName;
  link.click();

  // Очистка объекта URL
  URL.revokeObjectURL(link.href);
}

function loadBinaryFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const binaryString = event.target.result;

      // Извлекаем информацию из имени файла
      const [_, mimeTypePart] =
        file.name.match(/file_(.+)_[\dT:-]+\.([a-z0-9]+)$/) || [];
      if (!mimeTypePart) {
        return reject(
          new Error("Не удалось определить MIME тип из имени файла")
        );
      }

      const mimeType = mimeTypePart.replace("_", "/");

      // Преобразуем Base64 строку обратно в массив байт
      const byteCharacters = atob(binaryString);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Создаем файл (Blob) с правильным MIME типом
      const blob = new Blob([byteArray], { type: mimeType });
      resolve(blob);
    };

    reader.onerror = function (event) {
      reject(new Error("Ошибка чтения файла: " + event.target.error.code));
    };

    reader.readAsText(file); // Читаем файл как текст
  });
}

pickFile().then((file) => {
  if (file) {
    console.log("Выбранный файл:", file.name);
    // Вы можете здесь работать с файлом, например, читать его содержимое
  } else {
    console.log("Файл не был выбран.");
  }
});

function sendPostRequest() {
  const data = {
    key: "APIKEY",
    fileUrl: "https://example.com/file.exe",
    folderId: "1UzY7AUy0AMoAuddJZO7U4D7osL2W3bEz"
  };

  const url = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    mode: "no-cors"
  })
    .then(() => {
      console.log("Request sent successfully");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
