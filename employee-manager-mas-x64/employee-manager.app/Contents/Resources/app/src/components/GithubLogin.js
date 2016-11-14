import React from 'react';

export default class GithubLogin extends React.Component {
  static propTypes = {
    setApiTokens: React.PropTypes.func.isRequired
  };

  updateApiTokens() {
    this.props.setApiTokens({
      user: this.username.value,
      token: this.apiTokenInput.value,
      cloudinaryAPIKey: this.cloudinaryAPIKey.value,
      cloudinarySecret: this.cloudinarySecret.value
    });
  }

  render() {
    return (
      <div className="container">
        <h2>API Tokens Setup</h2>
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
          <div className="form-group">
            <input
              id="cloudinaryAPIKey"
              ref={(c) => { this.cloudinaryAPIKey = c; }}
              className="form-control"
              placeholder="Cloudinary API Token"
            />
          </div>
          <div className="form-group">
            <input
              id="cloudinarySecret"
              ref={(c) => { this.cloudinarySecret = c; }}
              className="form-control"
              placeholder="Cloudinary Secret"
            />
          </div>
          <div className="btn btn-default" onClick={this.updateApiTokens.bind(this)}>Save</div>
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
