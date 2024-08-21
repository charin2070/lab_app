// Набор функций для генерации отчётов

const Summary = {
  Total: 0,
  Open: 0,
  Closed: 0,
  SLA: 0,
  Overdue: 0,
  CorrectionTime: 0 // Среднее время исправления дефекта
};

function isDateInRange(dateCheck, dateStart, dateEnd) {
  const startDate = parseDate(dateStart);
  const endDate = parseDate(dateEnd);

  if (dateStart >= startDate && dateStart <= endDate) {
    return true;
  }

  return false;
}

function isSlaOverdue(dataObject, currentDate) {
  const slaDate = new Date(dataObject["Дата наступления SLA"]);
  const closureDate = new Date(dataObject["дата закрытия"]);

  // Проверяем, если дата закрытия позже, чем дата наступления SLA
  if (closureDate > slaDate) {
    return true;
  }

  // Проверяем, если дата наступления SLA раньше текущей даты
  if (slaDate < currentDate) {
    return true;
  }

  // В других случаях возвращаем false
  return false;
}

function calculateSummarySla(teamSummary) {
  const total = teamSummary.Open + teamSummary.Closed;
  if (total === 0) {
    return 0;
  }
  return ((teamSummary.Closed / total) * 100).toFixed(2);
}

function getTotalSummary(defectObject) {
  let totalSummary = { ...Summary };
  let teams = {};

  const currentDate = new Date();

  defectObject.forEach((dataObject) => {
    // Если значение "Команда устр проблему" пустое тогда "Команда устр проблему" = "Not assigned"
    let currentTeam = dataObject["Команда устр проблему"];
    if (currentTeam === null || currentTeam === "")
      currentTeam = "Не назначена";

    if (!teams[currentTeam]) {
      teams[currentTeam] = { ...Summary };
    }

    // Задача открыта / закрыта
    if (isMatchesFilter(dataObject, defectFilterOpen)) {
      teams[currentTeam].Open++;
      totalSummary.Open++;
    } else if (isMatchesFilter(dataObject, defectFilterClose)) {
      // Convert "Дней в работе" to number
      if (dataObject["Дней в работе"]) {
        let daysInWork = parseInt(dataObject["Дней в работе"]);
        
        teams[currentTeam].CorrectionTime += daysInWork;
      }

      // Если дата в "Дата закрытия" позднее, чем дата "Дата наступления SLA" тогда +1 к "Просрочено"
      teams[currentTeam].Closed++;
      totalSummary.Closed++;
    }

    if (isSlaOverdue(dataObject, currentDate)) {
      teams[currentTeam].Overdue++;
      totalSummary.Overdue++;
    }

    totalSummary.Total++;
  });

  // Вычисление SLA и округление до сотых
  totalSummary.SLA = ((totalSummary.Closed / totalSummary.Total) * 100).toFixed(
    1
  );
  // Вычисление SLA для каждой команды
  for (const team in teams) {
    teams[team].SLA = calculateSummarySla(teams[team]);
  }

  let resultSummary = {
    Teams: teams,
    Total: totalSummary
  };

  return resultSummary;
}

function getPeriodicSummary(dataObjects) {
  let periodicSummary = {
    Total: 0,
    Open: 0,
    Closed: 0,
    SLA: 0
  };
}

const defectReport = {
  Stack: [],
  Groups: {
    Teams: undefined,
    Products: undefined
  },
  Summary: undefined
};

function P(defectObjects) {
  let teamReport = { ...defectReport };
}

function groupArrayByProperty(array, property) {
  return array.reduce((groups, item) => {
    const group = (groups[item[property]] = groups[item[property]] || []);
    group.push(item);
    return groups;
  }, {});
}

function getProductsReport(defectObjects) {
  let productReport = { ...defectReport };
}
