import React, {Component} from 'react';
import ReactMarkdown from 'react-markdown';
import autoBind from 'react-autobind';

export default class ExperienceYaml extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      years: props.years,
      title: props.title,
      description: props.description
    };
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
    this.setState({years: e.target.value});
  }

  updateTitle(e) {
    this.setState({title: e.target.value});
  }

  updateDesc(e) {
    this.setState({description: e.target.value});
  }

  toggleEditing() {
    if(this.state.editing) {
      const { title, description, years } = this.state;
      this.props.onSave( {
        title, description, years
      });
    }
    this.props.editingChanged(!this.state.editing);
    this.setState({ editing: !this.state.editing });
  }


  render() {
    const { title, description, years } = this.props;
    const { editing } = this.state;

    return (
      <div className="experience container">
          <div className="row">
            {editing ?
              <span className="col-md-1"><i onClick={this.toggleEditing} className="glyphicon glyphicon-floppy-save" /></span>
              :
              <span className="col-md-1"><i onClick={this.toggleEditing} className="glyphicon glyphicon-edit" /></span>
            }
            <span className="col-md-2">years</span>
            <span className="col-md-9">
              {editing ?
                <input className="form-control" defaultValue={years} onChange={this.updateYears}/>
                :
                <span>{years}</span>
              }
            </span>
          </div>
          <div className="row">
            <span className="col-md-2 col-md-offset-1">title</span>
            <span className="col-md-9">
            {editing ?
              <input className="form-control" defaultValue={title} onChange={this.updateTitle}/>
              :
              <span>{title}</span>
            }
            </span>
          </div>
          <div className="row">
            <span className="col-md-2 col-md-offset-1">description</span>
            <span className="col-md-9">
              {editing ?
                <textarea className="form-control description-textarea" onChange={this.updateDesc} defaultValue={description} />
                :
                <span>
                  <ReactMarkdown softBreak="br" source={description} />
                </span>
              }
            </span>
          </div>
        <hr/>
      </div>
    );
  }
}