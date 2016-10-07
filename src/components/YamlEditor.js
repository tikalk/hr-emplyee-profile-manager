import React, { Component, PropTypes } from 'react';
import jsYaml from 'js-yaml';
import _ from 'lodash';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';
import MetaData from './MetaData';
const history = [];

export default class YamlEditor extends Component {

  static propTypes = {
    yamlData: PropTypes.object,
    user: PropTypes.string,
    users: PropTypes.array,
    saveUser: PropTypes.func,
    loadUser: PropTypes.func,
    createUser: PropTypes.func,
    uploader: PropTypes.func
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      yamlData: props.yamlData,
      editing: false,
      newUser: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      yamlData: props.yamlData || {},
      editing: false
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

  onEditingChanged(itemEditing) {
    let { editingCount } = this.state;
    editingCount += itemEditing ? 1 : -1;
    this.setState({ editingCount });
  }

  undo() {
    const yamlData = history.pop();
    if (yamlData) {
      this.setState({ yamlData });
    }
  }

  startEditing() {
    this.setState({ editing: true });
  }

  cancelEditing() {
    this.setState({ yamlData: this.props.yamlData, editing: false });
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
    if (!yamlData) return;
    const yamlText = jsYaml.safeDump(yamlData);
    saveUser(user, yamlData.login + (yamlData.ex ? '.ex' : ''), yamlText).then(() => {
      this.state.newUser = false;
    });
  }

  createUser() {
    return this.props.createUser().then(() => {
      history.length = 0;
      this.setState({ newUser: true, editing: true });
    });
  }

  onValueChange(path, key, value) {
    const { yamlData } = this.state;
    history.push(_.cloneDeep(yamlData));
    if (!path || path.length === 0) {
      yamlData[key] = value;
    } else {
      let obj = yamlData;
      for (let i = 0 ; i < path.length; i++) {
        if (i < path.length - 1) {
          obj = obj[path[i]];
        } else {
          obj[path[i]][key] = value;
        }
      }
    }
    this.setState({ yamlData });
  }

  render() {
    const { uploader } = this.props;
    const { yamlData, editing, newUser } = this.state;
    // const { users } = this.props;
    const { id, about, login, ex, description } = yamlData || {};

    // const exBtnClasses = classNames('btn', { 'btn-primary': !ex, 'btn-default': ex });
    // const active = ex ? 'Ex-Employee' : 'Active';
    // const canPublish = editingCount === 0 && yamlData && ((!newUser && history.length) || (newUser && login));

    if (_.isEmpty(yamlData)) {
      return <div />;
    }
    const experienceItems = (yamlData.experience || []).map((exp, i) =>
      <ExperienceYaml
        key={i}
        onChange={this.onValueChange.bind(this, ['experience'])}
        editing={editing}
        {...exp}
      />
    );
    return (
      <div className="profile">
        <nav className="top-nav">
          <div className="nav-wrapper">
            <ul className="right">
              {!editing && <li><a onClick={this.startEditing}><i className="material-icons">edit</i></a></li>}
              {editing && <li><a onClick={this.cancelEditing}><i className="material-icons">cancel</i></a></li>}
              <li><a onClick={this.save}>Publish</a></li>
              <li><a onClick={this.undo} disabled={!history.length}>Undo</a></li>
              <li><a onClick={this.createUser}>New Profile</a></li>
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
            <div className="section">
              {experienceItems}
            </div>
          </div>
          <div className="card-panel">
            <h4>Skills</h4>
            {yamlData.skills &&
              <div className="row">
                <div className="col s6">
                  <h5>Developer Skills</h5>
                  <Skills
                    skills={yamlData.skills.developer_skills}
                    onChange={this.onValueChange.bind(this, ['skills', 'developer_skills'])}
                    editing={editing}
                  />
                </div>
                <div className="col s6">
                  <h5>Expert skills</h5>
                  <Skills
                    skills={yamlData.skills.expert_skills}
                    onChange={this.onValueChange.bind(this, ['skills', 'expert_skills'])}
                    editing={editing}
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>

    );
  }
}
