import React, { Component, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';
import autoBind from 'react-autobind';

export default class ExperienceYaml extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    onRemove: PropTypes.func,
    editing: PropTypes.bool,
    years: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  updateYears(e) {
    this.props.onChange('years', e.target.value);
  }

  updateTitle(e) {
    this.props.onChange('title', e.target.value);
  }

  updateDesc(e) {
    this.props.onChange('description', e.target.value);
  }

  render() {
    const { title, description, years, editing, onRemove } = this.props;

    return (
      <div className="experience">
        <hr />
        <div className="row">
          {
            editing && <div className="col s1">
              <a>
                <i className="material-icons tiny" onClick={onRemove}>remove_circle_outline</i>
              </a>
            </div>
          }
          <div className={`col ${editing ? 's11' : 's12'}`}>
            <div className="row">
              <span className="col s2">Years</span>
              <span className="col s10">
                {editing ?
                  <input className="form-control" value={years} onChange={this.updateYears} />
                  :
                  <span>{years}</span>
                }
              </span>
            </div>
            <div className="row">
              <span className="col s2 col-md-offset-1">Title</span>
              <span className="col s10">
                {editing
                  ? <input className="form-control" value={title} onChange={this.updateTitle} />
                  : <span>{title}</span>
                }
              </span>
            </div>
            <div className="row">
              <span className="col s2 col-md-offset-1">Description</span>
              <span className="col s10">
                {editing ?
                  <textarea
                    className="materialize-textarea"
                    onChange={this.updateDesc}
                    value={description}
                  />
                  :
                  <span>
                    <ReactMarkdown softBreak="br" source={description} />
                  </span>
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
