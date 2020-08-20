# bitbucket-repository-downloader
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.me/gladwinbobby/10usd) [![Downloads](https://img.shields.io/npm/dt/bitbucket-repository-downloader.svg)](https://www.npmjs.com/package/bitbucket-repository-downloader)

Clone &amp; Download all the repositories of a Bitbucket account using NodeJS (Recommended Node v8.*)

## Installation
``` sh
git clone https://github.com/gladwinbobby/bitbucket-repository-downloader.git
cd bitbucket-repository-downloader
npm i
```

## Usage
### Simple Example
Use the following command to start cloning the Bitbucket repositories of any account which have Two-Factor Authentication (2FA) disabled.
``` sh
node clone.js --username=yourusername --password=yourpassword
```

### Skip Repositories
Pass the repository's url slug to the --skip argument.
``` sh
node clone.js --username=yourusername --password=yourpassword --skip=yourworkspaceslug/yourprojectslug --skip=gladwinbobby/bitbucket-repository-downloader
```

## All Options
| Argument | Description |
| :--- | :--- |
| `--username` | Bitbucket account username. |
| `--password` | Bitbucket account password. |
| `--skip` | Bitbucket repository's full_name/url slug. |
| `--mirror` | Clone a mirror copy of the repository. |

## Issues & Bug Tracker
Found any issues? Need any enhancements? [Feel free to open issue](https://github.com/gladwinbobby/bitbucket-repository-downloader/issues)

## Donation
If this project helps reduce your time to develop, you can give me a cup of coffee :)

[![paypal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](https://www.paypal.me/gladwinbobby/10usd)