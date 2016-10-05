import React, { Component } from 'react';
import jsYaml from 'js-yaml';
import autoBind from 'react-autobind';
import GithubLogin from './GithubLogin';
import YamlEditor from './YamlEditor';
import GithubClient from '../lib/githubClient';

let githubClient;
const storageAuthKey = 'currentAuth';

export default class App extends Component {
  constructor(props) {
    super(props);
    let auth;
    try {
      auth = localStorage.getItem(storageAuthKey);
      if (auth) auth = JSON.parse(auth);
      if (auth && !auth.token) auth = undefined;
    } catch (ex) {
      console.error(ex);
    }

    this.state = {
      auth
    };
    autoBind(this);
  }

  componentDidMount() {
    const { auth } = this.state;
    this.authenticate(auth).then(() => this.loadUsers());
  }

  setApiToken(auth) {
    if (!auth.token) return;

    this.authenticate(auth).then(() => {
      localStorage.setItem(storageAuthKey, JSON.stringify(auth));
      this.loadUsers();
    });
  }

  authenticate(auth) {
    if (!auth) return Promise.reject('No auth token');
    githubClient = new GithubClient(auth);
    return githubClient.getAuthenticated()
      .then(({ data }) => {
        this.setState({ auth, editor: data.name });
      }, (msg) => {
        githubClient = undefined;
        this.setState({ auth: undefined });
        return Promise.reject(msg);
      });
  }

  createUser() {
    return githubClient.loadTemplate().then((yamlTemplate) => {
      this.setState({ userYaml: jsYaml.safeLoad(yamlTemplate), user: '' });
      return '';
    });
  }

  saveUser(oldName, name, yaml) {
    return githubClient.saveUserProfile(oldName, name, yaml).then(() => {
      console.log(`user ${name} saved`);
      this.setState({ userYaml: jsYaml.safeLoad(yaml), user: name });
      // reload users to update links after commit
      this.loadUsers();
    });
  }

  loadUser(userInfo) {
    const { user } = userInfo;
    console.log('user', user);
    return githubClient.loadUserProfile(user).then((userYaml) => {
      this.setState({ userYaml: jsYaml.safeLoad(userYaml), user });
      return user;
    });
  }

  loadUsers() {
    return githubClient.loadUsers().then((usersList) => {
      const users = usersList.sort((a, b) => {
        if (a.isEx !== b.isEx) {
          return a.isEx ? 1 : -1;
        }
        const ai = a.user.toLowerCase();
        const bi = b.user.toLowerCase();
        if (ai > bi) {
          return 1;
        }
        if (ai < bi) {
          return -1;
        }
        return 0;
      });
      this.setState({ users });
    });
  }

  render() {
    const { auth, users, userYaml, user } = this.state;

    return (
      <div className="container app">
        {!auth && <GithubLogin setApiToken={this.setApiToken} />}
        {auth && <YamlEditor
          users={users}
          user={user}
          yamlData={userYaml}
          loadUser={this.loadUser}
          saveUser={this.saveUser}
          createUser={this.createUser}
        />}
      </div>
    );
  }
}
