const fsPromises = require('fs').promises;

async function requestFileToBase64(file) {
    const buffer64ed = await fsPromises.readFile(file.path, { encoding: 'base64' });
    return `data:${file.mimetype};base64,${buffer64ed}`
}

module.exports = {
    requestFileToBase64: requestFileToBase64
};