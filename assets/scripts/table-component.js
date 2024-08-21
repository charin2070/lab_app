console.log("include table-component.js");

class TableComponent {
  constructor(headers = [], rows = [], parent = null) {
    this.id = this.generateId();
    this.headers = headers;
    this.rows = rows;
    this.parentElement = parent;

    this.buildFromTemplate();
  }

  id = null;
  element = null;
  parentElement = null;
  headRowElement = null;
  bodyElement = null;
  cssStyle = "";

  headers = [];
  rows = [];
  htmlLayout = `
    <table id="table-{id}" class="table table-dark table-striped table-hover border-dark">
      <thead class="table-head-dark" id="thead-{id}">  
      <tr class="table-head-dark" id="head-row-{id}">
        </tr>
      </thead>
      <tbody id="tbody-{id}">
      </tbody>
    </table>
  `;

  // Генерация уникального идентификатора
  generateId() {
    return `table-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Построение таблицы из шаблона
  buildFromTemplate() {
    // Заменяем {id} на уникальный идентификатор и {cssStyle} на переданный стиль
    const htmlWithReplacements = this.htmlLayout.replace(/{id}/g, this.id);

    this.element = this.createHTMLElement(htmlWithReplacements);

    // Добавляем таблицу в DOM до поиска её элементов
    if (this.parentElement) {
      this.setParent(this.parentElement);
    } else {
      console.error("Parent element is not defined.");
      return;
    }

    this.headRowElement = this.element.querySelector(`#head-row-${this.id}`);
    this.bodyElement = this.element.querySelector(`#tbody-${this.id}`);

    if (!this.headRowElement) {
      console.error(
        `headRowElement не найден. Идентификатор: head-row-${this.id}`
      );
      return;
    }

    this.setHeaders(this.headers);
    this.setRows(this.rows);
  }

  // Создание DOM-элемента из HTML-строки
  createHTMLElement(htmlString) {
    const div = document.createElement("div");
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  // Установка родительского элемента для таблицы
  setParent(parentElement) {
    if (this.element && parentElement) {
      this.parentElement = parentElement;
      parentElement.appendChild(this.element);
    }
  }

  // Установка заголовков таблицы
  setHeaders(headers) {
    this.headers = headers;

    this.headRowElement.innerHTML = ""; // Очищаем существующие заголовки
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      th.style.cssText =
        "color: dimgrey; font-weight: regular; opacity: 0.6; border: none;";
      this.headRowElement.appendChild(th);
      th.classList.add("table-dark", "table-header-cell"); // Добавляем стиль к заголовку
    });
  }

  // Добавление строк в таблицу
  setRows(rows) {
    this.rows = rows;

    if (!this.bodyElement) {
      console.error("bodyElement не найден");
      return;
    }

    this.bodyElement.innerHTML = ""; // Очищаем существующие строки
    rows.forEach((row) => {
      this.addRow(row);
    });
  }

  // Добавление одной строки в таблицу
  addRow(row) {
    const tr = document.createElement("tr");
    row.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell;
      tr.appendChild(td);
    });
    this.rows.push(row);
    this.bodyElement.appendChild(tr);
  }

  // Удаление всех строк из таблицы
  clearRows() {
    this.rows = [];
    if (this.bodyElement) {
      this.bodyElement.innerHTML = "";
    }
  }

  // Обновление заголовков и строк таблицы
  updateTable(headers, rows) {
    this.setHeaders(headers);
    this.setRows(rows);
  }
}

function tableComponentSelfTest(parentContainer) {
  console.log("table-component.selfTest()...");

  let headers = ["Функция", "Результат"];
  let rows = [];
  let tableComponent = new TableComponent(headers, rows, parentContainer);
  console.log(tableComponent);

  tableComponent.addRow(["selfTest", "Success"]);
}
