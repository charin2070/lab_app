// Функции для работы с файлами

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

// Тест fileToBinaryString, binaryStringToFile
async function selfTestFileToString() {
  // Шаг 1: Создаем элемент input для выбора исходного файла
  const input = document.createElement("input");
  input.type = "file";

  input.onchange = async (event) => {
    const file = event.target.files[0];
    log(file, "File for convertion to binary string");

    if (file) {
      try {
        // Шаг 2: Конвертируем файл в бинарную строку и сохраняем её
        const binaryString = await fileToBinaryString(file);
        binaryStringToFile(binaryString, file.type);

        log(
          "Файл сохранён как текстовая строка. Теперь выберите сохранённый файл для восстановления.",
          "[binaryStringToFile]"
        );

        // Шаг 3: Создаем элемент input для выбора сохраненного текстового файла
        const loadedFileInput = document.createElement("input");
        loadedFileInput.type = "file";

        loadedFileInput.onchange = async (loadEvent) => {
          const savedFile = loadEvent.target.files[0];

          if (savedFile) {
            // Шаг 4: Загружаем строку из файла и преобразуем её обратно в Blob
            const loadedBlob = await loadBinaryFile(savedFile);
            const loadedString = new TextDecoder().decode(loadedBlob);
            console.log("Строка из загруженного файла:", loadedString);
            loadedFileInput.value = null;
            input.value = null;
            loadedFileInput.removeEventListener(
              "change",
              loadEvent.target.onchange
            );
            input.removeEventListener("change", event.target.onchange);
            loadedFileInput.remove();
            input.remove();
            loadedBlob.close();
            loadedString.close();
            window.URL.revokeObjectURL(loadedBlob.url);
          } else {
            console.info("Не удалось загрузить файл");
          }
          loadedFileInput.value = null;
          input.value = null;
        };
        loadedFileInput.accept = ".txt";
      } catch (e) {
        console.log(e);
      }
    }
  };

  input.click();
}

// Returns file from created open file dialog
function selectFile() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      log(file, "File for convertion to binary string");
      return resolve(file), reject("FUCK");
    };
  });
}
