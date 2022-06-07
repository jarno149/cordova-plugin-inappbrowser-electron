const { join } = require('path')
const { existsSync, readFileSync, writeFileSync } = require('fs')

module.exports = function(context) {
    let projectDir = context.opts.projectRoot

    let electronWWWDir = join(projectDir, 'platforms/electron/www')
    if(existsSync(electronWWWDir)) {
        console.info('Found electron-platform. Modifying file: "cdv-electron-preload.js"')

        let preloadFile = join(electronWWWDir, 'cdv-electron-preload.js')
        let fileContents = readFileSync(preloadFile).toString('utf-8')
        let replacedFileContens = fileContents.replace(/(?<=exec:\s*\(.*){(?=\s*return)/gm, `{
            let callbackId = Math.floor(Number.MAX_SAFE_INTEGER * Math.random()).toString();
            args.push(callbackId);
            ipcRenderer.on(callbackId, (event,data) => { success(data); });
        `)
        writeFileSync(preloadFile, replacedFileContens)
        console.info('Rewritten preload-file')
    }
    console.info('Cannot find electron-platfrom. Skipping preload-initialization')
}