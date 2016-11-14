import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'react-autobind';

export default class NewSkill extends Component {

  constructor(props) {
    super(props);
    this.state = { value: '', canSave: false };
    autobind(this);
  }
  onChange(e) {
    const { skills } = this.props;
    const value = e.target.value;
    let canSave = true;
    if (!value) {
      canSave = false;
    } else if (skills.map(s => s.toLowerCase()).includes(value.toLowerCase())) {
      canSave = false;
    }
    this.setState({ value, canSave });
  }

  add() {
    const { onAdd } = this.props;
    const { canSave, value } = this.state;
    if (canSave) {
      onAdd(value);
    }
    this.setState({ value: '', canSave: false });
  }

  render() {
    const { canSave, value } = this.state;
    const linkClasses = classNames('material-icons', { 'green-color': canSave, 'grey-color': !canSave });
    return (
      <div className="input-field">
        <input onChange={this.onChange} value={value} style={{ width: '60%' }} />
        <a onClick={this.add}><i className={linkClasses}>check</i></a>
      </div>
    );
  }
}

NewSkill.propTypes = {
  skills: PropTypes.array,
  onAdd: PropTypes.func
};
