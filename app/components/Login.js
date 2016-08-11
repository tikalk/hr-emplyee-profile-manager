import React, { Component } from 'react';
import styles from './Home.css';

export default class Login extends Component {

  static propTypes = {
    setApiToken: React.PropTypes.func
  };

  updateApiToken() {
    this.props.setApiToken(this.refs.apiTokenInput.value);
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Github</h2>
          <h3>Set API Token</h3>
          <div className="form-inline">
            <div className="form-group">
              <input id="apiTokenInput" ref="apiTokenInput" className="form-control" placeholder="Github API Token"/>
            </div>
            <div className="btn btn-default" onClick={this.updateApiToken.bind(this)}>Save</div>
            <div>
              <a href="https://github.com/settings/tokens" target="_blank">get github API token</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
