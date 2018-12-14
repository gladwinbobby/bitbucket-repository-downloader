const argv = require('yargs').argv
const request = require('request');
const nodegit = require('nodegit');

let repos = [];
let opts = {
	fetchOpts: {
		callbacks: {
			credentials: function() {
				return nodegit.Cred.userpassPlaintextNew(argv.username, argv.password);
			},
			certificateCheck: function() {
				return 1;
			}
		}
	}
};

function cloneRepository(index) {
	let repo = repos[index];
	console.log('Cloning ' + repo.full_name);
	nodegit.Clone(repo.links.clone[0].href, 'repositories/' + repo.full_name, opts)
	.then(function(repo) {
		if (repos.length - 1 == index) {
			console.log("All repositories cloned");
		} else {
			cloneRepository(index + 1);
		}
	})
	.catch(function(err) {
		if (err) {
			console.log(err);
		}

		if (err.errno === -4) {
			console.warn("Skipping existing repository");
			cloneRepository(index + 1);
		}
	});
}

function loadRepositories(url) {
	request.get(url, {
		'auth': {
			'user': argv.username,
			'pass': argv.password
		}
	}, function (err, response, body) {
		if (err) return console.log(err);
		let data = JSON.parse(body);
		for (var i = 0; i < data.values.length; i++) {
			repos.push(data.values[i]);
		}
		if (data.next){
			loadRepositories(data.next);	
		} else if (repos.length > 0) {
			console.log('Started cloning..');
			cloneRepository(0);
		} else {
			console.log("No repositories found");
		}
	});
}

if (argv.username && argv.password) {
	console.log('Loading all repositories..');
	loadRepositories('https://api.bitbucket.org/2.0/repositories/?role=member');
} else {
	console.log('Please specify both the --username and --password options');
}
