const csvHeaders = `Номер драфта;тип дефекта;дата открытия;дата закрытия;Дата наступления SLA;Дней в работе;Дн;Статус;Команда устр проблему;Приоритет;Тематика;Метки;Кол-во инцидентов;Норматив;Дн2;Выполнение норматива;Сервис ошибки;;;`;
const csvSample = `ADIRINC-1701;Дефект промсреды;26.06.2024 10:42;05.07.2024 8:10;08.08.2024;4,894189815;Дней;Закрыт;K2;Средний;Терминалы (кроме QUIK) - Другое (4) - low;;;60;Дней;Да;АИ ПРО ВТ;;;`;

// Парсим CSV строку в объект
function parseCsvToObject(csvString, headers) {
  const values = csvString.split(";");
  const resultObject = {};

  headers.split(";").forEach((header, index) => {
    let value = values[index] || null;
    header = header.trim(); // Убираем лишние пробелы

    if (header === "тип дефекта" && value !== "Дефект промсреды") {
      return; // Пропускаем запись, если тип дефекта не совпадает
    }

    if (
      ["дата открытия", "дата закрытия", "Дата наступления SLA"].includes(
        header
      )
    ) {
      value = parseDate(value);
    }

    resultObject[header] = parseValue(value);
  });

  return resultObject;
}

// Обработка значения (замена пустого значения на null)
function parseValue(value) {
  return value === "" ? null : value;
}

function parseDate(dateString) {
  if (typeof dateString === "string") {
    const [dayPart, timePart] = dateString.split(" ");
    const [day, month, year] = dayPart.split(".");
    const [hours, minutes] = timePart ? timePart.split(":") : [0, 0];

    return new Date(year, month - 1, day, hours, minutes);
  } else if (dateString instanceof Date) {
    return dateString;
  } else {
    console.error("Invalid date format:", dateString);
    return null;
  }
}

// Преобразование CSV строки в массив объектов
function csvToObjects(csvString) {
  const csvLines = csvString.trim().split("\n");
  const csvHeaders = csvLines.shift();

  return csvLines.map((csvLine) => parseCsvToObject(csvLine, csvHeaders));
}

// Проверка на наличие валидных данных в дефекте (реализация placeholder)
function isValidDefect(defect) {
  // Пример проверки на обязательные поля
  return defect["Номер драфта"] && defect["тип дефекта"];
}

// Подсчет разделителей в строке
function countDelimiters(sourceString) {
  return {
    comma: (sourceString.match(/,/g) || []).length,
    semicolon: (sourceString.match(/;/g) || []).length
  };
}

// Определение разделителя CSV (запятая или точка с запятой)
function detectDelimiter(csvString) {
  const delimiters = countDelimiters(csvString);

  if (delimiters.comma === delimiters.semicolon) {
    throw new Error("Automatic delimiter detection failed.");
  }

  return delimiters.comma > delimiters.semicolon ? "," : ";";
}

// Удаление кавычек из строки
function removeQuotes(sourceString) {
  return sourceString.replace(/["']/g, "");
}

// Загрузка CSV файла и преобразование его в объекты
async function loadFromCsvFile(csvFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const defects = csvToObjects(event.target.result);
        resolve(defects);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(csvFile);
  });
}
