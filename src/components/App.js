import React, { Component } from 'react';
import yaml from 'js-yaml';
import autoBind from 'react-autobind';
import GithubLogin from './GithubLogin';
import YamlEditor from './YamlEditor';
import GithubClient from '../lib/githubClient';

let githubClient;

export default class App extends Component {
  constructor(props) {
    super(props);
    let token;
    try {
      token = localStorage.getItem('apiToken');
    } catch (ex) {
      console.log(ex);
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
    if (github.APIKey) {
      githubClient = new GithubClient(github.APIKey);
      this.loadUsers();
    }
  }

  setApiToken(apiToken) {
    const { github } = this.state;
    github.APIKey = apiToken;

    localStorage.setItem('apiToken', github.APIKey);
    this.setState({ github });
  }

  saveUser(name, yml) {
    githubClient.saveUserYaml(name, yml).then(() => {
      console.log(`user ${name} saved`);
      // reload users to update links after commit
      this.loadUsers();
    });
  }

  loadUser(url) {
    GithubClient.loadUserYaml(url).then((userYaml) => {
      const user = url.substring(0, url.indexOf('.yml')).replace(/^.*[\\\/]/, '');
      console.log('user', user);
      this.setState({ userYaml: yaml.safeLoad(userYaml), user });
    });
  }

  loadUsers() {
    githubClient.loadUsers().then((users) => {
      this.setState({ users });
    });
  }

  render() {
    const { github, users, userYaml, user } = this.state;

    return (
      <div className="container app">
        {!github.APIKey &&
          <GithubLogin setApiToken={this.setApiToken} />
        }
        {github.APIKey &&
          <YamlEditor
            users={users}
            user={user}
            yamlData={userYaml}
            loadUser={this.loadUser}
            saveUser={this.saveUser}
          />
        }
      </div>
    );
  }
}
