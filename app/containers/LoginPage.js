import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Login from '../components/Login';
import * as LoginActions from '../actions/loginpage';

class LoginPage extends Component {
  render() {
    return (
      <Login />
    );
  }
}


function mapStateToProps(state) {
  return {
    githubCredentials: state.github
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
