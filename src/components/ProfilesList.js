import React, { PropTypes } from 'react';

export default function ProfilesList(props) {
  const { users, loadUser } = props;
  const exStyle = {
    color: 'gray'
  };
  return (
    <div className="btn-group">
      <button
        type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false"
      >
        Choose Profile <span className="caret" />
      </button>
      <ul className="dropdown-menu">
        {(users || []).map((user) => (<li key={user.user}>
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

