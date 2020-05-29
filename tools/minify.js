const miniClassNames = require('./minify_classnames');
const path = require('path');

console.log(path.join(__dirname, '..', 'build/index.html'));

miniClassNames([
    path.join(__dirname, '..', 'build/index.html'),
    path.join(__dirname, '..', 'build/bundle.css'),
    path.join(__dirname, '..', 'build/js/app.js'),
]);