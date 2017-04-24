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

  onProfileDataChange(key, evt) {
    const value = evt.target.value;
    this.onValueChange('', key, value);
  }

  onValueChange(path, key, value) {
    this.safelyApplyYamlData((yamlData) => {
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
    });
  }

  onSkillRemove(type, skill) {
    this.safelyApplyYamlData(yamlData => (delete yamlData.skills[type][skill]));
  }

  onSkillAdd(type, skill) {
    this.safelyApplyYamlData((yamlData) => {
      const skills = yamlData.skills[type] || {};
      skills[skill] = 0;
      yamlData.skills[type] = skills;
    });
  }

  onExperienceAdd(exp) {
    this.safelyApplyYamlData(yamlData => (yamlData.experience = [exp, ...(yamlData.experience || [])]));
  }

  onExperienceRemove(index) {
    this.safelyApplyYamlData(yamlData => (yamlData.experience.splice(index, 1)));
  }

  save() {
    const { user, saveUser } = this.props;
    const { yamlData } = this.state;
    if (!yamlData || !yamlData.login) return;
    const yamlText = jsYaml.safeDump(yamlData);
    saveUser(user, yamlData.login + (yamlData.ex ? '.ex' : ''), yamlText);
  }

  toggelEx() {
    this.safelyApplyYamlData(yamlData => (yamlData.ex = !yamlData.ex));
  }

  safelyApplyYamlData(update) {
    const { yamlData, editing } = this.state;
    if (!editing) return;
    history.push(_.cloneDeep(yamlData));
    update(yamlData);
    this.setState({ yamlData, isDirty: true });
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
    const { ex } = yamlData || {};

    if (_.isEmpty(yamlData)) {
      return <div />;
    }
    const experienceItems = (yamlData.experience || [])
      .filter(e => e.years && e.title)
      .map((exp, i) =>
        <ExperienceYaml
          key={i}
          onChange={this.onValueChange.bind(this, ['experience', i])}
          onRemove={this.onExperienceRemove.bind(this, i)}
          editing={editing}
          {...exp}
        />
    );
    const skills = yamlData.skills || {};
    return (
      <div className="profile">
        <div className="profile-details">
          <div>
            <div className="switch">
              <label>
                Ex Employee
                <input onChange={this.toggelEx} type="checkbox" checked={!ex} />
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
            <div className="row">
              <div className="col s6">
                <h5>Developer Skills</h5>
                <Skills
                  skills={skills.developer_skills || {}}
                  onChange={this.onValueChange.bind(this, ['skills', 'developer_skills'])}
                  onSkillRemove={this.onSkillRemove.bind(this, 'developer_skills')}
                  editing={editing}
                />
                {
                  editing && <NewSkill
                    skills={Object.keys(skills.developer_skills || {})}
                    onAdd={this.onSkillAdd.bind(this, 'developer_skills')}
                  />
                }
              </div>
              <div className="col s6">
                <h5>Expert skills</h5>
                <Skills
                  skills={skills.expert_skills || {}}
                  onChange={this.onValueChange.bind(this, ['skills', 'expert_skills'])}
                  onSkillRemove={this.onSkillRemove.bind(this, 'expert_skills')}
                  editing={editing}
                />
                {
                  editing && <NewSkill
                    skills={Object.keys(skills.expert_skills || {})}
                    onAdd={this.onSkillAdd.bind(this, 'expert_skills')}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        { editing ?
          <div
            className="fixed-action-btn vertical active"
            style={{ bottom: '45px', right: '24px' }}
          >
            <a className="btn-floating btn-large teal accent-4" onClick={this.save} title="Publish">
              <i className="large material-icons">cloud_done</i>
            </a>
            <ul>
              <li><a className="btn-floating blue" onClick={this.undo} disabled={!history.length} title="Undo">
                <i className="material-icons">undo</i></a></li>
              <li><a className="btn-floating red" onClick={this.cancelEditing} title="Cancel">
                <i className="material-icons">clear</i></a></li>
            </ul>
          </div>
          :
          <div
            className="fixed-action-btn vertical"
            style={{ bottom: '45px', right: '24px' }}
          >
            <a className="btn-floating btn-large red" onClick={this.startEditing} title="Edit">
              <i className="large material-icons">mode_edit</i>
            </a>
          </div>
        }
      </div>
    );
  }
}
