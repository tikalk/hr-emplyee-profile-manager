import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import _ from 'lodash';

export default class Skills extends Component {

  static propTypes = {
    skills: PropTypes.object,
    onChange: PropTypes.func,
    onSkillRemove: PropTypes.func,
    editing: PropTypes.bool
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  updateSkill(key, evt) {
    const { onChange } = this.props;
    onChange(key, evt.target.value);
  }

  removeSkill(key) {
    const { onSkillRemove } = this.props;
    onSkillRemove(key);
  }

  render() {
    const { skills, editing } = this.props;
    let skls;
    if (!editing) {
      skls = _.reduce(skills, (result, value, key) => {
        result.push(<div key={key} className="row">
          <span className="col s6">{key}:</span>
          <span className="col s6">{value}</span>
        </div>);
        return result;
      }, []);
    } else {
      skls = _.reduce(skills, (result, value, key) => {
        result.push(<div key={key} className="row">
          <div className="col s1">
            <a>
              <i className="material-icons tiny" onClick={this.removeSkill.bind(this, key)}>remove_circle_outline</i>
            </a>
          </div>
          <div className="col s5">{key}</div>
          <div className="col s2">
            <input
              id={`input-${key}`}
              type="number"
              maxLength="2"
              defaultValue={value}
              onChange={this.updateSkill.bind(this, key)}
            />
          </div>
        </div>);
        return result;
      }, []);
    }

    return (
      <div className="form-inline skills">
        {skls}
      </div>
    );
  }
}
