import React, { Component, PropTypes } from 'react';
import autoBind from 'react-autobind';

export default class ProfilesList extends Component {

  static propTypes = {
    loadUser: PropTypes.func,
    users: PropTypes.array
  };

  constructor(props) {
    super(props);
    autoBind(this);
  }

  handleLoadUser(url) {
    this.props.loadUser(url);
  }

  render() {
    const { users } = this.props;
    return (
      <div className="btn-group">
        <button
          type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false"
        >
          Choose Profile <span className="caret" />
        </button>
        <ul className="dropdown-menu">
          {(users || []).map((user, i) => (<li key={i}>
            <a onClick={this.handleLoadUser.bind(this, user.download_url)}>{user.name}</a></li>))
          }
        </ul>
      </div>
    );
  }
}
