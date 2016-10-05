import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import _ from 'lodash';
import EditToggle from './EditToggle';

let uidGen = 1;

const errStyle = {
  outline: '1px solid red'
};

const invisible = {
  display: 'none'
};

export default class Skills extends Component {

  static propTypes = {
    skills: PropTypes.object,
    saveSkills: PropTypes.func,
    editingChanged: PropTypes.func
  };


  constructor(props) {
    super(props);
    const state = this.parseSkillsErrorState(this.toInnerSkills(props.skills));
    this.state = {
      ...state,
      editing: false
    };
    autoBind(this);
  }

  componentWillReceiveProps(props) {
    this.updateSkillsAndErrorState(this.toInnerSkills(props.skills));
  }

  toggleEditing() {
    const { editing, skills } = this.state;
    if (editing) {
      this.props.saveSkills(this.toOuterSkills(skills));
    }
    this.props.editingChanged(!this.state.editing);
    this.setState({ editing: !this.state.editing });
  }

  toInnerSkills(skills) {
    return _.reduce(skills, (acc, value, name) => {
      acc.push({
        uid: uidGen++,
        name,
        value
      });
      return acc;
    }, []);
  }

  toOuterSkills(skills) {
    return _.reduce(skills, (acc, skill) => {
      const name = (skill.name || '').trim();
      if (name) acc[name] = skill.value;
      return acc;
    }, {});
  }

  updateSkillName(uid, e) {
    const { skills } = this.state;
    _.find(skills, { uid }).name = e.target.value;
    this.updateSkillsAndErrorState(skills);
  }

  updateSkillsAndErrorState(initialSkills) {
    this.setState(this.parseSkillsErrorState(initialSkills));
  }

  parseSkillsErrorState(initialSkills) {
    let hasErrors = false;
    const map = {};
    const skills = _.map(initialSkills, (skill) => {
      const { name } = skill;
      const res = { ...skill };
      delete res.errorN;
      const iName = (name || '').trim().toLowerCase();
      if (!iName) {
        res.errorN = 'Empty Name';
      } else if (map[iName]) {
        map[iName].errorN = res.errorN = 'Duplicated Name';
      } else {
        map[iName] = res;
      }
      hasErrors = hasErrors || !!res.errorN;
      return res;
    });
    return { skills, hasErrors };
  }

  deleteSkill(uid) {
    const { skills } = this.state;
    this.updateSkillsAndErrorState(_.filter(skills, (skill) => skill.uid !== uid));
  }

  addSkill() {
    const uid = uidGen++;
    const value = 1;
    const skills = [{ uid, value }, ...this.state.skills];
    this.setState({ skills });
  }

  render() {
    const { editing, skills, hasErrors } = this.state;
    let skls;
    if (!editing) {
      skls = _.map(skills, ({ name, value, uid }) => {
        return (<div key={uid} className="row">
          <span className="col-md-2">{name}:</span>
          <span className="col-md-9">{value}</span>
        </div>);
      }, []);
    } else {
      skls = _.map(skills, ({ name, value, uid, errorN, errorV }) => {
        return (<div key={uid} className="row">
          <i onClick={() => this.deleteSkill(uid)} className="glyphicon glyphicon-remove " />
          <input
            title={errorN}
            style={errorN ? errStyle : {}}
            type="text"
            className="form-control"
            defaultValue={name}
            onChange={(e) => {
              this.updateSkillName(uid, e);
            }}
          />
          <input
            title={errorV}
            style={errorV ? errStyle : {}}
            type="number"
            min="0"
            max="50"
            className="form-control"
            defaultValue={value}
            onChange={(e) => {
              _.find(skills, { uid }).value = e.target.value;
            }}
          />
        </div>);
      }, []);
    }

    return (
      <div className="container form-inline">
        <div className="row">
          <EditToggle onToggleEditing={this.toggleEditing} editing={editing} disabled={hasErrors} />
          <i onClick={this.addSkill} className="glyphicon glyphicon-plus" style={editing ? {} : invisible} />
        </div>
        {skls}
      </div>
    );
  }
}
