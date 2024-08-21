console.info("include app.js");

function logToTable(key, value) {
  if (!elements["tableResult"]) {
    log("Can't log to table. She is not defined.");
    return;
  }

  elements["tableResult"].addRow([key, value]);
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
  btnStringToFile: document.getElementById("btnStringToFile")
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
  setEventListeners();
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

  elements["btnAction"].onclick = () => {
    checkSendToTelegram;
    // Your code here
    //...
  };
}

function startApp() {
  log(" 🚀 startASpp()");
  initComponents();
}

startApp();
