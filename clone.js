const yargs = require('yargs')
const request = require('request')
const nodegit = require('nodegit')
const shell = require('shelljs')

const argv = yargs.argv
yargs.array('skip')
yargs.boolean('mirror')

const skippedRepos = argv.skip || []
const isMirror = argv.mirror || false
const username = encodeURIComponent(argv.username)
const password = encodeURIComponent(argv.password)

let repos = []
let opts = {
  fetchOpts: {
    callbacks: {
      credentials: function () {
        return nodegit.Cred.userpassPlaintextNew(username, password)
      },
      certificateCheck: function () {
        return 1
      },
    },
  },
}

function processCloneRepository(index) {
  if (repos.length - 1 === index) {
    console.log('All repositories cloned.')
  } else {
    cloneRepository(index + 1)
  }
}

function cloneRepository(index) {
  let repo = repos[index]
  if (!isMirror) {
    console.log(`Cloning ${repo.full_name} ..`)
    nodegit
      .Clone(repo.links.clone[0].href, 'repositories/' + repo.full_name, opts)
      .then(function () {
        processCloneRepository(index)
      })
      .catch(function (err) {
        if (err) {
          console.log(err)
        }
        if (err.errno === -4) {
          console.warn('Skipping existing repository.')
          processCloneRepository(index)
        }
      })
  } else {
    shell.exec(
      `git clone --mirror https://${username}:${password}@bitbucket.org/${repo.full_name}.git mirrored-repositories/${repo.full_name}`,
      function (code, stdout, stderr) {
        processCloneRepository(index)
      }
    )
  }
}

function loadRepositories(url) {
  request.get(
    url,
    {
      auth: {
        user: username,
        pass: password,
      },
    },
    function (err, response, body) {
      if (err) return console.log(err)
      let data = JSON.parse(body)
      for (let i = 0; i < data.values.length; i++) {
        const repo = data.values[i]
        if (!skippedRepos.includes(repo.full_name)) repos.push(repo)
      }
      if (data.next) {
        loadRepositories(data.next)
      } else if (repos.length > 0) {
        console.log(`${repos.length} repositories loaded.`)
        cloneRepository(0)
      } else {
        console.log('No repositories found.')
      }
    }
  )
}

if (username && password) {
  console.log('Loading all repositories.. please wait..')
  loadRepositories('https://api.bitbucket.org/2.0/repositories/?role=member')
} else {
  console.log('Please specify both the --username and --password options.')
}
