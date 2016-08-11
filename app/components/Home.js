import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import styles from './Home.css';


export default class Home extends Component {
  static propTypes = {
    githubCredentials: React.PropTypes.object
  };

  componentWillMount() {
    const githubCredentials = this.props;
    if (!githubCredentials.APIKEY || !(githubCredentials.username && githubCredentials.password)) {
      browserHistory.push('/login');
    }
  }

  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Home</h2>
          <Link to="/counter">to Counter</Link><br />
          <Link to="/login">to Login</Link>
        </div>
      </div>
    );
  }
}
