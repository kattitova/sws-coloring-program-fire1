import fs from "fs";

// const indexFile = "server/save/index.txt";

// сохраняем файл
function saveNewFile(fileName, data) {
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
  // generate saving code simbol + digital
  let result = "";
  const words = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
  const maxPosition = words.length - 1;
  for (let i = 0; i < 6; i += 1) {
    const position = Math.floor(Math.random() * maxPosition);
    result += words.substring(position, position + 1);
  }
  // ---
  return result;
}

function saveColoring(data) {
  const fileName = genFileName();
  const path = `server/save/${fileName}.json`;
  try {
    if (fs.existsSync(path)) {
      // gen new file name
      saveColoring(data);
    } else {
      // сохраняем данные раскраски в файл
      saveNewFile(path, JSON.stringify(data));
    }
  } catch (e) {
    console.log(e);
  }

  // console.log(fileName, data);
  return fileName;
}

export { saveColoring };
