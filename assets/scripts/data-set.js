const data = [];
function init() {}

function getDefectsFromCsv(csvSource) {
  let csvSource = csvArchive;

  if (!csvSource) {
    let result = getDefectsFromCsv(csvArchive);
    return result;
  }

  let defects = getDefectsFromCsv(csvSource);
  defects.forEach((defect) => {
    isValidDefect(defect)
      ? defectsArray.push(defect)
      : console.log("Invalid defect");
    return defectsArray;
  });

  log(defectsArray, "Defects");
}
