import React, {Component} from 'react';

//import fs from 'fs';
import jsYaml from 'js-yaml';
import _ from 'lodash';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';
import MetaData from './MetaData';
import ProfilesList from './ProfilesList';
import autoBind from 'react-autobind';
import classNames from 'classnames';

const history = [];

export default class YamlEditor extends Component {

  constructor(props) {
    super(props);
    const { yamlData } = props;
    //const yamlData = jsYaml.safeLoad(fs.readFileSync(this.props.fileName + '.jsYaml', 'utf8'));
    autoBind(this);
    this.state = {
      yamlData,
      editingCount: 0,
      newUser:false
    }
  }

  componentWillReceiveProps(props) {
    const { yamlData } = props;
    this.setState({
      yamlData
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
    const { user, saveUser } = this.props;
    const { yamlData, newUser } = this.state;
    if (!yamlData) return;
    const yamlText = jsYaml.safeDump(yamlData);
    console.log(yamlText);

    saveUser(user || yamlData.login, yamlText).then(()=>{
      this.state.newUser=false;
    });
  }

  onEditingChanged(itemEditing) {
    let { editingCount } = this.state;
    editingCount += itemEditing ? 1 : -1;
    this.setState({ editingCount });
  }

  loadUser(url) {
    return this.props.loadUser(url).then(()=> {
      history.length = 0;
      this.setState({newUser:false});
    });
  }

  createUser() {
    return this.props.createUser().then(()=> {
      history.length = 0;
      this.setState({newUser:true});
    });

  }

  render() {
    const { yamlData, editingCount, newUser } = this.state;
    const { users, loadUser } = this.props;
    const { id, about, login, follow_me_urls, ex, first_name, last_name, description } = yamlData || {};

    const exBtnClasses = classNames('btn', { 'btn-primary': !ex, 'btn-default': ex });
    const active = ex ? 'Ex-Employee' : 'Active';
    const canPublish = editingCount === 0 && yamlData && ((!newUser && history.length) || (newUser && login));
    console.log(canPublish)
    return (
      <div className="profile container">
        <div>
          <img className="tikal-logo" src="../src/css/pictures/tikal-logo.png"/>
        </div>
        <div className="main-buttons pull-right">
          <ProfilesList users={users} loadUser={this.loadUser}/>
          <button className="btn" onClick={this.save} disabled={!canPublish}>Publish</button>
          <button className="btn" onClick={this.undo} disabled={editingCount>0 || !history.length}>Undo</button>
          <button className="btn" onClick={this.createUser} disabled={editingCount>0}>New Profile</button>
        </div>
        {yamlData &&
        <div>
          <h1 className="titleName">
            {first_name} {last_name}
          </h1>
          <h2 className="descName">{description}</h2>
          <div>
            <button onClick={this.toggelEx} className={exBtnClasses}>{active}</button>
          </div>
          <MetaData
            editingChanged={this.onEditingChanged} saveMetaData={this.onSaveMetaData}
            id={id} about={about} login={login} first_name={first_name} last_name={last_name}
            description={description} follow_me_urls={follow_me_urls}/>
          <h2>Experience</h2>
          <div className="container">
            {yamlData.experience && yamlData.experience.map((exp, i) => {
              return (
                <ExperienceYaml
                  editingChanged={this.onEditingChanged}
                  onSave={this.onSaveExperience.bind(this, i)} key={i} {...exp}/>
              );
            })
            }
          </div>
          <h2>Skills</h2>
          {yamlData.skills &&
          <div>
            <h3>Developer Skills</h3>
            <Skills
              editingChanged={this.onEditingChanged}
              saveSkills={this.onSaveSkills.bind(this, 'developer_skills')}
              skills={yamlData.skills.developer_skills}/>
            <h3>Expert skills</h3>
            <Skills
              editingChanged={this.onEditingChanged}
              saveSkills={this.onSaveSkills.bind(this, 'expert_skills')}
              skills={yamlData.skills.expert_skills}/>
          </div>
          }

        </div>
        }
      </div>
    );
  }
}
