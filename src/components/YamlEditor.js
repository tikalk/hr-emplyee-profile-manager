import React, {Component} from 'react';

import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';
import MetaData from './MetaData';
import autoBind from 'react-autobind';
import classNames from 'classnames';

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

  onSaveMetaData(metadata) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    _.merge(yamlData, metadata);
    this.setState({ yamlData });
    this.save();
  }

  undo() {
    const data = history.pop();
    if (data) {
      this.setState({ yamlData: data });
    }
  }

  toggelEx() {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.ex = !yamlData.ex;
    this.setState({ yamlData });
  }

  save() {
    const { yamlData } = this.state;
    const yamlText = yaml.safeDump(yamlData);
    console.log(yamlText);

  }

  render() {
    const { yamlData } = this.state;
    const { id, about, login, follow_me_urls, ex } = yamlData;

    const experiences = yamlData.experience.map((exp, i) => {
      return (
        <ExperienceYaml onSave={this.onSaveExperience.bind(this, i)} key={i} {...exp}/>
      );
    });

    const exBtnClasses = classNames('btn', {'btn-primary': !ex, 'btn-default': ex});
    const active = ex ? 'Ex-Employee' : 'Active';
    return (
      <div className="profile container">
        <div>
          <img className="tikal-logo" src="../src/css/pictures/tikal-logo.png"/>
        </div>
        <div className="pull-right">
          <button className="btn" onClick={this.save}>Publish</button>
          &nbsp;
          <button className="btn" onClick={this.undo}>Undo</button>
        </div>
        <div>
          <h1 className="titleName">
            {yamlData.first_name} {yamlData.last_name}
          </h1>
          <h2 className="descName">{yamlData.description}</h2>
          <div>
            <button onClick={this.toggelEx} className={exBtnClasses}>{active}</button>
          </div>
          <MetaData saveMetaData={this.onSaveMetaData} id={id} about={about} login={login} follow_me_urls={follow_me_urls} />
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