import React, {Component} from 'react';
import GithubLogin from './GithubLogin';
import YamlEditor from './YamlEditor';
import GithubClient from '../lib/githubClient';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';

import fs from 'fs';


export default class App extends Component {
  constructor(props) {
    super(props);
    let token;
    try{
      token = fs.readFileSync('apiToken.dat', 'utf8');
    }
    catch (ex){

    }

    if (token) {
      //try to get list of users from github

    }
    this.state = {
      github: {
        APIKey: token
      }
    }
  }

  setApiToken(apiToken) {
    const { github } = this.state;
    github.APIKey = apiToken;

    fs.writeFile('apiToken.dat', github.APIKey);
    this.setState({github});
  }

  render() {
    const { github } = this.state;

    return (
      <div className="container app">
        {!github.APIKey &&
          <GithubLogin setApiToken={this.setApiToken.bind(this)} />
        } 
        {github.APIKey &&
          <YamlEditor fileName="adam"/>
          
        }
      </div>
    );
  }
}
