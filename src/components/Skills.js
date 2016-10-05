import React, {Component, PropTypes} from 'react';
import autoBind from 'react-autobind';
import _ from 'lodash';
import EditToggle from './EditToggle';

let uidGen = 1;

const errStyle = {
  outline: '1px solid red'
};

export default class Skills extends Component {

  static propTypes = {
    skills: PropTypes.object,
    saveSkills: PropTypes.func,
    editingChanged: PropTypes.func
  };


  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      skills: this.toInnerSkills(props.skills)
    };
    autoBind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      skills: this.toInnerSkills(props.skills)
    });
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
    // return _.toPairs(skills);
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
      acc[skill.name] = skill.value;
      return acc;
    }, {});
  }

  /*
   updateSkill(key, evt) {
   const { skills } = this.state;
   skills[key] = evt.target.value;
   this.setState({ skills });
   }
   */

  updateSkillName(uid, e) {
    const { skills } = this.state;
    _.find(skills, { uid }).name = e.target.value;
    this.updateSkillNameErrors(skills);
  }

  updateSkillNameErrors(initialSkills) {
    let hasErrors = false;
    const map = {};
    const skills = _.map(initialSkills, (skill) => {
      const { name } = skill;
      const res = { ...skill };
      delete res.errorN;
      if (!name) {
        hasErrors = true;
        res.errorN = 'Empty Name';
      } else if (map[name]) {
        hasErrors = true;
        map[name].errorN = res.errorN = 'Duplicated Name';
      } else {
        map[name] = res;
      }
      return res;
    });
    this.setState({ skills, hasErrors });
  }

  deleteSkill(uid) {
    const { skills } = this.state;
    this.updateSkillNameErrors(_.filter(skills, (skill) => skill.uid !== uid));
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
      skls = _.map(skills, (skill) => {
        const { name, value, uid, errorN, errorV } = skill;
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
              skill[1] = e.target.value;
            }}
          />
        </div>);
      }, []);
    }

    return (
      <div className="container form-inline">
        <div className="row">
          <EditToggle onToggleEditing={this.toggleEditing} editing={editing} disabled={hasErrors}/>
        </div>
        {skls}
      </div>
    );
  }
}
