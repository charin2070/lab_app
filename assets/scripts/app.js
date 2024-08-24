console.info("include app.js");

function logToTable(key, value) {
  if (!elements["tableResult"]) {
    log("Can't log to table. She is not defined.");
    return;
  }

  elements["tableResult"].addRow([key, value]);
}

// Возвращает ответ запускаемой функции
function getTest(func, params) {
  // Логируем в консоль название функции
  console.log(`Запуск функции: ${func.name}`);

  // Вызовем переданную функцию func с использованием оператора spread для массива params
  return func(...params);
}

// Entry
let elements = {
  contentBox: document.getElementById("content-box"),
  btnAction: document.getElementById("btnAction"),
  btnSendMessageToBot: document.getElementById("btnSendMessageToBot"),
  inputArgument: document.getElementById("inputArgument"),
  tableResult: document.getElementById("tableResult"),
  fileInput: document.getElementById("fileInput"),
  btnFileToString: document.getElementById("btnFileToString"),
  btnGetConsoleEvents: document.getElementById("btnGetConsoleEvents"),
  btnStringToFile: document.getElementById("btnStringToFile"),
  btnCsvToObjects: document.getElementById("btnCsvToObjects")
};

function initComponents() {
  for (let key in elements) {
    let element = document.getElementById(key);
    elements[key] = element;
  }

  let tableResults = new TableComponent(
    ["Function", "Result"],
    [],
    elements.contentBox
  );

  elements.tableResult = tableResults;
  setEventListenersById();
  // setEventListeners();
}

function btnCsvToObjects() {
  // Select file via filePicker dialog
  selectFile().then = (fi) => {
    csvToObjects(fi);
  };

  csvToObjects(fi);
}

function setEventListenersById() {
  // 1. Находим все элементы на странице
  const allElements = document.querySelectorAll("*");

  // 2. Проходим по всем элементам
  allElements.forEach((element) => {
    // Проверяем, есть ли у элемента id
    const id = element.id;
    if (id && id.startsWith("btn")) {
      // 3. Если id начинается с "btn", назначаем обработчик события
      element.onclick = function () {
        // Используем значение id как имя функции
        if (typeof window[id] === "function") {
          window[id]();
        } else {
          console.warn(`Функция с именем "${id}" не определена.`);
        }
      };
    }
  });
}

function btnAction() {
  csvFileCreateTest();
}

// Find elements by key name and assign elements
function setEventListeners() {
  // elements["btnGetConsoleEvents"].onclick = getConsoleEvents;

  // String to file
  elements["btnStringToFile"].onclick = checkSendToTelegram;

  // File to string
  elements["btnFileToString"].onclick = checkSendToTelegram;

  elements["fileInput"].onchange = () => {
    fsLessSelfTest();
  };

  elements["btnSendMessageToBot"].onclick = checkSendToTelegram;
}

function startApp() {
  log(" 🚀 startASpp()");
  initComponents();
}

startApp();
