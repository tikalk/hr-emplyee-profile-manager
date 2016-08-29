import {client} from 'github';
import https from 'https';

export default class GithubClient{
  constructor(token){
    this.token = token;
  }

  loadUsers(callback) {
    var options = {
      hostname: 'api.github.com',
      path: '/repos/tikalk/tikal_jekyll_website/contents/_data/users',
      method: 'GET',
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${this.token}`,
        'User-Agent': 'Node'
      }
    };

    var req = https.request(options, (res) => {
      res.setEncoding('utf8');
      const dataBuffer = []
      res.on('data', (chunk) => {
        dataBuffer.push(chunk);
      });
      res.on('end', () => {
        callback(null, JSON.parse(dataBuffer.join('')));
      });
    });
    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      callback(e);
    });

    // write data to request body
    req.end();
  }

  loadUserYaml(url, callback) {
    const req = https.get(url, (res) => {
      res.setEncoding('utf8');
      const dataBuffer = []
      res.on('data', (chunk) => {
        dataBuffer.push(chunk);
      });
      res.on('end', () => {
        callback(null, dataBuffer.join(''));
      });
    });
    req.on('error', (e) => {
      console.log(`problem with request: ${e.message}`);
      callback(e);
    });

  }
}