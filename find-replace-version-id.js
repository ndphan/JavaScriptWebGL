const fs = require('fs');

const productionFile = "./.env.production";

function randomBuildId() {
    const date = new Date().toISOString().split('T')[0];
    const randomHash = 'xxxx'.replace(/[xy]/g, char => {
        const r = Math.random() * 16 | 0, v = char == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
    return `${date}-${randomHash}`
}

fs.access(productionFile, fs.constants.F_OK, (err) => {
    if (err) {
        // File does not exist, create it with NODE_ENV=production and REACT_APP_API_VERSION_NUMBER
        const content = `NODE_ENV=production\nREACT_APP_API_VERSION_NUMBER=${randomBuildId()}\n`;
        fs.writeFile(productionFile, content, 'utf8', (err) => {
            if (err) return console.log(err);
            console.log(`${productionFile} created with NODE_ENV=production and REACT_APP_API_VERSION_NUMBER`);
        });
    } else {
        // File exists, proceed with reading and updating it
        fs.readFile(productionFile, 'utf8', (err, data) => {
            if (err) return console.log(err);
            const updatedData = data.replace(/REACT_APP_API_VERSION_NUMBER=[\d\w\-]*/g, `REACT_APP_API_VERSION_NUMBER=${randomBuildId()}`);
            fs.writeFile(productionFile, updatedData, 'utf8', (err) => {
                if (err) return console.log(err);
                console.log(`${productionFile} updated with new REACT_APP_API_VERSION_NUMBER`);
            });
        });
    }
});