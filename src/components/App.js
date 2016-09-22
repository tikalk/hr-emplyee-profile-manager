import React, { Component } from 'react';
import jsYaml from 'js-yaml';
import autoBind from 'react-autobind';
import _, { get } from 'lodash';
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

  getDataUri(file) {
    return new Promise(
      (resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          resolve(reader.result);
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        }
      });
  }

  createUser() {
    return githubClient.loadTemplate().then((yamlTemplate) => {
      this.setState({ userYaml: jsYaml.safeLoad(yamlTemplate), user: '' });
      return '';
    });
  }

  saveUser(name, yamlText, pictureFile) {
    const userYaml = jsYaml.safeLoad(yamlText);
    const newPicturePath = get(pictureFile, 'path', '');
    const userLogin = get(userYaml, 'login', '');
    const pictureExtension = newPicturePath.split('.').pop();
    const imagePath = `pictures/${userLogin}.${pictureExtension}`;
    /*
     check if new picture is exists
     */
    if (pictureFile) {
      /*
       update user yaml
       */
      userYaml.image_path = imagePath;
      return this.getDataUri((pictureFile))
        .then((data) => {
          return githubClient.saveUserPicture(imagePath, data);
        })
        .then(() => {
          this.saveAndReloadUsers(name, userYaml, yamlText);
        });
    }

    /*
     no new file selected,check if image_path is the present and if not according to convention
     pictures/login.extension rename it to new convention
     */
    userYaml.image_path = imagePath;
    if (userYaml.image_path && userYaml.image_path.toLowerCase() !== imagePath.toLocaleLowerCase()) {
      return githubClient.renameUserPicture(userYaml.image_path, imagePath)
          .then(() => {
            return this.saveAndReloadUsers(name, userYaml, yamlText);
          });
    }
    return this.saveAndReloadUsers(name, userYaml, yamlText);
  }
  saveAndReloadUsers(user, userYaml, yamlText) {
    return githubClient.saveUserYaml(name, yamlText).then(() => {
      console.log(`user ${name} saved`);
      this.setState({ user, userYaml });
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
    githubClient.loadUsers().then((files) => {
      const users = _.filter(files, user => user.name.indexOf('.yml') >= 0);
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
