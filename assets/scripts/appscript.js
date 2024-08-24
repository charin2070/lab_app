function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // Замените 'Sheet1' на имя вашего листа

  if (!sheet) {
    return ContentService.createTextOutput("Sheet not found.").setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  const query = e.parameter.query; // Получение SQL запроса из параметров URL

  if (!query) {
    return ContentService.createTextOutput("No query provided.").setMimeType(
      ContentService.MimeType.TEXT
    );
  }

  try {
    const result = executeSQL(sheet, query);
    return ContentService.createTextOutput(result).setMimeType(
      ContentService.MimeType.JSON
    );
  } catch (error) {
    return ContentService.createTextOutput(
      `Error: ${error.message}`
    ).setMimeType(ContentService.MimeType.TEXT);
  }
}

function executeSQL(sheet, query) {
  const range = sheet.getDataRange();
  const data = range.getValues();

  const columns = data[0];
  const rows = data.slice(1);

  // Простой пример фильтрации данных
  const filteredRows = rows.filter((row) => {
    if (query.includes("WHERE")) {
      const condition = query.split("WHERE")[1].trim();
      const columnIndex = columns.indexOf("A"); // Предполагаем, что фильтрация по колонке 'A'
      return row[columnIndex] === condition.replace(/'/g, "");
    }
    return true;
  });

  const output = [columns].concat(filteredRows);
  return JSON.stringify(output);
}

// Напиши для Google Apps Script код функции getRangeByDate(dateStart, dateEnd), которая возвращает диапазон ячейек, содержащий данные за период от dateStart до dateEnd в таблице "Sheet1"


// Пример: getRangeByDate("15.11.2024", "19.11.2024");
// Колонка с датами называется "Дата наступления SLA"

// Предположим, что функция getRangeByDate() должна возвращать диапазон ячейек с данными за период от dateStart до dateEnd

