const axios = require("axios");
const GithubSearch = require("../githubSearch");

jest.mock("axios");

describe("GithubSearch", () => {
    describe("buildUrl", () => {
      it("Should return a Github repository search URL using a Github username and a repostory name of the user.", () => {
        const repo = new GithubSearch();
        const user = "RaulMaya";
        const repoName = "ThermoFood-App"
  
        const url = repo.buildUrl(user, repoName);
  
        expect(url).toEqual(`https://api.github.com/repos/${user}/${repoName}`);
      });
    });
  
    describe("search", () => {
      it("Should search the Github API for a given repository according the selected user.", () => {
        const repo = new GithubSearch();
        const user = "RaulMaya";
        const repoName = "ThermoFood-App"
  
        axios.get.mockReturnValue(
          new Promise(function(resolve) {
            resolve({ data: {} });
          })
        );
  
        expect(repo.search(user, repoName)).resolves.toEqual({ data: {} });
        expect(axios.get).lastCalledWith(repo.buildUrl(user, repoName));
      });
    });
  });
  