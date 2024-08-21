console.info("include multi-tool.js");

function log(msg, desc) {
  if (desc) console, log(desc + " :");
  console.log(msg);
}

async function fileToJson(file, maxKbPartSize) {
  const maxBytesPartSize = maxKbPartSize * 1024; // переводим размер из КБ в байты
  const json = {};
  const fileSize = file.size;
  let offset = 0;
  let partIndex = 0;

  while (offset < fileSize) {
    // Читаем часть файла
    const blobPart = file.slice(offset, offset + maxBytesPartSize);
    const arrayBuffer = await blobPart.arrayBuffer();
    const base64String = btoa(
      String.fromCharCode(...new Uint8Array(arrayBuffer))
    );

    // Добавляем часть в JSON
    json[`part${partIndex}`] = base64String;

    // Смещаемся на размер прочитанной части
    offset += maxBytesPartSize;
    partIndex++;
  }

  return json;
}

function jsonToFile(json, fileName, fileType) {
  const parts = Object.keys(json).map((key) => {
    // Декодируем Base64-строку обратно в массив байтов
    const byteString = atob(json[key]);
    const byteNumbers = new Array(byteString.length);

    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return byteArray;
  });

  // Создаем Blob из массива Uint8Array
  const blob = new Blob(parts, { type: fileType });
  return new File([blob], fileName, { type: fileType });
}

// Функция проверки, соответствует ли объект условиям фильтра
function isMatchesFilter(rowObj, filterOptions) {
  for (const key in filterOptions) {
    const filterValue = filterOptions[key];
    const recordValue = rowObj[key]?.trim(); // Очищаем пробелы перед сравнением

    if (Array.isArray(filterValue)) {
      // Если фильтр допускает несколько значений (например, ["Дефект промсреды"])
      if (!filterValue.includes(recordValue)) {
        console.log(
          `Несоответствие: ${key} в записи "${
            rowObj["Номер драфта"]
          }". Ожидаемые: ${filterValue.join(
            ", "
          )}, фактическое: "${recordValue}"`
        );
        return false;
      }
    } else if (recordValue !== filterValue) {
      console.log(
        `Несоответствие: ${key} в записи "${rowObj["Номер драфта"]}". Ожидаемое: "${filterValue}", фактическое: "${recordValue}"`
      );
      return false;
    }
  }

  return true;
}

//Download file by chunks
function downloadHtmlSource(url) {
  let htmlPage = fetch(url).then(
    (response) => log(response.text),
    (error) => log(error)
  );

  return htmlPage;
}

// Copy to clipboard
function copyToClipboard(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function getFilteredObjects(objectsArray, filterOptions) {
  return objectsArray.filter((rowObj) =>
    isMatchesFilter(rowObj, filterOptions)
  );
}

function serializeFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file); // Преобразуем файл в Base64 строку
  });
}

function deserializeFile(base64Data, fileName, mimeType) {
  const byteString = atob(base64Data.split(",")[1]); // Декодируем Base64
  const byteNumbers = new Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  return new File([blob], fileName, { type: mimeType });
}

// Функция для преобразования строки в объект Date
function parseDate(dateString) {
  if (!typeof dateString === undefined) {
    if (dateString.includes(" ")) {
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split(".");
      const [hours, minutes] = timePart.split(":");
      return new Date(year, month - 1, day, hours, minutes);
    } else {
      const [day, month, year] = dateString.split(".");
      return new Date(year, month - 1, day);
    }
  }
  return undefined; // Возвращаем null, если входная строка пустая
}

function fileToText(file, callback) {
  const reader = new FileReader();

  reader.onload = function (event) {
    const dataURL = event.target.result;
    const base64EncodedString = dataURL.split(",")[1];
    callback(base64EncodedString);
  };

  // Чтение файла как data URL
  reader.readAsDataURL(file);
}

function textToFile(fileText, fileName, mimeType) {
  // Преобразуем текстовую строку в бинарные данные
  const binaryData = atob(fileText);

  // Создаем массив байтов
  const byteNumbers = new Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteNumbers[i] = binaryData.charCodeAt(i);
  }

  // Преобразуем массив байтов в Uint8Array
  const byteArray = new Uint8Array(byteNumbers);

  // Создаем Blob из бинарных данных
  const blob = new Blob([byteArray], { type: mimeType });

  // Создаем ссылку для скачивания файла
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;

  // Автоматически кликаем по ссылке, чтобы начать загрузку
  link.click();
}

// Returns console events
function getConsoleEvents() {
  let consoleEvents = [];
  let consoleEvent = {};
  let consoleEventName = "";

  for (let i = 0; i < console.log.length; i++) {
    consoleEvent = console.log[i];
    consoleEventName = consoleEvent.name;
    consoleEvents.push(consoleEventName);
  }
  return consoleEvents;
}
