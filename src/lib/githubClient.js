import GitHub from 'github-api';
import https from 'https';
import urlTools from 'url';
import _ from 'lodash';

export default class GithubClient {
  constructor(token) {
    this.gh = new GitHub({ token });
    this.repo = this.gh.getRepo('tikalk', 'tikal_jekyll_website');
    // eslint-disable-next-line
    this.repo.__authorizationHeader = `Basic ${token}`;
    this.token = token;
    this.hostName = 'api.github.com';
    this.basePath = '/repos/tikalk/tikal_jekyll_website';
    this.branch = 'master';
    this.branch = 'profile_editor_test';
    this.userPath = '_data/users';
  }

  request(options_) {
    const options = { ...options_, withCredentials: false, hostname: this.hostName };
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
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

  move(branch, oldPath, newPath, cb) {
    let oldSha;
    return this.repo.getRef(`heads/${branch}`)
      .then(({ data: { object } }) => this.repo.getTree(`${object.sha}?recursive=true`))
      .then(({ data: { tree, sha } }) => {
        oldSha = sha;
        const newTree = tree.map((ref) => {
          const entry = { ...ref };
          delete entry.url;
          if (entry.path === oldPath) {
            entry.path = newPath;
          }
          // else if (entry.type === 'tree' && oldPath.startsWith(entry.path)) {
          //   console.log(entry);
          //   delete entry.sha;
          // }
          return entry;
        }).filter((ref) => ref.type !== 'tree' || !oldPath.startsWith(ref.path));
        // console.log(newTree.length, tree.length);
        return this.repo.createTree(newTree);
      })
      .then(({ data: tree }) => this.repo.commit(oldSha, tree.sha, `Renamed '${oldPath}' to '${newPath}'`))
      .then(({ data: commit }) => this.repo.updateHead(`heads/${branch}`, commit.sha, true, cb));
  }

  loadUsers() {
    const { userPath, branch } = this;
    return this.repo.getContents(branch, userPath, false).then(({ data }) => {
/*
      this.repo.getBlob(data[0].sha).then(({ data }) => {
        this.repo.writeFile(branch, `${userPath}/test2.txt`, 'blaz', 'test api', {}).then(x => {
          console.log(x);
        });
      });
*/
/*
      this.move(branch, `${userPath}/test2.ex.txt`, `${userPath}/test2.txt`).then((x) => {
        console.log(x);
        // this.repo.writeFile(branch, userPath+'/test2.ex.txt', 'bla ex', 'test api', {}).then(x=>{
        //   console.log(x);
        // });
      });
*/


      return data;
    });


    /*
     const { basePath, userPath, branch, token, hostName } = this;
     const options = {
     hostname: hostName,
     path: `${basePath}/contents/${userPath}?ref=${branch}`,
     method: 'GET',
     port: 443,
     headers: {
     'Content-Type': 'application/json',
     Authorization: `Basic ${token}`
     }
     };

     return this.request(options);
     */
  }

  loadUserYaml(url) {
    return new Promise((resolve, reject) => {
      const options = urlTools.parse(url);
      options.withCredentials = false;
      const req = https.get(options, (res) => {
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

  loadTemplate() {
    return this.loadUsers().then((users) => {
      const { download_url } = _.find(users, { name: 'template.txt' });
      return this.loadUserYaml(download_url);
    });
  }

  saveUserYaml(userName, yaml, message) {
    return this.saveBlob(`${this.userPath}/${userName}.yml`, yaml, message || `saving ${userName} profile`);
  }

  saveBlob(fullFileName, blob, message) {
    const { basePath, branch, token, hostName } = this;
    const options = {
      hostname: hostName,
      port: 443,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
        'User-Agent': 'Node'
      }
    };

    let SHA_LATEST_COMMIT;
    let SHA_BASE_TREE;
    let SHA_NEW_TREE;
    let SHA_NEW_COMMIT;

    options.path = `${basePath}/git/refs/heads/${branch}`;
    options.method = 'GET';
    return this.request(options)
      .then((res) => {
        SHA_LATEST_COMMIT = res.object.sha;
        options.path = `${basePath}/git/commits/${SHA_LATEST_COMMIT}`;
        options.method = 'GET';
        return this.request(options);
      })
      .then((res) => {
        SHA_BASE_TREE = res.tree.sha;
        options.path = `${basePath}/git/trees`;
        options.method = 'POST';
        options.body = JSON.stringify({
          base_tree: SHA_BASE_TREE,
          tree: [
            {
              mode: '100644',
              type: 'blob',
              encoding: 'utf-8',
              path: fullFileName,
              content: blob
            }
          ]
        });
        return this.request(options);
      })
      .then((res) => {
        SHA_NEW_TREE = res.sha;
        options.path = `${basePath}/git/commits`;
        options.method = 'POST';
        options.body = JSON.stringify({
          message: message || fullFileName,
          parents: [
            SHA_LATEST_COMMIT
          ],
          tree: SHA_NEW_TREE
        });
        return this.request(options);
      })
      .then((res) => {
        SHA_NEW_COMMIT = res.sha;
        options.path = `${basePath}/git/refs/heads/${branch}`;
        options.method = 'POST';
        options.body = JSON.stringify({
          sha: SHA_NEW_COMMIT,
          force: true
        });
        return this.request(options);
      })
      .then(() => true);
  }
}
