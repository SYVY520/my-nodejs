const path = require('path')
module.exports =  {
    entry:path.join(__dirname, 'index'),
    // target:"node",
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
};

module.exports = {
    mode:'production',
}
