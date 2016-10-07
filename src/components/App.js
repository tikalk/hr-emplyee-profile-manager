import React, { Component } from 'react';
import cloudinary from 'cloudinary';
import jsYaml from 'js-yaml';
import autoBind from 'react-autobind';
import GithubLogin from './GithubLogin';
import YamlEditor from './YamlEditor';
import GithubClient from '../lib/githubClient';
import ProfilesList from './ProfilesList';

let githubClient;
const storageAuthKey = 'currentAuth';
const cloudStorage = 'cloudStorage';

export default class App extends Component {
  constructor(props) {
    super(props);
    let auth;
    auth = localStorage.getItem(storageAuthKey);
    if (auth) {
      auth = JSON.parse(auth);
    }
    if (auth && !auth.token) {
      auth = undefined;
    }
    const state = {};

    state.auth = auth;
    this.state = state;
    autoBind(this);
    this.loadCloudStorage();
  }

  componentDidMount() {
    const { auth } = this.state;
    this.authenticate(auth).then(() => this.loadUsers());
  }

  setApiTokens(tokens) {
    const auth = {
      token: tokens.token,
      user: tokens.user
    };
    const cStorage = {
      cloudinaryAPIKey: tokens.cloudinaryAPIKey,
      cloudinarySecret: tokens.cloudinarySecret
    };

    if (!auth.token) {
      return;
    }

    this.authenticate(auth).then(() => {
      localStorage.setItem(storageAuthKey, JSON.stringify(auth));
      this.loadUsers();
    });
    localStorage.setItem(cloudStorage, JSON.stringify(cStorage));
    this.loadCloudStorage();
  }

  loadCloudStorage() {
    const cloud = localStorage.getItem(cloudStorage);
    if (cloud) {
      const obj = JSON.parse(cloud);
      if (obj.cloudinaryAPIKey && obj.cloudinarySecret) {
        cloudinary.config({
          cloud_name: 'ds7ihqtdu',
          api_key: obj.cloudinaryAPIKey,
          api_secret: obj.cloudinarySecret
        });
        this.uploader = cloudinary.uploader;
      }
    }
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

    const showLoginPage = !auth || !this.uploader;
    return (
      <div className="app">
        {showLoginPage && <GithubLogin setApiTokens={this.setApiTokens} />}
        {!showLoginPage &&
          <div>
            <div className="side-nav fixed">
              <div>
                <img className="tikal-logo" src="../src/css/pictures/tikal-logo.png" alt="Tikal" />
              </div>
              <ProfilesList users={users} loadUser={this.loadUser}/>
            </div>
            <main>
              <YamlEditor
                users={users}
                user={user}
                yamlData={userYaml}
                loadUser={this.loadUser}
                saveUser={this.saveUser}
                createUser={this.createUser}
                uploader={this.uploader}
              />
            </main>
          </div>
        }
      </div>
    );
  }
}
