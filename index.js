const inquirer = require('inquirer');

// Node v10+ includes a promises module as an alternative to using callbacks with file system methods.
const { writeFile } = require('fs').promises;

// Use writeFileSync method to use promises instead of a callback function

const promptUser = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'github',
      message: 'Enter your GitHub Username:',
    },
    {
      type: 'input',
      name: 'repository',
      message: 'Enter your GitHub Repository:',
    },
  ]);
};

const buildReadMe = ({github, repository}) => {
        var requestUrl = `https://api.github.com/repos/${github}/${repository}`;
    
        fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            return data
        });
    }

// Bonus using writeFileSync as a promise
const init = () => {
  promptUser()
    // Use writeFile method imported from fs.promises to use promises instead of
    // a callback function
    .then((answers) => writeFile('README.md', buildReadMe(answers)))
    .then(() => console.log('Successfully wrote to README.md'))
    .catch((err) => console.error(err));
};

init();