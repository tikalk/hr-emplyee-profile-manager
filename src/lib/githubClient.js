import {client} from 'github';

export default class GithubClient{
  constructor(token){
    this.token = token;
  }
}