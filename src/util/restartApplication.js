var path = require("path");
var log = require("../util/log.js");
var axios = require("axios").default;
var fs = require("fs");
const { exec } = require("child_process");

module.exports = async (dirPath, serverUrl, currentVersion) => {
  log.writeToLog("Restarting service");
  try {
    if (!fs.existsSync(".\\sincronizador-restart.bat")) {
      let data = `@ECHO OFF

      SET SERVICENAME="Windel Sincronizador"
      SET NSSM="%~dp0\nssm.exe"
      
      ECHO RESTARTING SERVICE %SERVICENAME%
      
      %NSSM% stop %SERVICENAME%
      %NSSM% start %SERVICENAME%`;

      fs.writeFileSync(".\\sincronizador-restart.bat", data);
    }
    exec(
      'powershell -Command "Start-Process cmd -Verb RunAs -ArgumentList \'/c cd "' +
        dirPath +
        '" && .\\sincronizador-restart.bat\'"',
      { shell: true, cwd: dirPath },
      (err, std, stderr) => {
        if (err) log.writeToLog(err);
        process.exit();
      }
    );
  } catch (e) {
    log.writeToLog(e);
  }
};
