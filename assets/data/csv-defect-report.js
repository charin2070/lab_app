const csvDelimiter = ";";

// Заголовки
// const csvHeaders = `Номер драфта;тип дефекта;дата открытия;дата закрытия;Дата наступления SLA;Дней в работе;Дн;Статус;Команда устр проблему;Приоритет;Тематика;Метки;Кол-во инцидентов;Норматив;Дн2;Выполнение норматива;Сервис ошибки`;
// Дефекты промсреды
const defectFilterProd = {
  "тип дефекта": ["Дефект промсреды"]
};

// Открытые дефекты
const defectFilterOpen = {
  Статус: [
    "Новый",
    "Открыт",
    "Development",
    "В исследовании",
    "На исправление",
    "Повторный",
    "Принят к исправлению",
    "Ретест дефекта",
    "ТРЕБУЕТ УТОЧНЕНИЯ"
  ]
};

// Закрытые дефекты
const defectFilterClose = {
  Статус: ["Закрыт", "К закрытию"]
};

// Пустой фильтр
const defectFilterEmpty = {
  Статус: []
};

// Возможные значения Статуса
const statusValues = [
  "Новый",
  "Закрыт",
  "Открыт",
  "Development",
  "В исследовании",
  "К закрытию",
  "На исправление",
  "Отклонен",
  "Отклонен командой",
  "Отложен",
  "Повторный",
  "Принят к исправлению",
  "Ретест дефекта",
  "ТРЕБУЕТ УТОЧНЕНИЯ"
];

let csvDefectReport = `Номер драфта;тип дефекта;дата открытия;дата закрытия;Дата наступления SLA;Дней в работе;Дн;Статус;Команда устр проблему;Приоритет;Тематика;Метки;Кол-во инцидентов;Норматив;Дн2;Выполнение норматива;Сервис ошибки
ADIRINC-1741;Дефект промсреды;08.08.2024 8:30;;01.11.2024;0,0265625;Дней;Новый;;Средний;Рынок - Некорректные графики  по одному или нескольким рынкам за сегодня (2) - high;;;60;Дней;Да;АИ ПРО ВТ
ADIRINC-1740;Request (FR);07.08.2024 11:53;;19.09.2024;0,885023148;Дней;Новый;;Высокий;;SQL;;30;Дней;Да;
ADIRINC-1739;Дефект промсреды;06.08.2024 10:56;06.08.2024 10:58;30.10.2024;0,001458333;Дней;Закрыт;;Средний;Вводы ДС - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1738;Дефект промсреды;05.08.2024 18:16;;29.10.2024;2,619027778;Дней;Новый;;Средний;Заявки - Некорректный расчет лимита (1) - critical;;;60;Дней;Да;Мобильный терминал
ADIRINC-1737;Дефект промсреды;05.08.2024 16:08;;29.10.2024;2,708148148;Дней;Новый;Core;Средний;другое;;;60;Дней;Да;АИ ПРО ВТ
ADIRINC-1736;Дефект промсреды;05.08.2024 10:17;;24.08.2024;2,952141204;Дней;Новый;;Критичный;Витрины, новости, аналитика - Не открывается вкладка Главная (1) - critical;;;14;Дней;Да;Мобильный терминал
ADIRINC-1735;Дефект промсреды;01.08.2024 14:21;;22.08.2024;4,782372685;Дней;Новый;Everest;Критичный;Рынок - Некорректные  стаканы  по одному или нескольким рынкам (2) - high;;;14;Дней;Да;Мобильный терминал
ADIRINC-1734;Дефект промсреды;01.08.2024 10:04;;25.10.2024;4,961099537;Дней;На исправление;Pro terminal;Средний;Терминалы (кроме QUIK) - Другое (4) - low;;;60;Дней;Да;Альфа Инвестиции 4.0. ДТ
ADIRINC-1733;Дефект промсреды;30.07.2024 12:51;;11.09.2024;6,845115741;Дней;Новый;;Высокий;Выводы ДС  - Не проходят выводы с Инвесткопилки (4) - low;;;30;Дней;Да;Мобильный терминал
ADIRINC-1732;Дефект промсреды;29.07.2024 14:49;;22.10.2024;7,762835648;Дней;На исправление;;Средний;другое;;;60;Дней;Да;Мобильный терминал
ADIRINC-1730;Дефект промсреды;26.07.2024 9:56;;19.10.2024;8,96681713;Дней;На исправление;;Средний;Портфель - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1729;Дефект промсреды;24.07.2024 13:20;;17.10.2024;10,82515046;Дней;Новый;;Средний;Заявки - Другое (2) - high;;;60;Дней;Да;Мобильный терминал
ADIRINC-1727;Request (FR);22.07.2024 13:59;;15.10.2024;12,79792824;Дней;Новый;Меркурий 7;Средний;;;;60;Дней;Да;
ADIRINC-1726;Дефект промсреды;19.07.2024 10:29;;12.10.2024;13,94377315;Дней;На исправление;;Средний;другое;;;60;Дней;Да;Мобильный терминал
ADIRINC-1725;Дефект промсреды;19.07.2024 10:04;;31.08.2024;13,96108796;Дней;Новый;;Высокий;Рынок - Некорректные графики  по одному или нескольким рынкам за предыдущие дни (3) - low;;;30;Дней;Да;Мобильный терминал
ADIRINC-1724;Дефект промсреды;18.07.2024 21:18;;11.10.2024;14,4928125;Дней;Новый;;Средний;Заявки - Счет ожидает регистрации на бирже (1) - critical;;;60;Дней;Да;АИ ПРО ДТ
ADIRINC-1723;Request (FR);17.07.2024 12:22;;10.10.2024;15,86512731;Дней;Отклонен командой;;Средний;;;;60;Дней;Да;Альфа Инвестиции 4.0. ДТ
ADIRINC-1722;Дефект промсреды;17.07.2024 12:03;;10.10.2024;15,87819444;Дней;На исправление;Appalachians;Средний;Рынок - Некорректные графики  по одному или нескольким рынкам за предыдущие дни (3) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1721;Дефект промсреды;17.07.2024 10:50;;10.10.2024;15,92927083;Дней;Новый;;Средний;Вводы ДС - Не проходят (1) - critical;;;60;Дней;Да;Мобильный терминал
ADIRINC-1720;Request (FR);16.07.2024 17:05;;09.10.2024;16,66887731;Дней;Новый;;Средний;;;;60;Дней;Да;
ADIRINC-1719;Request (FR);16.07.2024 14:33;;09.10.2024;16,77399306;Дней;Новый;;Средний;;;;60;Дней;Да;Мобильный терминал
ADIRINC-1718;Дефект промсреды;16.07.2024 14:22;;09.10.2024;16,78189815;Дней;Новый;Core;Средний;;;;60;Дней;Да;Мобильный терминал
ADIRINC-1717;Дефект промсреды;15.07.2024 16:02;15.07.2024 16:08;08.10.2024;0,004305556;Дней;Закрыт;;Средний;Вводы ДС - Проходят дольше 3 мин (3) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1716;Дефект промсреды;15.07.2024 13:09;;08.10.2024;17,83234954;Дней;Отложен;;Средний;другое;;;60;Дней;Да;Мобильный терминал
ADIRINC-1715;Дефект промсреды;15.07.2024 10:53;;08.10.2024;17,92715278;Дней;Новый;;Средний;другое;;;60;Дней;Да;Мобильный терминал
ADIRINC-1714;Дефект промсреды;15.07.2024 10:40;;27.08.2024;17,93616898;Дней;К закрытию;Pro terminal;Высокий;Терминалы (кроме QUIK) - Вход в терминал выполняется долго (дольше 3 минут) (2) - high;;;30;Дней;Да;Альфа Инвестиции 4.0. ДТ
ADIRINC-1713;Дефект промсреды;12.07.2024 10:32;;05.10.2024;18,94130787;Дней;Новый;;Средний;Заявки - Другое (2) - high;;;60;Дней;Да;Мобильный терминал
ADIRINC-1711;Дефект промсреды;11.07.2024 13:40;;04.10.2024;19,81069444;Дней;Новый;;Средний;Рынок - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1710;Дефект промсреды;11.07.2024 9:57;;04.10.2024;19,9659838;Дней;Принят к исправлению;НТФ (ЛК);Средний;другое;;;60;Дней;Да;Мобильный терминал
ADIRINC-1709;Дефект промсреды;10.07.2024 8:32;11.07.2024 16:05;03.10.2024;1,314907407;Дней;Отклонен;;Средний;другое;;;60;Дней;Да;Мобильный терминал
ADIRINC-1708;Дефект промсреды;08.07.2024 9:55;;01.10.2024;22,96737269;Дней;Новый;;Средний;;;;60;Дней;Да;Альфа Инвестиции 4.0. ДТ
ADIRINC-1707;Дефект промсреды;05.07.2024 12:42;;28.09.2024;23,85097222;Дней;Новый;Matterhorn;Средний;Терминалы (кроме QUIK) - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1706;Дефект промсреды;04.07.2024 14:15;;27.09.2024;24,78658565;Дней;Новый;АПИ\Интеграции;Средний;другое;;;60;Дней;Да;Мобильный терминал
ADIRINC-1705;Дефект промсреды;03.07.2024 12:50;;26.09.2024;25,84541667;Дней;Новый;;Средний;Терминалы (кроме QUIK) - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1704;Дефект промсреды;03.07.2024 4:39;;26.09.2024;26,1865162;Дней;Принят к исправлению;Core;Средний;Терминалы (кроме QUIK) - Вход в терминал выполняется долго (дольше 3 минут) (2) - high;;;60;Дней;Да;Мобильный терминал
ADIRINC-1702;Дефект промсреды;26.06.2024 11:35;;19.09.2024;30,89802083;Дней;Новый;Уран;Средний;Заявки - Счет ожидает регистрации на бирже (1) - critical;;;60;Дней;Да;Альфа-Админ
ADIRINC-1701;Дефект промсреды;26.06.2024 10:42;05.07.2024 8:10;08.08.2024;4,894189815;Дней;Закрыт;K2;Средний;Терминалы (кроме QUIK) - Другое (4) - low;;;60;Дней;Да;АИ ПРО ВТ
ADIRINC-1700;Request (FR);25.06.2024 13:29;;18.09.2024;31,81858796;Дней;Новый;;Средний;;;;60;Дней;Да;
ADIRINC-1699;Дефект промсреды;20.06.2024 18:49;12.07.2024 7:46;13.09.2024;15,5399537;Дней;Закрыт;;Средний;Заявки - Не исполняется (1) - critical;;;60;Дней;Да;Мобильный терминал
ADIRINC-1698;Дефект промсреды;20.06.2024 16:22;;13.09.2024;34,69824074;Дней;Принят к исправлению;Everest;Средний;Витрины, новости, аналитика - Не корректный дивидендный календарь (3) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1697;Дефект промсреды;20.06.2024 13:54;;13.09.2024;34,8015162;Дней;На исправление;Everest;Средний;Портфель - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1696;Request (FR);19.06.2024 18:34;;12.09.2024;35,60668981;Дней;Новый;;Средний;;;;60;Дней;Да;
ADIRINC-1695;Request (FR);19.06.2024 17:55;;12.09.2024;35,63366898;Дней;Новый;;Средний;;;;60;Дней;Да;
ADIRINC-1694;Request (FR);19.06.2024 17:46;;12.09.2024;35,64001157;Дней;Новый;;Средний;;;;60;Дней;Да;
ADIRINC-1693A;Дефект промсреды;19.06.2024 12:30;;12.09.2024;35,8594213;Дней;Новый;Fuji;Средний;Рынок - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1692;Дефект промсреды;19.06.2024 11:21;03.07.2024 11:21;12.09.2024;10,0002662;Дней;Отклонен;Montblanc;Средний;Портфель - Другое (4) - low;;;60;Дней;Да;Мобильный терминал
ADIRINC-1691;Дефект промсреды;18.06.2024 10:53;;11.09.2024;36,92679398;Дней;Новый;Pro terminal;Средний;Рынок - Некорректные котировки по одному или нескольким рынкам (1) - critical;;;60;Дней;Да;АИ ПРО ДТ
ADIRINC-1690;Дефект промсреды;18.06.2024 10:35;;11.09.2024;36,9391088;Дней;Новый;Pro terminal;Средний;Терминалы (кроме QUIK) - Вход в терминал выполняется долго (дольше 3 минут) (2) - high;;;60;Дней;Да;АИ ПРО ДТ
ADIRINC-1689;Request (FR);17.06.2024 14:17;;10.09.2024;37,78550926;Дней;Отложен;;Средний;;;;60;Дней;Да;`;
