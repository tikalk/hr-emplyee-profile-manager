import React, {Component} from 'react';

import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';
import autoBind from 'react-autobind';

const history = [];

export default class YamlEditor extends Component {

  constructor(props) {
    super(props);
    const yamlData = yaml.safeLoad(fs.readFileSync(this.props.fileName + '.yaml', 'utf8'));
    console.log(yamlData);
    autoBind(this);
    this.state = {
      yamlData: yamlData
    }
  }

  onSaveExperience(id, data) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.experience[id] = data;
    this.setState({ yamlData });
    this.save();
  }

  onSaveSkills(type, skills) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.skills[type] = skills;
    this.setState({ yamlData });
    this.save();
  }

  undo() {
    const data = history.pop();
    if (data) {
      this.setState({ yamlData: data });
    }
  }

  save() {
    const { yamlData } = this.state;
  }

  render() {
    const { yamlData } = this.state;

    const followMe = yamlData.follow_me_urls.map((url) => {
      return (
        <div key={url}>
          {url}
        </div>
      );
    });
    const experiences = yamlData.experience.map((exp, i) => {
      return (
        <ExperienceYaml onSave={this.onSaveExperience.bind(this, i)} key={i} {...exp}/>
      );

    });

    return (
      <div className="profile content">
        <div>
          <img className="tikal-logo" src="../src/css/pictures/tikal-logo.png"/>
        </div>
        <div className="pull-right">
          <button className="btn">Publish</button>
          &nbsp;
          <button className="btn" onClick={this.undo}>Undo</button>
        </div>
        <div>
          <h1 className="titleName">
            {yamlData.first_name} {yamlData.last_name}
          </h1>
          <h2 className="descName">{yamlData.description}</h2>
          <div className="container">
            <div className="row">
              <div className="col-md-2">ID:</div>
              <div className="col-md-10">{yamlData.id}</div>
            </div>
            <div className="row">
              <div className="col-md-2">About:</div>
              <div className="col-md-10">{yamlData.about}</div>
            </div>
            <div className="row">
              <div className="col-md-2">Login:</div>
              <div className="col-md-10">{yamlData.login}</div>
            </div>
            <div className="row">
              <div className="col-md-2">Follow Me:</div>
              <div className="col-md-10">{followMe}</div>
            </div>
          </div>
          <h2>Experience</h2>
          <div className="container">
            {experiences}
          </div>
          <h2>Skills</h2>
          <h3>Developer Skills</h3>
          <Skills saveSkills={this.onSaveSkills.bind(this, 'developer_skills')} skills={yamlData.skills.developer_skills} />
          <h3>Expert skills</h3>
          <Skills saveSkills={this.onSaveSkills.bind(this, 'expert_skills')} skills={yamlData.skills.expert_skills} />
        </div>
      </div>
    );
  }
}