import React, { PropTypes } from 'react';

export default function ProfilesList(props) {
  const { users, loadUser } = props;
  const exStyle = {
    color: 'gray'
  };

  return (
    <div className="profiles-list" style={{ maxHeight: '800px' }}>
      <ul>
        {(users || []).filter(u => !!u.user).map(user => (<li key={user.user}>
          <a
            onClick={loadUser.bind(null, user)}
            style={user.isEx ? exStyle : {}}
          >
            {user.display}
          </a></li>))
        }
      </ul>
    </div>
  );
}

ProfilesList.propTypes = {
  loadUser: PropTypes.func,
  users: PropTypes.array
};

