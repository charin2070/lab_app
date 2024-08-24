console.log("include csv-file.js");
class CsvFile {
  constructor(csvContent) {
    if (typeof csvContent !== "string" || !csvContent.trim()) {
      throw new Error("Invalid CSV content.");
    }
    this.data = this.parseCsv(csvContent);
  }

  // Парсинг CSV-содержимого в массив объектов
  parseCsv(csvContent) {
    const lines = csvContent.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());
    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index];
      });
      return entry;
    });
    return data;
  }

  sqlQuery(sqlQueryString) {
    // Преобразование запроса к нижнему регистру и удаление лишних пробелов
    const query = sqlQueryString.toLowerCase().trim();

    // Проверка корректности запроса
    if (!query.startsWith("select") || !query.includes("where")) {
      throw new Error("Invalid SQL query.");
    }

    // Разделение на части SELECT и WHERE
    const selectPart = query.match(/select\s+(.*?)\s+where/);
    if (!selectPart) {
      throw new Error("Invalid SELECT part.");
    }
    const columns =
      selectPart[1].trim() === "*"
        ? Object.keys(this.data[0])
        : selectPart[1].split(",").map((col) => col.trim());

    console.log("Selected columns:", columns);

    const wherePart = query.match(/where\s+(.*)/);
    if (!wherePart) {
      throw new Error("Invalid WHERE part.");
    }
    const conditions = wherePart[1].split(" and ").map((cond) => cond.trim());

    console.log("Conditions:", conditions);

    // Применение WHERE условий
    let filteredData = this.data.filter((row) => {
      return conditions.every((condition) => {
        // Разделяем поле, оператор и значение
        const [field, operator, ...valueParts] = condition
          .split(/(=|>|<|>=|<=)/)
          .map((part) => part.trim());
        const value = valueParts.join(operator).trim();
        const rowValue = row[field];

        console.log(
          `Checking condition: ${field} ${operator} ${value}, row value: ${rowValue}`
        );

        if (rowValue === undefined) {
          return false; // Поле не найдено
        }

        // Убираем кавычки из строкового значения
        const cleanValue = value.replace(/^'|'$/g, "").replace(/^"|"$/g, "");

        switch (operator) {
          case "=":
            return rowValue.trim().toLowerCase() === cleanValue.toLowerCase();
          case ">":
            return parseFloat(rowValue) > parseFloat(cleanValue);
          case "<":
            return parseFloat(rowValue) < parseFloat(cleanValue);
          case ">=":
            return parseFloat(rowValue) >= parseFloat(cleanValue);
          case "<=":
            return parseFloat(rowValue) <= parseFloat(cleanValue);
          default:
            return false;
        }
      });
    });

    console.log("Filtered data:", filteredData);

    // Возвращение отфильтрованных и выбранных данных
    return filteredData.map((row) => {
      const result = {};
      columns.forEach((column) => {
        result[column] = row[column];
      });
      return result;
    });
  }
}

// Функция для тестирования работы класса CsvFile
function csvFileCreateTest() {
  const csvContent = csvData;

  const csvFile = new CsvFile(csvContent.trim());
  const result = csvFile.sqlQuery(
    "SELECT * WHERE 'тип дефекта' = 'Дефект промсреды'"
  );
  console.log("Final result:", result);
  return result;
}

// Запуск тестовой функции
csvFileCreateTest();
