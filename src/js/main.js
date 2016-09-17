import React from 'react';
import ReactDOM from 'react-dom';
import '../css/app.css';
import App from '../components/App';

global.jQuery = require('jquery');
require('bootstrap');

const app = document.getElementById('app');
ReactDOM.render(<App />, app);
