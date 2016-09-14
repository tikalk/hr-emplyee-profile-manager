import React, {Component} from 'react';
import GithubLogin from './GithubLogin';
import YamlEditor from './YamlEditor';
import GithubClient from '../lib/githubClient';
import autoBind from 'react-autobind';
// import fs from 'fs';
import yaml from 'js-yaml';

let githubClient;

export default class App extends Component {
  constructor(props) {
    super(props);
    let token;
    try {
      token = localStorage.getItem('apiToken');
    }
    catch (ex) {

    }

    this.state = {
      github: {
        APIKey: token
      }
    };
    autoBind(this);
  }

  componentDidMount() {
    const {github} = this.state;
    if (github.APIKey) {
      githubClient = new GithubClient(github.APIKey);
      this.loadUsers();
    }
  }

  loadUsers() {
    githubClient.loadUsers().then((users) => {
      this.setState({users});
    });
  }

  loadUser(url) {
    githubClient.loadUserYaml(url).then((userYaml) => {
      let user = url.substring(0, url.indexOf('.yml')).replace(/^.*[\\\/]/, '');
      console.log('user', user);
      this.setState({userYaml: yaml.safeLoad(userYaml), user: user});
    });
  }

  saveUser(name, yaml) {
    githubClient.saveUserYaml(name, yaml).then(() => {
      console.log("user " + name + ' saved');
      // reload users to update links after commit
      this.loadUsers();
    });
  }

  setApiToken(apiToken) {
    const {github} = this.state;
    github.APIKey = apiToken;

    localStorage.setItem('apiToken', github.APIKey);
    this.setState({github});
  }

  render() {
    const {github, users, userYaml, user} = this.state;

    return (
      <div className="container app">
        {!github.APIKey &&
        <GithubLogin setApiToken={this.setApiToken.bind(this)}/>
        }
        {github.APIKey &&
        <YamlEditor users={users} user={user} yamlData={userYaml} loadUser={this.loadUser}
                    saveUser={this.saveUser}/>
        }
      </div>
    );
  }
}
