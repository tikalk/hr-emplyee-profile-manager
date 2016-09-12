import React, {Component} from 'react';
import autoBind from 'react-autobind';

export default class ProfilesList extends Component {
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
        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Choose Profile <span className="caret"></span>
        </button>
        <ul className="dropdown-menu">
          {(users || []).map((user, i) => {
              return (<li key={i}><a href="#" onClick={this.handleLoadUser.bind(this, user.download_url)}>{user.name}</a></li>);
            })
          }
        </ul>
      </div>
    );
  }
}
