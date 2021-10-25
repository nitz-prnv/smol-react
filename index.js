#!/usr/bin/env node

const axios = require("axios").default;
const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const files = {
  html: "https://raw.githubusercontent.com/nitz-prnv/without-cra/main/public/index.html",
  readme:
    "https://raw.githubusercontent.com/nitz-prnv/without-cra/main/README.md",
  ignore:
    "https://raw.githubusercontent.com/nitz-prnv/without-cra/main/.gitignore",
  index:
    "https://raw.githubusercontent.com/nitz-prnv/without-cra/main/public/index.js",
  css: "https://raw.githubusercontent.com/nitz-prnv/without-cra/main/public/style.css",
  app: "https://raw.githubusercontent.com/nitz-prnv/without-cra/main/src/app.js",
  app_css: "https://raw.githubusercontent.com/nitz-prnv/without-cra/main/src/app.css",

};
const scripts = `\n\t"start": "parcel public/index.html --open -p 8080", \n\t"build": "parcel build public/index.html"`;

if (process.argv.length < 3) {
  console.log(
    "oops ! seems like you have forgot something 🙂 \n (it's your project name!) \n USAGE:\n\r smol-react <project-name>"
  );
  process.exit(1);
}
if (process.argv.length > 3) {
  console.log(
    `\n${process.argv[3]} is invalid 🙂\n maybe you are trying to create a project named '${process.argv[2]}-${process.argv[3]}' \n(and if you are please use this format)`
  );
  process.exit(1);
}
const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === "EEXIST") {
    console.log(
      `The file ${projectName} already exist in the current directory, please give it another name.`
    );
  } else {
    console.log(error);
  }
  process.exit(1);
}
exec(
  `cd ${projectPath} && git init && npm init -y && mkdir src public`,
  (err, out, stderr) => {
    if (err) console.log(`Everything was going good but...\n${err}`);
    if (stderr) console.log(`Everything was going good but...\n${stderr}`);
    // console.log(out);
    console.log("created package.json ✅");
  }
)
  .on("close", () => {
    fs.readFile(path.join(projectName, "package.json"), (err, file) => {
      if (err) throw err;
      const data = file
        .toString()
        .replace(
          '"test": "echo \\"Error: no test specified\\" && exit 1"',
          scripts
        )
        .replace(
          `"license": "ISC"`,
          `"license": "ISC",
          "browserslist": [
            "since 2017-06"
          ],
      "dependencies": {
        "parcel-bundler": "^1.12.5",
        "react": "^17.0.2",
        "react-dom": "^17.0.2"
      }`
        );
      fs.writeFileSync(path.join(projectName, "package.json"), data);
    });
  })
  .on("close", () => {
    console.log("Generating Files...");
    // index.html
    axios.get(files.html).then((res) => {
      fs.writeFileSync(
        path.join(projectPath, "public", "index.html"),
        res.data
      );
    });

    // index.js
    axios
      .get(files.index)
      .then((res) => {
        fs.writeFileSync(
          path.join(projectPath, "public", "index.js"),
          res.data
        );
      })
      .catch((err) => console.log(err));

    // index.css
    axios
      .get(files.css)
      .then((res) => {
        fs.writeFileSync(
          path.join(projectPath, "public", "style.css"),
          res.data
        );
      })
      .catch((err) => console.log(err));

    // app.js
    axios
      .get(files.app)
      .then((res) => {
        fs.writeFile(
          path.join(projectName, "src", "app.js"),
          res.data,
          (err) => {
            if (err) console.log(err);
          }
        );
      })
      .catch((err) => console.log(err));
      // app.css
      axios
      .get(files.app_css)
      .then((res) => {
        fs.writeFile(
          path.join(projectName, "src", "app.css"),
          res.data,
          (err) => {
            if (err) console.log(err);
          }
        );
      })
      .catch((err) => console.log(err));
    // .gitignore
    axios
      .get(files.ignore)
      .then((res) => {
        fs.writeFile(path.join(projectName, ".gitignore"), res.data, (err) => {
          if (err) console.log(err);
        });
      })
      .catch((err) => console.log(err));
  })
  .on("close", () => {
    console.log("Done ✅");
    console.log("Installing Dependancies");
    console.log("please keep calm this wont take long 🧘");
    exec(`cd ${projectName} && npm i`, (err) => {
      if (err) console.log(err);
    }).on("close", () => {
      console.log(`horrayyy!♥✨ You run this project by\n⨠ cd ${projectName}\n⨠ npm start \n （*＾-＾*）
      `);
    });
  });
