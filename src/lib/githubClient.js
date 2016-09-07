import {client} from 'github';
import https from 'https';

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
        return new Promise((resolve, reject)=> {
            var req = https.request(options, (res) => {
                res.setEncoding('utf8');
                const dataBuffer = [];
                res.on('data', (chunk) => {
                    dataBuffer.push(chunk);
                });
                res.on('end', () => {
                    resolve(JSON.parse(dataBuffer.join('')));
                });
            });
            req.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
                reject(e);
            });
            // write data to request body
            req.end(options.body);
        });
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
            const dataBuffer = [];
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
            const dataBuffer = [];
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

    saveUserYaml(userName, yaml, message) {
        return this.saveBlob(`${this.userPath}/${userName}.yml`, yaml, message || `saving ${userName} profile`);
    }

    saveBlob(fullFileName, blob, message) {
        var basePath = this.basePath;
        var branch = this.branch;
        var options = {
            hostname: this.hostName,
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${this.token}`,
                'User-Agent': 'Node'
            }
        };

        var SHA_LATEST_COMMIT, SHA_BASE_TREE, SHA_NEW_TREE, SHA_NEW_COMMIT;
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
