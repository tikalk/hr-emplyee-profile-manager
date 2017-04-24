import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import autobind from 'react-autobind';

const defaultState = {
  years: '',
  title: '',
  description: '',
  canSave: false
};

export default class NewExperience extends Component {
  constructor(props) {
    super(props);
    this.state = { ...defaultState };
    autobind(this);
  }

  onChange(field, value) {
    let canSave = true;
    if (!value) {
      canSave = false;
    } else {
      ['years', 'title', 'description'].forEach((key) => {
        if (key !== field && !this.state[key]) canSave = false;
      });
    }
    this.setState({ [field]: value, canSave });
  }

  updateYears(e) {
    this.onChange('years', e.target.value);
  }

  updateTitle(e) {
    this.onChange('title', e.target.value);
  }

  updateDesc(e) {
    this.onChange('description', e.target.value);
  }

  add() {
    const { onAdd } = this.props;
    const { canSave, years, title, description } = this.state;
    if (canSave) {
      onAdd({ years, title, description });
      this.setState({ ...defaultState });
    }
  }

  render() {
    const { canSave, years, title, description } = this.state;
    const linkClasses = classNames('material-icons', {
      'green-color': canSave,
      'grey-color': !canSave
    });
    return (
      <div className="input-field">
        <div className="row">
          <div className="col s1">
            <a onClick={this.add}><i className={linkClasses}>check</i></a>
          </div>
          <div className="col s11">
            <div className="row">
              <span className="col s2">Comapny / Years</span>
              <span className="col s10">
                <input className="form-control" value={years} onChange={this.updateYears} />
              </span>
            </div>
            <div className="row">
              <span className="col s2 col-md-offset-1">Title</span>
              <span className="col s10">
                <input className="form-control" value={title} onChange={this.updateTitle} />
              </span>
            </div>
            <div className="row">
              <span className="col s2 col-md-offset-1">Description</span>
              <span className="col s10">
                <textarea
                  className="materialize-textarea"
                  onChange={this.updateDesc}
                  value={description}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

NewExperience.propTypes = {
  onAdd: PropTypes.func.isRequired
};
