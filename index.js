const inquirer = require("inquirer");
const GithubSearch = require("./githubSearch");

// Node v10+ includes a promises module as an alternative to using callbacks with file system methods.
const { writeFile } = require("fs").promises;

// Use writeFileSync method to use promises instead of a callback function

const promptUser = () => {
  return inquirer.prompt([
    {
      type: "input",
      name: "github",
      message: "Enter your GitHub Username:",
    },
    {
      type: "input",
      name: "repository",
      message: "Enter your GitHub Repository:",
    },
  ]);
};

const repo = new GithubSearch();
//Nuevo_Leon_Elections
const buildReadMe = ({ github, repository }) => {
  return repo.search(github, repository); //.then((res) => res.data);
};

const generateHTML = ({ id }) =>
  `forks: ${id}`;

const init = () => {
  promptUser()
    // Use writeFile method imported from fs.promises to use promises instead of
    // a callback function
    //  writeFile("README.md", buildReadMe(answers))
    .then((answers) => buildReadMe(answers))
    .then((res) => writeFile("README.md", generateHTML(res.data)))
    .then(() => console.log("Successfully wrote to README.md"))
    .catch((err) => console.error(err));
};

init();
