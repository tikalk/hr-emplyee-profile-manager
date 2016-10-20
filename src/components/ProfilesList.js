import React, { Component, PropTypes } from 'react';

export default class ProfilesList extends Component {

  format(text) {
    const selected = this.seatchVal ? this.seatchVal.value : null;
    if (!selected) {
      return text;
    }
    const startIndex = text.indexOf(selected);
    const endIndex = startIndex + selected.length;
    const section1 = text.substring(0, startIndex);
    const section2 = text.substring(startIndex, endIndex);
    const section3 = text.substring(endIndex, text.length);
    return (
      <span>{section1}
        <strong style={{ backgroundColor: 'yellow' }}>{section2}</strong>{section3}
      </span>
    );
  }

  render() {
    const { users, loadUser, filterProfiles, createUser } = this.props;

    return (
      <div className="profiles-list vertical layout">
        <div className="vertical layout" style={{ height: '100%' }}>
          <div className="searchWrapper">
            <input
              ref={(e) => {
                this.seatchVal = e;
              }}
              onChange={filterProfiles}
              placeholder="Search User"
            />
          </div>
          <ul className="flex">
            {(users || []).filter(u => !!u.user).map(user => (
              <li key={user.user} className={ user.isEx ? 'ex-employee' : 'active-employee'}>
                <a onClick={loadUser.bind(null, user)}>
                  {this.format(user.display)}
                </a>
              </li>))
            }
          </ul>
        </div>
        <div className="fixed-action-btn">
          <a
            className="btn-floating btn-large waves-effect waves-light red"
            onClick={createUser} title="Add new profile"
          >
            <i className="material-icons">person_add</i>
          </a>
        </div>
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

