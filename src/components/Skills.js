import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import _ from 'lodash';

export default class Skills extends Component {

  static propTypes = {
    skills: PropTypes.object,
    saveSkills: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      skills: props.skills
    };
    autoBind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      skills: props.skills
    });
  }

  toggleEditing() {
    const { editing, skills } = this.state;
    if (editing) {
      this.props.saveSkills(skills);
    }
    this.setState({ editing: !this.state.editing });
  }

  updateSkill(key, evt) {
    const { skills } = this.state;
    skills[key] = evt.target.value;
    this.setState({ skills });
  }

  render() {
    const { editing } = this.state;
    const { skills } = this.props;
    let skls;
    const btnClasses = classNames('glyphicon', {
      'glyphicon-floppy-save': editing,
      'glyphicon-edit': !editing
    });
    if (!editing) {
      skls = _.reduce(skills, (result, value, key) => {
        result.push(<div key={key} className="row">
          <span className="col-md-2">{key}:</span>
          <span className="col-md-9">{value}</span>
        </div>);
        return result;
      }, []);
    } else {
      skls = _.reduce(skills, (result, value, key) => {
        result.push(<div key={key} className="row">
          <span className="col-md-2">{key}:</span>
          <span className="col-md-9">
            <input
              type="number"
              maxLength="2"
              className="form-control"
              defaultValue={value}
              onChange={this.updateSkill.bind(this, key)}
            />
          </span>
        </div>);
        return result;
      }, []);
    }

    return (
      <div className="container form-inline">
        <div className="row" >
          <div className={btnClasses} onClick={this.toggleEditing} />
        </div>
        {skls}
      </div>
    );
  }
}
