import React, { Component, PropTypes } from 'react';
import jsYaml from 'js-yaml';
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
    loadUser: PropTypes.func,
    createUser: PropTypes.func,
    saveUserPicture: PropTypes.func,
    loadUserPicture: PropTypes.func,
    renameUserPicture: PropTypes.func
  };

  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      yamlData: props.yamlData || {},
      editingCount: 0,
      newUser: false
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      yamlData: props.yamlData || {}
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
    const pictureFile = yamlData.pictureFile;
    delete yamlData.pictureFile;
    const yamlText = jsYaml.safeDump(yamlData);
    console.log(yamlText);

    saveUser(user || yamlData.login, yamlText).then(() => {
      this.state.newUser = false;
    });
  }

  loadUser(url) {
    return this.props.loadUser(url).then(() => {
      history.length = 0;
      this.setState({ newUser: false });
    });
  }

  createUser() {
    return this.props.createUser().then(() => {
      history.length = 0;
      this.setState({ newUser: true });
    });
  }

  render() {
    const { yamlData, editingCount, newUser } = this.state;
    const { users } = this.props;
    const { id, about, login, ex, description } = yamlData || {};

    const exBtnClasses = classNames('btn', { 'btn-primary': !ex, 'btn-default': ex });
    const active = ex ? 'Ex-Employee' : 'Active';
    const canPublish = editingCount === 0 && yamlData && ((!newUser && history.length) || (newUser && login));

    const experienceItems = (yamlData.experience || []).map((exp, i) =>
      <ExperienceYaml
        editingChanged={this.onEditingChanged}
        onSave={this.onSaveExperience.bind(this, i)}
        key={i}
        {...exp}
      />
    );
    return (
      <div className="profile container">
        <div>
          <img className="tikal-logo" src="../src/css/pictures/tikal-logo.png" alt="Tikal" />
        </div>
        <div className="main-buttons pull-right">
          <ProfilesList users={users} loadUser={this.loadUser} />
          <button className="btn" onClick={this.save} disabled={!canPublish}>Publish</button>
          <button className="btn" onClick={this.undo} disabled={editingCount > 0 || !history.length}>Undo</button>
          <button className="btn" onClick={this.createUser} disabled={editingCount > 0}>New Profile</button>
        </div>
        {yamlData &&
          <div>
            <h1 className="titleName">
              {yamlData.first_name} {yamlData.last_name}
            </h1>
            <h2 className="descName">{description}</h2>
            <div>
              <button onClick={this.toggelEx} className={exBtnClasses}>{active}</button>
            </div>
            <MetaData
              saveMetaData={this.onSaveMetaData}
              id={id}
              about={about}
              login={login}
              editingChanged={this.onEditingChanged}
              description={description}
              first_name={yamlData.first_name}
              last_name={yamlData.last_name}
              follow_me_urls={yamlData.follow_me_urls}
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
                  editingChanged={this.onEditingChanged}
                  saveSkills={this.onSaveSkills.bind(this, 'developer_skills')}
                  skills={yamlData.skills.developer_skills}
                />
                <h3>Expert skills</h3>
                <Skills
                  editingChanged={this.onEditingChanged}
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
