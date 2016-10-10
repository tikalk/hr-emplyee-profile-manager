import React, { Component, PropTypes } from 'react';
import jsYaml from 'js-yaml';
import _ from 'lodash';
import autoBind from 'react-autobind';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';
import MetaData from './MetaData';
import NewSkill from './NewSkill';
import NewExperience from './NewExperience';

const history = [];

export default class YamlEditor extends Component {

  static propTypes = {
    yamlData: PropTypes.object,
    user: PropTypes.string,
    saveUser: PropTypes.func,
    uploader: PropTypes.object
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      yamlData: _.cloneDeep(props.yamlData || {}),
      editing: !props.user
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      yamlData: _.cloneDeep(props.yamlData || {}),
      editing: !props.user
    });
  }

  onValueChange(path, key, value) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    if (!path || path.length === 0) {
      yamlData[key] = value;
    } else {
      let obj = yamlData;
      for (let i = 0; i < path.length; i++) {
        if (i < path.length - 1) {
          obj = obj[path[i]];
        } else {
          obj[path[i]][key] = value;
        }
      }
    }
    this.setState({ yamlData, isDirty: true });
  }

  onSkillRemove(type, skill) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    delete yamlData.skills[type][skill];
    this.setState({ yamlData, isDirty: true });
  }

  onSkillAdd(type, skill) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.skills[type][skill] = 0;
    this.setState({ yamlData, isDirty: true });
  }

  onExperienceAdd(exp) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.experience = [exp, ...(yamlData.experience || [])];
    this.setState({ yamlData, isDirty: true });
  }

  onExperienceRemove(index) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.experience.splice(index, 1);
    this.setState({ yamlData, isDirty: true });
  }

  save() {
    const { user, saveUser } = this.props;
    const { yamlData } = this.state;
    if (!yamlData) return;
    const yamlText = jsYaml.safeDump(yamlData);
    saveUser(user, yamlData.login + (yamlData.ex ? '.ex' : ''), yamlText);
  }

  toggelEx() {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    yamlData.ex = !yamlData.ex;
    this.setState({ yamlData });
  }

  cancelEditing() {
    let confirmed = true;
    if (this.state.isDirty) {
      confirmed = confirm('Are you sure? You will lose your changes'); // eslint-disable-line
    }
    if (confirmed) {
      this.setState({ yamlData: _.cloneDeep(this.props.yamlData), editing: false });
    }
  }

  startEditing() {
    this.setState({ editing: true });
  }

  undo() {
    const yamlData = history.pop();
    if (yamlData) {
      this.setState({ yamlData });
    } else {
      this.setState({ isDirty: false });
    }
  }

  render() {
    const { uploader } = this.props;
    const { yamlData, editing } = this.state;
    const { ex, description } = yamlData || {};

    if (_.isEmpty(yamlData)) {
      return <div />;
    }
    const experienceItems = (yamlData.experience || []).map((exp, i) =>
      <ExperienceYaml
        key={i}
        onChange={this.onValueChange.bind(this, ['experience', i])}
        onRemove={this.onExperienceRemove.bind(this, i)}
        editing={editing}
        {...exp}
      />
    );
    return (
      <div className="profile">
        <nav className="top-nav">
          <div className="nav-wrapper">
            <ul className="right">
              {
                !editing && <li>
                  <a onClick={this.startEditing}><i className="material-icons">edit</i></a>
                </li>
              }
              {
                editing && <li>
                  <a onClick={this.cancelEditing}><i className="material-icons">cancel</i></a>
                </li>
              }
              <li><a onClick={this.save}>Publish</a></li>
              <li><a onClick={this.undo} disabled={!history.length}>Undo</a></li>
            </ul>
          </div>
        </nav>
        <div className="profile-details">
          <h3 className="titleName">
            {yamlData.first_name} {yamlData.last_name}
          </h3>
          <h4 className="descName">{description}</h4>
          <div>
            <div className="switch">
              <label>
                Ex Employee
                {ex ?
                  <input onChange={this.toggelEx} type="checkbox" />
                  :
                  <input onChange={this.toggelEx} type="checkbox" checked />
                }
                <span className="lever" />
                Active
              </label>
            </div>
          </div>
          <MetaData
            yamlData={yamlData}
            onChange={this.onValueChange.bind(this, '')}
            editing={editing}
            uploader={uploader}
          />
          <div className="card-panel">
            <h4>Experience</h4>
            {
              editing && <NewExperience
                onAdd={this.onExperienceAdd}
              />
            }
            <div className="section">
              {experienceItems}
            </div>
          </div>
          <div className="card-panel">
            <h4>Skills</h4>
            {
              yamlData.skills && <div className="row">
                <div className="col s6">
                  <h5>Developer Skills</h5>
                  <Skills
                    skills={yamlData.skills.developer_skills || {}}
                    onChange={this.onValueChange.bind(this, ['skills', 'developer_skills'])}
                    onSkillRemove={this.onSkillRemove.bind(this, 'developer_skills')}
                    editing={editing}
                  />
                  {
                    editing && <NewSkill
                      skills={Object.keys(yamlData.skills.developer_skills || {})}
                      onAdd={this.onSkillAdd.bind(this, 'developer_skills')}
                    />
                  }
                </div>
                <div className="col s6">
                  <h5>Expert skills</h5>
                  <Skills
                    skills={yamlData.skills.expert_skills || {}}
                    onChange={this.onValueChange.bind(this, ['skills', 'expert_skills'])}
                    onSkillRemove={this.onSkillRemove.bind(this, 'expert_skills')}
                    editing={editing}
                  />
                  {
                    editing && <NewSkill
                      skills={Object.keys(yamlData.skills.expert_skills || {})}
                      onAdd={this.onSkillAdd.bind(this, 'expert_skills')}
                    />
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
