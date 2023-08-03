var fs = require("fs");
const util = require("util");
fs.readFile("./package.json", function (err, content) {
  if (err) throw err;
  let packageInfo = JSON.parse(content);
  let newVersion = packageInfo.version;
  packageInfo.version = newVersion.replace(/\d$/g, ++newVersion.split(".")[2]);
  fs.writeFile(
    "./package.json",
    JSON.stringify(packageInfo, null, 2),
    "utf8",
    function (err) {
      if (err) {
        throw err;
      } else {
        console.log("Build Number Incremented Successfully!");
      }
    }
  );
});
