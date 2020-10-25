const { writeFileSync, readFileSync } = require('fs')
const { resolve } = require('path')

module.exports = ({ github, context }) => {
  // const event = require('/github/workflow/event.json')

  // https://docs.github.com/en/free-pro-team@latest/rest/reference/repos#get-a-repository

  const {
    GITHUB_WORKSPACE,
    GITHUB_ACTOR,
    GITHUB_REPOSITORY,
    GITHUB_REPOSITORY_OWNER
  } = process.env

  const { pusher, repository, owner } = context.payload

  const packageFile = resolve(GITHUB_WORKSPACE, 'package.json')
  const packageLockFile = resolve(GITHUB_WORKSPACE, 'package-lock.json')
  const package = require(packageFile)
  const packageLock = require(packageLockFile)

  /**
   * package.json
   */

  package.name = repository.name
  package.description = repository.description || ''
  package.repository = `git@github.com:${repository.full_name}.git`
  package.author = `${pusher.name} <${pusher.email}>`
  writeFileSync(packageFile, JSON.stringify(package, undefined, 2), { encoding: 'utf8' })

  /**
   * package-lock.json
   */

  packageLock.name = repository.name
  writeFileSync(packageLockFile, JSON.stringify(packageLock, undefined, 2), {
    encoding: 'utf8',
  })

  /**
   * README.md
   */
  const readmeFile = resolve(GITHUB_WORKSPACE, 'README.md')
  const readme = readFileSync(readmeFile, { encoding: 'utf8' })
  const newReadme = readme.split('.seed-ts').join(repository.name)

  writeFileSync(readmeFile, newReadme, { encoding: 'utf8' })
}
