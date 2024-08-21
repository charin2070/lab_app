// Методы групирования и фильтрации дефектов
function groupDefectsByTeam(defectArray, keepProperties) {
  // Создаём объект, в который будут сгруппированы дефекты по командам
  const groupedDefects = {};
  defectArray.forEach((defect) => {
    // Получаем название команды из объекта дефекта
    let teamName = defect["Команда устр проблему"] || "Не назначена";

    // Если группы с таким названием команды ещё нет, создаём её
    if (!groupedDefects[teamName]) {
      groupedDefects[teamName] = [];
    }

    // Создаём новый объект дефекта и копируем только свойства перечисленные в массиве KeepProperties
    const filteredDefect = keepProperties.reduce((acc, prop) => {
      acc[prop] = defect[prop];
      return acc;
    }, {});

    // Добавляем дефект в соответствующую команду
    groupedDefects[teamName].push(filteredDefect);
  });

  return groupedDefects;
}

function summarizeDefects(data) {
  const resultObject = {};

  for (const team in data) {
    if (data.hasOwnProperty(team)) {
      const defects = data[team];
      let totalOpen = 0;
      let totalClosed = 0;
      let totalDefects = 0;
      let totalDeadline = 0;

      defects.forEach((defect) => {
        totalDefects += 1;

        // Проверяем, есть ли дата открытия
        if (!isDefectClosed(defect)) {
          totalOpen += 1;
        }

        // Проверяем, есть ли дата закрытия
        if (isDefectClosed(defect)) {
          totalClosed += 1;
        }

        // Проверяем, есть ли дата закрытия
        if (+defect["Дата наступления SLA"] <= +defect["дата закрытия"])
          totalDeadline += 1;
      });

      let sla = ((totalClosed / totalDefects) * 100).toFixed(2);

      resultObject[team] = {
        "Всего открыто": totalOpen,
        "Всего закрыто": totalClosed,
        "Всего дефектов": totalDefects,
        "SLA истекает": totalDeadline,
        SLA: sla
      };
    }
  }

  return resultObject;
}
