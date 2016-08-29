import React, {Component} from 'react';
import autoBind from 'react-autobind';

export default class Skills extends Component{

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
      this.props.saveSkills(skills)
    }
    this.setState({ editing: !this.state.editing})
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
    if (!editing){
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
            <input type="number" maxLength="2" className="form-control" defaultValue={value} onChange={this.updateSkill.bind(this, key)}/>
          </span>
        </div>);
        return result;
      }, []);
    }

    return (
      <div className="container form-inline">
        {editing ?
          <div className="row"><i onClick={this.toggleEditing} className="glyphicon glyphicon-floppy-save" /></div>
          :
          <div className="row"><i onClick={this.toggleEditing} className="glyphicon glyphicon-edit" /></div>
        }
        {skls}
      </div>
    );
  }
}