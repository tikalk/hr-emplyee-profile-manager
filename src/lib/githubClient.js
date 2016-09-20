import GitHub from 'github-api';
import https from 'https';
import urlTools from 'url';

export default class GithubClient {
  constructor(token) {
    this.gh = new GitHub({ token });
    this.repo = this.gh.getRepo('tikalk', 'tikal_jekyll_website');
    // eslint-disable-next-line
    this.repo.__authorizationHeader = `Basic ${token}`;
    // eslint-disable-next-line
    this.repo.move = repoMove;
    this.token = token;
    this.hostName = 'api.github.com';
    this.basePath = '/repos/tikalk/tikal_jekyll_website';
    this.branch = 'master';
    this.branch = 'profile_editor_test';
    this.userPath = '_data/users';
    this.picturePath = '_assets/images';
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

  loadUsers() {
    const { userPath, branch } = this;
    return this.repo.getContents(branch, userPath, false)
      .then(({ data }) => {
        return data
          .filter((entry) => entry.name.endsWith('.yml') && entry.type === 'file')
          .map((entry) => {
            const { name, download_url } = entry;
            const isEx = name.toLowerCase().endsWith('.ex.yml');
            const user = name.substr(0, name.length - 4);
            const display = user.toLowerCase().substr(0, user.length - (isEx ? 3 : 0));
            return ({ download_url, user, isEx, display });
          })
          .sort((a, b) => {
            if (a.isEx !== b.isEx) {
              return a.isEx ? 1 : -1;
            }
            const ai = a.user.toLowerCase();
            const bi = b.user.toLowerCase();
            if (ai > bi) {
              return 1;
            }
            if (ai < bi) {
              return -1;
            }
            return 0;
          });
      });
  }

  loadUser(userName) {
    const { userPath, branch } = this;
    return this.repo.getContents(branch, `${userPath}/${userName}.yml`, true).then(({ data }) => data);
  }

  saveUser(oldUserName, userName, yaml, message = `saved ${userName} profile`) {
    const { userPath, branch } = this;
    const src = `${userPath}/${oldUserName}`;
    const trg = `${userPath}/${userName}`;
    const needRename = oldUserName && oldUserName !== userName;
    // rename if necessary and then write updated yaml
    return (needRename ? this.repo.move(branch, src, trg) : Promise.resolve())
      .then(() => this.repo.writeFile(branch, trg, yaml, message, {}));
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
            console.error('XHR failed:', res.statusMessage);
            reject(res.statusMessage);
            return;
          }
          resolve(dataBuffer.join(''));
        });
      });
      req.on('error', (e) => {
        console.error('XHR failed:', e.message);
        reject(e.message);
      });
    });
  }

  loadTemplate() {
    const { userPath, branch } = this;
    return this.repo.getContents(branch, `${userPath}/template.txt`, true).then(({ data }) => data);
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

  static verifyImagePath(imagePath) {
    if (!imagePath.startsWith('pictures/')) {
      return Promise.reject('Wrong image name. Should begin with "pictures/..."');
    }
    return Promise.resolve();
  }

  saveUserPicture(imagePath, blob64) {
    return GithubClient.verifyImagePath(imagePath)
      .then(() => {
        const { picturePath, branch } = this;
        return this.repo.writeFile(branch, `${picturePath}/${imagePath}`, blob64,
          'image updated', { encode: false });
      })
      .then(() => true);
  }

  loadUserPicture(imagePath) {
    return GithubClient.verifyImagePath(imagePath)
      .then(() => {
        const { picturePath, branch } = this;
        return this.repo.getContents(branch, `${picturePath}/${imagePath}`, true);
      })
      .then(({ data: { content } }) => content);
  }

  renameUserPicture(oldImagePath, newImagePath) {
    return GithubClient.verifyImagePath(newImagePath)
      .then(() => {
        const { picturePath, branch } = this;
        const src = `${picturePath}/${oldImagePath}`;
        const trg = `${picturePath}/${newImagePath}`;
        return this.repo.move(branch, src, trg,
          `image renamed from ${oldImagePath} to ${newImagePath}`);
      })
      .then(() => true);
  }
}

function repoMove(branch, oldPath, newPath, cb) {
  let oldSha;
  return this.getRef(`heads/${branch}`)
    .then(({ data: { object } }) => this.getTree(`${object.sha}?recursive=true`))
    .then(({ data: { tree, sha } }) => {
      oldSha = sha;
      const newTree = tree.map((ref) => {
        const entry = { ...ref };
        delete entry.url;
        if (entry.path === oldPath) {
          entry.path = newPath;
        }
        return entry;
      }).filter((ref) => ref.type !== 'tree' || !oldPath.startsWith(ref.path));
      return this.createTree(newTree);
    })
    .then(({ data: tree }) => this.commit(oldSha, tree.sha, `Renamed '${oldPath}' to '${newPath}'`))
    .then(({ data: commit }) => this.updateHead(`heads/${branch}`, commit.sha, true, cb));
}
