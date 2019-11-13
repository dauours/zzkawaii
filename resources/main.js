/*
  Remove useless properties of idiom => reduce size of json file
*/

const fs = require("fs");

fs.readFile("./idiom.json", (err, buffer) => {
  if (err) throw err;
  const idioms = JSON.parse(buffer.toString());
  const result = idioms.map(idiom => {
    return {
      pinyin: idiom["pinyin"],
      word: idiom["word"]
    }
  });

  fs.writeFileSync("./idioms.json", JSON.stringify(result));
});
