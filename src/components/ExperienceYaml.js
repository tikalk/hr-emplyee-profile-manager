import React, { Component, PropTypes } from 'react';
import ReactMarkdown from 'react-markdown';
import autoBind from 'react-autobind';
import EditToggle from './EditToggle';

export default class ExperienceYaml extends Component {

  static propTypes = {
    onChange: PropTypes.func,
    editing: PropTypes.bool,
    years: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      years: props.years,
      title: props.title,
      description: props.description
    });
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
    const { title, description, years, editing } = this.props;

    return (
      <div className="experience">
        <div className="row">
          <span className="col s2">years</span>
          <span className="col s10">
            {editing ?
              <input className="form-control" defaultValue={years} onChange={this.updateYears} />
              :
              <span>{years}</span>
            }
          </span>
        </div>
        <div className="row">
          <span className="col s2 col-md-offset-1">title</span>
          <span className="col s10">
          {editing ?
            <input className="form-control" defaultValue={title} onChange={this.updateTitle} />
            :
            <span>{title}</span>
          }
          </span>
        </div>
        <div className="row">
          <span className="col s2 col-md-offset-1">description</span>
          <span className="col s10">
            {editing ?
              <textarea
                className="materialize-textarea"
                onChange={this.updateDesc}
                defaultValue={description}
              />
              :
              <span>
                <ReactMarkdown softBreak="br" source={description} />
              </span>
            }
          </span>
        </div>
        <hr />
      </div>
    );
  }
}
