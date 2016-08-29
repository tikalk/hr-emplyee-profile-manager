import React, {Component} from 'react';
import GithubLogin from './GithubLogin';
import YamlEditor from './YamlEditor';
import GithubClient from '../lib/githubClient';
import autoBind from 'react-autobind';
import fs from 'fs';
import yaml from 'js-yaml';

let githubClient;

export default class App extends Component {
  constructor(props) {
    super(props);
    let token;
    try{
      token = fs.readFileSync('apiToken.dat', 'utf8');
    }
    catch (ex){

    }

    this.state = {
      github: {
        APIKey: token
      }
    };
    autoBind(this);
  }

  componentDidMount() {
    const { github } = this.state;
    const that = this;
    if (github.APIKey) {
      githubClient = new GithubClient(github.APIKey);
      githubClient.loadUsers((err, users) => {
        that.setState({ users });
      });
    }
  }

  loadUser(url) {
    githubClient.loadUserYaml(url, (err, userYaml) => {

      this.setState({ userYaml: yaml.safeLoad(userYaml) });
    });
  }
  setApiToken(apiToken) {
    const { github } = this.state;
    github.APIKey = apiToken;

    fs.writeFile('apiToken.dat', github.APIKey);
    this.setState({github});
  }

  render() {
    const { github, users, userYaml } = this.state;

    return (
      <div className="container app">
        {!github.APIKey &&
          <GithubLogin setApiToken={this.setApiToken.bind(this)} />
        }
        {github.APIKey &&
          <YamlEditor users={users} yamlData={userYaml} loadUser={this.loadUser}/>
        }
      </div>
    );
  }
}
