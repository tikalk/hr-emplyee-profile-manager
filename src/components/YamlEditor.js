import React, {Component} from 'react';


import fs from 'fs';
import yaml from 'js-yaml';
import _ from 'lodash';
import ExperienceYaml from './ExperienceYaml';
import Skills from './Skills';


export default class YamlEditor extends Component {
  constructor(props) {
    super(props);
    const yamlData = yaml.safeLoad(fs.readFileSync(this.props.fileName +  '.yaml', 'utf8'));
    console.log(yamlData);

     this.state = {
      yamlData: yamlData
    }
  }


  render() {
    const followMe = this.state.yamlData.follow_me_urls.map((url) =>{
      return (
        <div key={url}>
          {url}
        </div>
      );
    });



    const experiences = this.state.yamlData.experience.map((exp) =>{
      return(
          <ExperienceYaml {...exp}/> 
      );

    });
    const devSkills = _.reduce(this.state.yamlData.skills.developer_skills, function(result, value, key){
        const skillObj = {skill: key, value: value};
        result.push(<Skills {...skillObj}/>);
        return result;
         
    },[]);

    const expertSkills = _.reduce(this.state.yamlData.skills.expert_skills, function(result, value, key){
        const skillObj = {skill: key, value: value};
        result.push(<Skills {...skillObj}/>);
        return result;c
         
    },[]);


    return (
      <div className="profile">
        <img className="tikal-logo" src="../src/css/pictures/tikal-logo.png"/>
        <div className="titleName">{this.state.yamlData.first_name} {this.state.yamlData.last_name}</div>
        <div className="descName">{this.state.yamlData.description}</div>
        <div className="profileRow">
          <span className="title">ID: </span>
          <span className="desc">{this.state.yamlData.id}</span>
        </div>
        <div className="profileRow">
          <span className="title">About:</span>
          <span className="desc">{this.state.yamlData.about}</span>
        </div>
        <div className="profileRow">
          <span className="title">Login:</span>
          <span className="desc">{this.state.yamlData.login}</span>
        </div>
        <div className="profileRow">
          <span className="title">Follow Me:</span>
          <span className="desc">{followMe}</span>
        </div>
        <div className="profileRow">
          <span className="title">Experience:</span>
          <div>{experiences}</div>
        </div> 

         <div className="profileRow">
          <span className="title">skills:</span>
          <br/>
          <span className="title innerProp">developer skills:</span>
          <div>{devSkills}</div>
          
          <span className="title innerProp">expert skills:</span>
          <div>{expertSkills}</div>
          
        </div>          
      </div>
    );
  }
}