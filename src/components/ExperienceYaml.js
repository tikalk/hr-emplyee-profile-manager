import React, {Component} from 'react';

export default class ExperienceYaml extends Component{


  render() {
    const {title, description, years} = this.props;
    return (
      <div className="experience">
          {(title) ? 
          <div className="profileRow">
            <span className="title innerProp">title</span>
            <span className="desc">{title}</span>
          </div>
          : <div>&nbsp;</div>}
          {(description) ?
          <div className="profileRow">
            <span className="title innerProp">description</span>
            <span className="desc">{description}</span>
          </div>
          : <div>&nbsp;</div>}
          {(years) ?
          <div className="profileRow">
            <span className="title innerProp">years</span>
            <span className="desc">{years}</span>
          </div>
          : <div>&nbsp;</div>}
          <hr/>
      </div>
    );
  }
}