import React, {Component} from 'react';

export default class Skills extends Component{


  render() {
    const {skill, value} = this.props;
    return (
        <div className="innerRow innerProp">
            <span className="title innerProp">{skill}:</span>
            <span className="desc">{value}</span>
          </div>
    );
  }
}