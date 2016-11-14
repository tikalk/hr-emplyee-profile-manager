function repoMove(branch, oldPath, newPath, cb) {
  let oldSha;
  return this.getRef(`heads/${branch}`)
    .then(({ data: { object } }) => this.getTree(`${object.sha}?recursive=true`))
    .then(({ data: { tree, sha } }) => {
      oldSha = sha;
      const newTree = tree.map((ref) => {
        const entry = { ...ref };
        delete entry.url;
        if (entry.type === 'tree' && oldPath.startsWith(entry.path)) {
          delete entry.sha;
        } else if (entry.path === oldPath) {
          entry.path = newPath;
        }
        return entry;
      }).filter(ref => ref.type !== 'tree' || !oldPath.startsWith(ref.path));
      return this.createTree(newTree);
    })
    .then(({ data: tree }) => this.commit(oldSha, tree.sha, `Renamed '${oldPath}' to '${newPath}'`))
    .then(({ data: commit }) => this.updateHead(`heads/${branch}`, commit.sha, true, cb));
}

// eslint-disable-next-line
export function repoFix(repo) {
  // eslint-disable-next-line
  repo.move = repoMove;
}

