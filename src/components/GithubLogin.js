import React from 'react';

export default class GithubLogin extends React.Component {
  static propTypes = {
    setApiToken: React.PropTypes.func.isRequired
  };

  updateApiToken() {
    this.props.setApiToken({
      user: this.username.value,
      token: this.apiTokenInput.value
    });
  }

  render() {
    return (
      <div>
        <h2>Github</h2>
        <h3>Set API Token</h3>
        <div className="form-inline">
          <div className="form-group">
            <input
              id="apiTokenInput"
              ref={(c) => { this.apiTokenInput = c; }}
              className="form-control"
              placeholder="Github API Token"
            />
          </div>
          <div className="form-group">
            <input
              id="username"
              ref={(c) => { this.username = c; }}
              className="form-control"
              placeholder="Git UserName"
            />
          </div>
          <div className="btn btn-default" onClick={this.updateApiToken.bind(this)}>Save</div>
          <div>
            <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
              get github API token
            </a>
          </div>
        </div>
      </div>
    );
  }
}
