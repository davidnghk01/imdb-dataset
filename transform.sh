set -xe

node ./cleanupMovieData.js
node ./cleanupPrincipalName.js
node ./cleanupName.js
node ./combineData.js