function createConfig(stringModel, rashSecurity){

var CORPO_DO_ARQUIVO = `<?php

    // TIRAR A BARRA CASO TENHA
    $APP_PATH_ROOT = (substr($_SERVER["DOCUMENT_ROOT"], -1) === "/" ? substr($_SERVER["DOCUMENT_ROOT"], 0, strlen($_SERVER["DOCUMENT_ROOT"]) - 1) : $_SERVER["DOCUMENT_ROOT"]);
    date_default_timezone_set("America/Sao_Paulo");
    
    $st_ambiente = explode(".", $_SERVER["HTTP_HOST"].$_SERVER["PHP_SELF"])[0];

    // RASH TO EXTERN AUTENTICATION
    $rashSecurity = "${rashSecurity}";
    
    if(explode("/",$st_ambiente)[0] == "localhost"){
        // DEV
        error_reporting(E_ALL);
        ini_set("display_errors", 1);
    }else{
        // PROD
        error_reporting(0);
        ini_set("display_errors", 0);
    }
    
?>`;
    
fs.appendFile(`./teste/config-geral.php`, CORPO_DO_ARQUIVO, function (err) {
if (err) throw err;
consoleRunLog(`Saved Config Geral!`);
return true;
});

    



var commands = stringModel.split(";"), dataConExist = false;
for(var i=0; i<commands.length; i++){
    if(commands[i].substring(0,10) == "create_con"){
        var data_con = commands[i].split("(");
        data_con = data_con[1].split(")");
        data_con = data_con[0].split(",");
        dataConExist = true;
    }
}
if(dataConExist == false)
var data_con = ['host','user', 'password', 'bd_name'];
 

var CORPO_DO_ARQUIVO = `<?php

abstract class BDConBaseModel{
    protected $o_db;
    function __construct(){
        date_default_timezone_set("America/Sao_Paulo");
        $st_ambiente = explode(".", $_SERVER["HTTP_HOST"].$_SERVER["PHP_SELF"])[0];
        if(explode("/",$st_ambiente)[0] == "localhost"){
            // BD - DEV - LOCALHOST
            $st_host = "${data_con[0]}";
            $st_usuario = "${data_con[1]}";
            $st_password = "${data_con[2]}";
            $st_banco = "${data_con[3]}";
        }else{
            // BD - PROD
            $st_host = "${data_con[0]}";
            $st_usuario = "${data_con[1]}";
            $st_password = "${data_con[2]}";
            $st_banco = "${data_con[3]}";
        }
        $st_dsn = "mysql:host=$st_host;dbname=$st_banco;";
        $this->o_db = new PDO(
            $st_dsn,
            $st_usuario,
            $st_password
        );
        $this->o_db->setAttribute ( PDO::ATTR_ERRMODE , PDO::ERRMODE_EXCEPTION );
    }
}

?>`;
fs.appendFile(`./teste/lib/BDConBaseModel.php`, CORPO_DO_ARQUIVO, function (err) {
    if (err) throw err;
    consoleRunLog(`Saved Config Geral!`);
    return true;
});



}

module.exports = createConfig;