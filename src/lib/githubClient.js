import GitHub from 'github-api';
import { repoFix } from './githubApiFix';

export default class GithubClient {
  constructor(token) {
    this.gh = new GitHub({ token: token.token });
    this.repo = this.gh.getRepo('tikalk', 'tikal_jekyll_website');
    repoFix(this.repo);
    // this.branch = 'master';
    this.branch = 'change-image-file';
    // this.branch = 'profile_editor_test';
    this.userPath = '_data/users';
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

  saveUserProfile(oldUserName, userName, yaml, message = `saved ${userName} profile`) {
    const { userPath, branch } = this;
    const src = `${userPath}/${oldUserName}.yml`;
    const trg = `${userPath}/${userName}.yml`;
    const needRename = oldUserName && oldUserName !== userName;
    // rename if necessary and then write updated yaml
    return (needRename ? this.repo.move(branch, src, trg) : Promise.resolve())
      .then(() => this.repo.writeFile(branch, trg, yaml, message, {}));
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
