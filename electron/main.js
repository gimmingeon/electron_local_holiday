const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs')

// ✅ CommonJS는 __dirname 기본 제공!
let mainWindow;
let backendProcess;

const isDev = !app.isPackaged;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile(`${path.join(__dirname, '../build/index.html')}`);
    // mainWindow.loadURL('http://localhost:3000');

    // 개발자 모드
    // mainWindow.webContents.openDevTools();
}

// function startBackend() {
//     const backendPath = path.join(__dirname, '../../holiday_calendar_BE');
//     console.log('✅ Backend CWD:', backendPath);

//     backendProcess = spawn('npm', ['run', 'start:prod'], {
//         cwd: backendPath,
//         shell: true,
//         stdio: ['pipe', 'pipe', 'pipe']
//     });

//     backendProcess.on('error', (err) => {
//         console.error('❌ Backend spawn error:', err);
//     });

//     backendProcess.on('close', (code) => {
//         console.log(✅ Backend 종료, 코드: ${code});
//     });
// }

// console.log('process.resourcesPath:', process.resourcesPath);
// // 예: C:\Users\USERNAME\AppData\Local\Programs\HolidayCalendarApp\resources

// console.log('backendEntry:', path.join(process.resourcesPath, 'backend', 'app.js'));
// // 예: C:\Users\USERNAME\AppData\Local\Programs\HolidayCalendarApp\resources\backend\app.js

function writeLog(message) {
    // ✔️ 개발 모드면 __dirname 기준, 배포모드면 process.resourcesPath 기준
    const basePath = isDev ? __dirname : process.resourcesPath;

    // EXE 옆에 log 파일이 생김!
    const logPath = path.join(basePath, 'backend-debug.log');

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(logPath, logMessage, 'utf8');
}
function startBackend() {

    writeLog(`✅ Electron isPackaged: ${app.isPackaged}`);

    // 개발 모드
    if (isDev) {
        const backendPath = path.join(__dirname, '../../holiday_calendar_BE');

        writeLog(`✅ [DEV] Backend CWD: ${backendPath}`);

        backendProcess = spawn('npm', ['run', 'start:prod'], {
            cwd: backendPath,
            shell: true,
            stdio: ['pipe', 'pipe', 'pipe']
        });
    } else {

        writeLog(`✅ [PROD] process.resourcesPath: ${process.resourcesPath}`);

        const backendEntry = path.join(process.resourcesPath, 'backend', 'app.js');
        const nodeExecutable = path.join(process.resourcesPath, 'node.exe')

        writeLog(`✅ [PROD] Backend Entry: ${backendEntry}`);
        writeLog(`✅ [PROD] nodeExecutable: ${nodeExecutable}`);

        if (!fs.existsSync(backendEntry)) {
            writeLog('❌ [PROD] backendEntry 파일이 존재하지 않음!');
        } else {
            writeLog('✅ [PROD] backendEntry 파일이 존재함!');
        }

        if (!fs.existsSync(nodeExecutable)) {
            writeLog('❌ [PROD] node.exe 파일이 존재하지 않음!');
        } else {
            writeLog('✅ [PROD] node.exe 파일이 존재함!');
        }

        backendProcess = spawn(nodeExecutable, [backendEntry], {
            cwd: process.resourcesPath,
            shell: false,
            stdio: 'pipe'
        });

        backendProcess.stdout.on('data', (data) => {
            writeLog(`[Backend stdout] ${data}`);
        });

        backendProcess.stderr.on('data', (data) => {
            writeLog(`[Backend stderr] ${data}`);
        });
    }

    backendProcess.on('error', (err) => {
        writeLog(`❌ Backend spawn error: ${err}`);
    });

    backendProcess.on('close', (code) => {
        writeLog(`✅ Backend 종료, 코드: ${code}`);
    });
}


app.whenReady().then(() => {

    app.setPath('userData', path.join(app.getPath('userData'), 'holiday_calendar_data'));

    startBackend();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
    if (backendProcess) backendProcess.kill();
});

ipcMain.handle("show-alert", async (event, message) => {
    await dialog.showMessageBox({
        type: 'info',
        message,
        buttons: ["확인"]
    })
})

ipcMain.on('showDialog', async (event, arg) => {
    const options = { message: 'Sample message', buttons: ['Yes', 'No'] };
    dialog.showMessageBox(mainWindow, options);
});