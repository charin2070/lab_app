function groupDefectsByTeam(defectArray) {
  const groupedDefects = {};

  defectArray.forEach((defect) => {
    // Получаем название команды из объекта дефекта
    let teamName = defect["Команда устр проблему"] || "Не назначена";

    // Если группы с таким названием команды ещё нет, создаём её
    if (!groupedDefects[teamName]) {
      groupedDefects[teamName] = [];
    }

    // Добавляем дефект в соответствующую команду
    groupedDefects[teamName].push(defect);
  });

  return groupedDefects;
}

function strToDate(dateStr) {
  return parseDate(dateStr);
}

function getDefects(defectSource) {
  // Загружаем данные дефектов из источника
  defects = csvToObjects(defectSource);
  return defects;
}

function isValidDefect(defect) {
  let result = false;
  if (isMatchFilter(defect, defectFilterProd)) {
    if (isMatchFilter(defect, defectFilterOpen)) {
      defect["STATE"] = "Открыт";
      return "OPEN";
    } else if (isMatchFilter(defect, defectFilterClose)) {
      defect["STATE"] = "Закрыт";
      return "CLOSE";
    }

    return result;
  }
  return false;
}


function isSlaOverdue(defect) {
  const currentDate = new Date();
  const slaDate = new Date(defect["Дата наступления SLA"]);
  const closureDate = defect["дата закрытия"]
    ? new Date(defect["дата закрытия"])
    : null;

  if (closureDate && closureDate > slaDate) {
    return true;
  }

  if (slaDate < currentDate) {
    return true;
  }

  return false;
}
function getDefectSummary(defect) {
  let defectSummary = { ...summaryTempate };
  defectSummary.Total++;

  if (isMatchFilter(defect, defectFilterOpen)) {
    defectSummary.Open++;
  }
  if (isMatchFilter(defect, defectFilterClose)) {
    defectSummary.Closeg++;
  }

  if (isSlaOverdue(defect)) {
    defectSummary.Overdue++;
  }

  defectSummary.CorrectionTime += defect["Дней в работе"];

  return defectSummary;
}

function cleanUpDefectKeys(defectObject) {
  for (let key in defectObject) {
    if (!(key in defectTemplate)) {
      delete defectObject[key];
    }
  }
  return defectObject;
}

function getDefectByDate(dateStart, dateEnd, defects) {
  let defectsByDate = [];
  const start = parseDate(dateStart);
  const end = parseDate(dateEnd);

  defects.forEach((defect) => {
    if (!start || !end) {
      return [];
    }

    let defectDateOpen = defect["дата открытия"];
    let defectDateClose = defect["дата закрытия"];

    // Проверяем, находится ли дефект в заданном диапазоне дат
    if (
      (+defectDateOpen >= +start && +defectDateOpen <= +end) ||
      (+defectDateClose >= +start && +defectDateClose < +end)
    ) {
      defectsByDate.push(defect);
    }
  });

  return defectsByDate;
}

function getDefectsByType(defectType, defects) {
  return defects.filter((defect) => defect["тип дефекта"] === defectType);
}

function isMatchFilter(defect, filterOptions) {
  let logEvents = [];

  for (const key in filterOptions) {
    const filterValue = filterOptions[key];
    const recordValue = defect[key]?.trim();

    if (Array.isArray(filterValue)) {
      if (!filterValue.includes(recordValue)) {
        logEvents.push(
          `Несоответствие: ${key} в записи "${
            defect["Номер драфта"]
          }". Ожидаемые: ${filterValue.join(
            ", "
          )}, фактическое: "${recordValue}"`
        );
        return false;
      }
    } else if (recordValue !== filterValue) {
      logEvents.push(
        `Несоответствие: ${key} в записи "${defect["Номер драфта"]}". Ожидаемое: "${filterValue}", фактическое: "${recordValue}"`
      );
      return false;
    }
  }
  return true;
}

function normalizeDefect(defect) {
  // defect = { ...this.defectTemplate, ...defect };
  let normalDefect = cleanUpDefectKeys(defect);
  if (
    !normalDefect["Команда устр проблему"] ||
    normalDefect["Команда устр проблему"] === ""
  ) {
    normalDefect["Команда устр проблему"] = "Не назначена";
  }

  if (this.isSlaOverdue(normalDefect)) {
    normalDefect["SLA"] = "Просросчен";
  }

  return normalDefect;
}

function isDefectClosed(defect) {
  if (statusClosed.includes(defect["Статус"])) return true;
  if (statusOpened.includes(defect["Статус"])) return false;
}


function isDateInRange(dateCheck, dateStart, dateEnd) {
  const startDate = new Date(dateStart);
  const endDate = new Date(dateEnd);
  return dateCheck >= startDate && dateCheck <= endDate;
}

function filterObjectsByDateInterval(objects, dateStart, dateEnd) {
  const parsedStartDate = parseDate(dateStart);
  const parsedEndDate = parseDate(dateEnd);

  return objects.filter(obj => {
      const openDate = obj["дата открытия"] ? parseDate(obj["дата открытия"]) : null;
      const closeDate = obj["дата закрытия"] ? parseDate(obj["дата закрытия"]) : null;

      if (!openDate && !closeDate) {
          console.error("Both dates are missing or invalid in object:", obj);
          return false;
      }

      const isOpenInRange = openDate && isDateInRange(openDate, parsedStartDate, parsedEndDate);
      const isCloseInRange = closeDate && isDateInRange(closeDate, parsedStartDate, parsedEndDate);

      return isOpenInRange || isCloseInRange;
  });
}