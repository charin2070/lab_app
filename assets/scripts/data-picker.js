const datepicker = document.getElementById("datepicker");

let selectedDate = new Date();

function generateCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const currentDate = date.getDate();

  date.setDate(1);
  const firstDayIndex = date.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  datepicker.innerHTML = "";

  const nav = document.createElement("div");
  nav.classList.add("month-navigation");

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "‹";
  prevBtn.addEventListener("click", function () {
    selectedDate.setMonth(selectedDate.getMonth() - 1);
    generateCalendar(selectedDate);
  });

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "›";
  nextBtn.addEventListener("click", function () {
    selectedDate.setMonth(selectedDate.getMonth() + 1);
    generateCalendar(selectedDate);
  });

  const monthName = date.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric"
  });
  const monthLabel = document.createElement("span");
  monthLabel.textContent =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  nav.appendChild(prevBtn);
  nav.appendChild(monthLabel);
  nav.appendChild(nextBtn);
  datepicker.appendChild(nav);

  const table = document.createElement("table");
  const headerRow = table.insertRow();

  const daysOfWeek = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
  for (let day of daysOfWeek) {
    const cell = headerRow.insertCell();
    cell.textContent = day;
  }

  let row = table.insertRow();
  for (let i = 0; i < firstDayIndex; i++) {
    row.insertCell();
  }

  for (let day = 1; day <= daysInMonth; day++) {
    if (row.cells.length === 7) row = table.insertRow();
    const cell = row.insertCell();
    cell.textContent = day;

    if (day === currentDate) {
      cell.classList.add("selected");
    }

    cell.addEventListener("click", function () {
      datepickerInput.value = `${("0" + day).slice(-2)}/${(
        "0" +
        (month + 1)
      ).slice(-2)}/${year}`;
      datepicker.style.display = "none";
    });
  }

  datepicker.appendChild(table);
}

datepickerInput.addEventListener("click", function () {
  datepicker.style.display = "block";
});

document.addEventListener("click", function (event) {
  if (
    !datepickerInput.contains(event.target) &&
    !datepicker.contains(event.target)
  ) {
    datepicker.style.display = "none";
  }
});

datepickerInput.addEventListener("input", function (event) {
  const value = event.target.value;
  const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = value.match(datePattern);

  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const year = parseInt(match[3]);

    const newDate = new Date(year, month, day);

    if (!isNaN(newDate)) {
      selectedDate = newDate;
      generateCalendar(selectedDate);
    }
  }
});
document.addEventListener("DOMContentLoaded", function () {});

const datepickerInput = document.getElementById("datepicker-input-date-start");