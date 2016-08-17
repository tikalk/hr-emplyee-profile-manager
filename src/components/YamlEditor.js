import React, {Component} from 'react';

import fs from 'fs';

export default class App extends Component {
  constructor(props) {
    super(props);
    debugger;
    const yamlData = fs.readFileSync('adam.yaml', 'utf8');
  }


  render() {
    return (
      <div className="profile">
      
      </div>
    );
  }
}