import React, { Component } from 'react';
import jsYaml from 'js-yaml';
import autoBind from 'react-autobind';
import _ from 'lodash';
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
    // fs.writeFile('apiToken.dat', github.APIKey);
    this.setState({ github });
  }

  createUser() {
    return githubClient.loadTemplate().then((yamlTemplate) => {
      this.setState({ userYaml: jsYaml.safeLoad(yamlTemplate), user: '' });
      return '';
    });
  }

  saveUser(name, yaml) {
    return githubClient.saveUserYaml(name, yaml).then(() => {
      console.log(`user ${name} saved`);
      this.setState({ userYaml: jsYaml.safeLoad(yaml), user: name });
      // reload users to update links after commit
      this.loadUsers();
    });
  }

  loadUser(url) {
    return githubClient.loadUserYaml(url).then((userYaml) => {
      const user = url.substring(0, url.indexOf('.yml')).replace(/^.*[\\\/]/, '');
      console.log('user', user);
      this.setState({ userYaml: jsYaml.safeLoad(userYaml), user });
      return user;
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
            createUser={this.createUser}
          />
        }
      </div>
    );
  }
}
