import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';
import classNames from 'classnames';
import _ from 'lodash';

export default class Skills extends Component {

  static propTypes = {
    skills: PropTypes.object,
    onChange: PropTypes.func,
    editing: PropTypes.bool
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  updateSkill(key, evt) {
    const { onChange } = this.props;
    onChange(key, evt.target.value)
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
          <span className="col s6">{key}:</span>
          <span className="col s6">
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
      <div className="form-inline">
        {skls}
      </div>
    );
  }
}
