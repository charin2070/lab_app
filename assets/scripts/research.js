document.addEventListener("DOMContentLoaded", () => {});
const tableCtrl = new TeamTableManager("teamSummaryTable");
document.getElementById("btn-div").addEventListener("click", () => {
  tableCtrl.clearTable();
});

// другие команды...
function calculateTeamSummary(defects) {
  const teamSummaries = {};

  defects.forEach((defect) => {
    const team = defect["Команда устр проблему"];
    if (!teamSummaries[team]) {
      teamSummaries[team] = {
        Открыто: 0,
        Закрыто: 0,
        Просрочено: 0,
        SLA: 0,
        "Среднее время устранения(в днях)": 0,
        "Дата начала": null,
        "Дата окончания": null,
        totalDays: 0,
        totalClosedDefects: 0
      };
    }

    // Увеличиваем счетчики
    if (defect["Статус"] === "Открыт") {
      teamSummaries[team].Открыто++;
    } else if (defect["Статус"] === "Закрыт") {
      teamSummaries[team].Закрыто++;
    }

    const openDate = parseDate(defect["дата открытия"]);
    const closeDate = defect["дата закрытия"]
      ? parseDate(defect["дата закрытия"])
      : null;
    const slaDate = parsыeDate(defect["Дата наступления SLA"]);

    // Проверяем, просрочен ли дефект
    if (closeDate && closeDate > slaDate) {
      teamSummaries[team].Просрочено++;
    }

    // Рассчитываем среднее время устранения дефекта
    if (closeDate) {
      const daysInWork = parseFloat(defect["Дней в работе"].replace(",", "."));
      teamSummaries[team].totalDays += daysInWork;
      teamSummaries[team].totalClosedDefects++;
    }

    // Обновляем дату начала и окончания
    if (
      !teamSummaries[team]["Дата начала"] ||
      openDate < teamSummaries[team]["Дата начала"]
    ) {
      teamSummaries[team]["Дата начала"] = openDate;
    }
    if (
      !teamSummaries[team]["Дата окончания"] ||
      (closeDate && closeDate > teamSummaries[team]["Дата окончания"])
    ) {
      teamSummaries[team]["Дата окончания"] = closeDate;
    }
  });

  // Постобработка данных
  Object.keys(teamSummaries).forEach((team) => {
    const summary = teamSummaries[team];

    // Рассчитываем процент выполнения SLA
    summary.SLA =
      summary.Закрыто > 0
        ? ((summary.Закрыто - summary.Просрочено) / summary.Закрыто) * 100
        : 0;

    // Рассчитываем среднее время устранения
    summary["Среднее время устранения(в днях)"] =
      summary.totalClosedDefects > 0
        ? summary.totalDays / summary.totalClosedDefects
        : 0;

    // Приводим дату начала и окончания в нужный формат
    summary["Дата начала"] = formatDate(summary["Дата начала"]);
    summary["Дата окончания"] = formatDate(summary["Дата окончания"]);

    // Удаляем временные поля
    delete summary.totalDays;
    delete summary.totalClosedDefects;
  });

  return teamSummaries;
}

// Функция для парсинга даты
function parseDate(dateString) {
  const [day, month, year] = dateString.split(/[.\s]/);
  return new Date(`${year}-${month}-${day}`);
}

// Функция для форматирования даты
function formatDate(date) {
  if (!date) return null;
  return `${String(date.getDate()).padStart(2, "0")}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${date.getFullYear()}`;
}
