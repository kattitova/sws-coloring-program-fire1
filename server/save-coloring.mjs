import fs from "fs";

const indexFile = "server/save/index.txt";

// сохраняем файл
function saveIndexFile(fileName, data) {
  try {
    fs.writeFileSync(
      fileName,
      data,
      "utf8",
    );
    console.log("Done");
  } catch (e) {
    console.log(e);
  }
}

// генерация имени файла сохранения
function genFileName() {
  const id = fs.readFileSync(indexFile, "utf8");
  const newId = parseInt(id, 10) + 1;
  // сохраняем в index.txt номер последнего сохраненного файла
  saveIndexFile(indexFile, newId);
  return newId;
}

function saveColoring(data) {
  const fileName = genFileName();
  // сохраняем данные раскраски в файл
  saveIndexFile(`server/save/${fileName}.json`, JSON.stringify(data));
  // console.log(fileName, data);
  return fileName;
}

export { saveColoring };
