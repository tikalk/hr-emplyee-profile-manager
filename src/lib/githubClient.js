// import {client} from 'github';
import https from 'https';
import urlTools from 'url';

export default class GithubClient {
  constructor(token) {
    this.token = token;
    this.hostName = 'api.github.com';
    this.basePath = '/repos/tikalk/tikal_jekyll_website';
    this.branch = 'master';
    this.branch = 'profile_editor_test';
    this.userPath = '_data/users';
  }

  request(options) {
    options.withCredentials = false;
    return new Promise((resolve, reject)=> {
      const req = https.request(options, (res) => {
//        res.setEncoding('utf8');
        const dataBuffer = [];
        res.on('data', (chunk) => {
          dataBuffer.push(chunk);
        });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode > 299) {
            console.log('XHR failed:', res.statusMessage);
            reject(res.statusMessage);
            return;
          }
          resolve(JSON.parse(dataBuffer.join('')));
        });
      });
      req.on('error', (e) => {
        console.log('XHR failed:', e.message);
        reject(e.message);
      });
      // if(options.withCredentials !== undefined) req.xhr.withCredentials = options.withCredentials;
      // write data to request body
      req.end(options.body);
    });
  }

  loadUsers() {
    const {basePath, userPath, branch, token, hostName} = this;
    const options = {
      hostname: hostName,
      path: `${basePath}/contents/${userPath}?ref=${branch}`,
      method: 'GET',
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
        // 'User-Agent': 'Node'
      }
    };

    return this.request(options);
  }

  loadUserYaml(url) {
    return new Promise((resolve, reject)=> {
      const options = urlTools.parse(url);
      options.withCredentials = false;
      const req = https.get(options, (res) => {
//        res.setEncoding('utf8');
        const dataBuffer = [];
        res.on('data', (chunk) => {
          dataBuffer.push(chunk);
        });
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode > 299) {
            console.log('XHR failed:', res.statusMessage);
            reject(res.statusMessage);
            return;
          }
          resolve(dataBuffer.join(''));
        });
      });
      req.on('error', (e) => {
        console.log('XHR failed:', e.message);
        reject(e.message);
      });
    });
  }

  loadTemplate(){
    return this.loadUsers().then((users)=>{
      const {download_url} = _.find(users, {name:'template.txt'});
      return this.loadUserYaml(download_url);
    });
  }

  saveUserYaml(userName, yaml, message) {
    return this.saveBlob(`${this.userPath}/${userName}.yml`, yaml, message || `saving ${userName} profile`);
  }

  saveBlob(fullFileName, blob, message) {
    const {basePath, branch, token, hostName} = this;
    const options = {
      hostname: hostName,
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`,
        'User-Agent': 'Node'
      }
    };

    let SHA_LATEST_COMMIT, SHA_BASE_TREE, SHA_NEW_TREE, SHA_NEW_COMMIT;

    options.path = `${basePath}/git/refs/heads/${branch}`;
    options.method = 'GET';
    return this.request(options)
      .then((res)=> {
        SHA_LATEST_COMMIT = res.object.sha;
        options.path = `${basePath}/git/commits/${SHA_LATEST_COMMIT}`;
        options.method = 'GET';
        return this.request(options);
      })
      .then((res)=> {
        SHA_BASE_TREE = res.tree.sha;
        options.path = `${basePath}/git/trees`;
        options.method = 'POST';
        options.body = JSON.stringify({
          base_tree: SHA_BASE_TREE,
          tree: [
            {
              mode: "100644",
              type: "blob",
              encoding: "utf-8",
              path: fullFileName,
              content: blob
            }
          ]
        });
        return this.request(options);
      })
      .then((res)=> {
        SHA_NEW_TREE = res.sha;
        options.path = `${basePath}/git/commits`;
        options.method = 'POST';
        options.body = JSON.stringify({
          "message": message || fullFileName,
          "parents": [
            SHA_LATEST_COMMIT
          ],
          "tree": SHA_NEW_TREE
        });
        return this.request(options);
      })
      .then((res)=> {
        SHA_NEW_COMMIT = res.sha;
        options.path = `${basePath}/git/refs/heads/${branch}`;
        options.method = 'POST';
        options.body = JSON.stringify({
          "sha": SHA_NEW_COMMIT,
          "force": true
        });
        return this.request(options);
      })
      .then((res)=> {
        return true;
      });
  }
}
