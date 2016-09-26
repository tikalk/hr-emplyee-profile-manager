import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import _ from 'lodash';
import EditToggle from './EditToggle';

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
      skills: _.toPairs(props.skills)
    };
    autoBind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      skills: _.toPairs(props.skills)
    });
  }

  toggleEditing() {
    const { editing, skills } = this.state;
    if (editing) {
      this.props.saveSkills(_.fromPairs(skills));
    }
    this.props.editingChanged(!this.state.editing);
    this.setState({ editing: !this.state.editing });
  }

  updateSkill(key, evt) {
    const { skills } = this.state;
    skills[key] = evt.target.value;
    this.setState({ skills });
  }

  render() {
    const { editing, skills } = this.state;
    let skls;
    if (!editing) {
      skls = _.map(skills, (skill) => {
        const [key, value] = skill;
        return (<div key={key} className="row">
          <span className="col-md-2">{key}:</span>
          <span className="col-md-9">{value}</span>
        </div>);
      }, []);
    } else {
      skls = _.map(skills, (skill) => {
        const [name, value] = skill;
        return (<div key={name} className="row">
          <i onClick={() => {}} className="glyphicon glyphicon-remove " />
          <input
            type="text"
            className="form-control"
            defaultValue={name}
            onChange={(e) => { skill[0] = e.target.value; }}
          />
          <input
            type="number"
            maxLength="2"
            className="form-control"
            defaultValue={value}
            onChange={(e) => { skill[1] = e.target.value; }}
          />
        </div>);
      }, []);
    }

    return (
      <div className="container form-inline">
        <div className="row">
          <EditToggle onToggleEditing={this.toggleEditing} editing={editing} />
        </div>
        {skls}
      </div>
    );
  }
}
