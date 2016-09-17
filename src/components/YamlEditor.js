import React, { Component, PropTypes } from 'react';
import yaml from 'js-yaml';
import _ from 'lodash';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';
import MetaData from './MetaData';
import ProfilesList from './ProfilesList';

const history = [];

export default class YamlEditor extends Component {

  static propTypes = {
    yamlData: PropTypes.object,
    user: PropTypes.string,
    users: PropTypes.array,
    saveUser: PropTypes.func,
    loadUser: PropTypes.func
  }
  constructor(props) {
    super(props);
    const { yamlData } = props;
    autoBind(this);
    this.state = {
      yamlData: yamlData || {}
    };
  }

  componentWillReceiveProps(props) {
    const { yamlData } = props;
    this.setState({
      yamlData: yamlData || {}
    });
  }

  onSaveExperience(id, data) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.experience[id] = data;
    this.setState({ yamlData });
  }

  onSaveSkills(type, skills) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.skills[type] = skills;
    this.setState({ yamlData });
  }

  onSaveMetaData(metadata) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    _.merge(yamlData, metadata);
    this.setState({ yamlData });
  }

  undo() {
    const yamlData = history.pop();
    if (yamlData) {
      this.setState({ yamlData });
    }
  }

  toggelEx() {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.ex = !yamlData.ex;
    this.setState({ yamlData });
  }

  save() {
    const { user, saveUser } = this.props;
    const { yamlData } = this.state;
    const yamlText = yaml.safeDump(yamlData);
    console.log(yamlText);

    if (!user) return;
    saveUser(user, yamlText);
  }

  render() {
    const { yamlData } = this.state;
    const { users, loadUser } = this.props;
    const { id, about, login, followMeUrls, ex } = yamlData || {};

    const exBtnClasses = classNames('btn', { 'btn-primary': !ex, 'btn-default': ex });
    const active = ex ? 'Ex-Employee' : 'Active';

    const experienceItems = (yamlData.experience || []).map((exp, i) =>
      <ExperienceYaml onSave={this.onSaveExperience.bind(this, i)} key={i} {...exp} />
    );
    return (
      <div className="profile container">
        <div>
          <img className="tikal-logo" src="../src/css/pictures/tikal-logo.png" alt="Tikal" />
        </div>
        <div className="main-buttons pull-right">
          <ProfilesList users={users} loadUser={loadUser} />
          <button className="btn" onClick={this.save}>Publish</button>
          <button className="btn" onClick={this.undo}>Undo</button>
        </div>
        {yamlData &&
          <div>
            <h1 className="titleName">
              {yamlData.first_name} {yamlData.last_name}
            </h1>
            <h2 className="descName">{yamlData.description}</h2>
            <div>
              <button onClick={this.toggelEx} className={exBtnClasses}>{active}</button>
            </div>
            <MetaData
              saveMetaData={this.onSaveMetaData}
              id={id}
              about={about}
              login={login}
              followMeUrls={followMeUrls}
            />
            <h2>Experience</h2>
            <div className="container">
              {experienceItems}
            </div>
            <h2>Skills</h2>
            {yamlData.skills &&
              <div>
                <h3>Developer Skills</h3>
                <Skills
                  saveSkills={this.onSaveSkills.bind(this, 'developer_skills')}
                  skills={yamlData.skills.developer_skills}
                />
                <h3>Expert skills</h3>
                <Skills
                  saveSkills={this.onSaveSkills.bind(this, 'expert_skills')}
                  skills={yamlData.skills.expert_skills}
                />
              </div>
            }
          </div>
        }
      </div>
    );
  }
}
