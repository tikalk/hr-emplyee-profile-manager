import React, { Component, PropTypes } from 'react';

export default class ProfilesList extends Component {

  format(text) {
    const selected = this.seatchVal.value;
    if (!selected) {
      return text;
    }
    const startIndex = text.indexOf(selected);
    const endIndex = startIndex + selected.length;
    const section1 = text.substring(0, startIndex);
    const section2 = text.substring(startIndex, endIndex);
    const section3 = text.substring(endIndex, text.length);
    return (
      <span>{section1}<strong style={{ backgroundColor: 'yellow' }}>{section2}</strong>{section3}</span>
    );
  }

  render() {
    const { users, loadUser, filterProfiles } = this.props;
    const exStyle = {
      color: 'gray'
    };

    return (
      <div className="profiles-list" style={{ maxHeight: '800px' }}>
        <div className="searchWrapper">
          <input
            ref={(e) => { this.seatchVal = e; }}
            onChange={filterProfiles}
            placeholder="Search User"
          />
        </div>

        <ul>
          <li><a className="btn" onClick={this.props.createUser}>New User <i className="material-icons">add</i></a></li>
          {(users || []).filter(u => !!u.user).map(user => (<li key={user.user}>
            <a
              onClick={loadUser.bind(null, user)}
              style={user.isEx ? exStyle : {}}
            >
              {this.format(user.display)}
            </a></li>))
          }
        </ul>
      </div>
    );
  }
}

ProfilesList.propTypes = {
  loadUser: PropTypes.func,
  filterProfiles: PropTypes.func,
  createUser: PropTypes.func,
  users: PropTypes.array
};

