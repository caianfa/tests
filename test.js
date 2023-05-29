const fs = require('fs/promises');

(async function() {
    const fileContent = await fs.readFile('./package.json', {
        encoding: 'utf-8'
    });

    await fs.writeFile('./tttttttt.json', fileContent);
    console.log(process);
})();