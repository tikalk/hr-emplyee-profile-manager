import GitHub from 'github-api';
import { repoFix } from './githubApiFix';

const noEx = name => (name.endsWith('.ex') ? name.substring(0, name.length - 3) : name);

export default class GithubClient {
  constructor(token) {
    this.gh = new GitHub({ token: token.token });
    this.repo = this.gh.getRepo('tikalk', 'tikal_jekyll_website');
    repoFix(this.repo);
    // this.branch = 'master';
    this.branch = 'change-image-file';
    // this.branch = 'profile_editor_test';
    this.userPath = '_data/users';
    this.picturePath = '_assets/images';
  }

  getAuthenticated() {
    return this.gh.getUser().getProfile();
  }

  loadUsers() {
    const { userPath, branch } = this;
    return this.repo.getContents(branch, userPath, false)
      .then(({ data }) => {
        return data
          .filter(entry => entry.name.endsWith('.yml') && entry.type === 'file')
          .map((entry) => {
            const { name } = entry;
            const isEx = name.toLowerCase().endsWith('.ex.yml');
            const user = name.substr(0, name.length - 4);
            const display = user.toLowerCase().substr(0, user.length - (isEx ? 3 : 0));
            return { user, isEx, display };
          });
      });
  }

  loadUserProfile(userName) {
    const { userPath, branch } = this;
    return this.repo.getContents(branch, `${userPath}/${userName}.yml`, true).then(({ data }) => data);
  }

  saveUserProfile(oldUserName, userName, yaml, message) {
    const { userPath, branch } = this;
    const src = `${userPath}/${oldUserName}.yml`;
    const trg = `${userPath}/${userName}.yml`;
    const isNew = !oldUserName;
    const needRename = !isNew && oldUserName !== userName;
    // test for taget existence on new profile or real name change (not just ex<->active)
    const testExistence = isNew || (needRename && noEx(oldUserName) !== noEx(userName));

    const msg = message || `saved ${userName} profile; ${needRename ? `renamed from ${oldUserName}` : ''}`;

    return Promise.resolve()
      .then(() => {
        return !testExistence ? true :
          this.repo.getSha(branch, trg)
            .then(() => {
              // eslint-disable-next-line
              const confirmed = confirm(`Profile named "${userName}" already exists. Do you want to overwrite it?`);
              return confirmed ? true : Promise.reject('Rejected by user');
            }, () => Promise.resolve()); // file not exists - continue saving
      })
      .then(() => this.repo.writeFile(branch, trg, yaml, msg, {})) // write new
      .then(() => (needRename ? this.repo.deleteFile(branch, src) : true)); // delete old

    // rename if necessary and then write updated yaml
    // return (needRename ? this.repo.move(branch, src, trg) : Promise.resolve())
    //   .then(() => this.repo.writeFile(branch, trg, yaml, message, {}));
  }

  loadTemplate() {
    const { userPath, branch } = this;
    return this.repo.getContents(branch, `${userPath}/template.txt`, true).then(({ data }) => data);
  }

  static verifyImagePath(imagePath) {
    if (!imagePath.startsWith('pictures/')) {
      return Promise.reject('Wrong image name. Should begin with "pictures/..."');
    }
    return Promise.resolve();
  }

  // saveUserPicture(imagePath, blob64) {
  //   return GithubClient.verifyImagePath(imagePath)
  //     .then(() => {
  //       const { picturePath, branch } = this;
  //       return this.repo.writeFile(branch, `${picturePath}/${imagePath}`, blob64,
  //         'image updated', { encode: false });
  //     })
  //     .then(() => true);
  // }
  //
  // loadUserPicture(imagePath) {
  //   return GithubClient.verifyImagePath(imagePath)
  //     .then(() => {
  //       const { picturePath, branch } = this;
  //       return this.repo.getContents(branch, `${picturePath}/${imagePath}`, true);
  //     })
  //     .then(({ data: { content } }) => content);
  // }
  //
  // renameUserPicture(oldImagePath, newImagePath) {
  //   return GithubClient.verifyImagePath(newImagePath)
  //     .then(() => {
  //       const { picturePath, branch } = this;
  //       const src = `${picturePath}/${oldImagePath}`;
  //       const trg = `${picturePath}/${newImagePath}`;
  //       return this.repo.move(branch, src, trg,
  //         `image renamed from ${oldImagePath} to ${newImagePath}`);
  //     })
  //     .then(() => true);
  // }
}
