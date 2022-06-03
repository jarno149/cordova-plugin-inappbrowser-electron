import { BrowserWindow } from 'electron'

let currentWindow: BrowserWindow = null
let callbackId: string = null

const getOptionWithDefault = (optionArgs: string, key: string, def: string): string => {
    let keyValuePairs = optionArgs.split(',').map(x => {
        let s = x.split('=')
        return {
            key: s[0],
            value: s.length > 0 ? s[1]: null
        }
    })
    let existingOne = keyValuePairs.find(x => x.key === key)

    if(existingOne) {
        return existingOne.value
    }
    return def
}

const initNavigationEvents = (window: BrowserWindow) => {
    let targetWindow = window
    while(targetWindow?.getParentWindow() != null)
        targetWindow = targetWindow?.getParentWindow()
    const emitEvent = (data: any) => {
        targetWindow.webContents.send(callbackId, data)
    }

    window.webContents.on('did-start-loading', () => {
        emitEvent({ type: 'loadstart', url: window.webContents.getURL() })
    })
    window.webContents.on('did-stop-loading', () => {
        emitEvent({ type: 'loadstop', url: window.webContents.getURL() })
    })
    window.webContents.on('did-fail-load', () => {
        emitEvent({ type: 'loadstart', url: window.webContents.getURL() })
        emitEvent({ type: 'loaderror' })
    })
}

const InAppBrowser = {
    open: ([args]: any) => {
        let url = args[0]
        let target = args[1]
        let features = args[2]
        if(args.length < 4)
            throw new Error('Callback id is missing. Do you have implemented callbackId-functionality to contextBridge?')
        callbackId = args[3]

        currentWindow = new BrowserWindow({
            width: parseInt(getOptionWithDefault(features, 'width', '500')),
            height: parseInt(getOptionWithDefault(features, 'height', '600')),
            parent: BrowserWindow.getFocusedWindow(),
            modal: true,
            closable: true,
            webPreferences: {
                nodeIntegration: false
            }
        })
        initNavigationEvents(currentWindow)
        currentWindow.loadURL(url)
    },
    close: () => {
        if(currentWindow)
            currentWindow.close()
        currentWindow = null
    },
    show: () => {
        console.log('Not implemented for electron')
    },
    hide: () => {
        console.log('Not implemented for electron')
    }
}


module.exports = InAppBrowser