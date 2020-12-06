function createSandBox(stringModel, rashSecurity){

    var labelsComSQL = stringModel.split(",");
    var labels = [];
    var SQLlabels = [];
    for(var i=0; i<labelsComSQL.length; i++){
        if(labelsComSQL[i].indexOf("[") != -1){
            var labelSemSql = labelsComSQL[i].split("[");
            labels.push(labelSemSql[0]);
            var aux = labelSemSql[1].split("]");
            SQLlabels.push(aux[0]);
        }else{
            if(i == 0)
                SQLlabels.push("varchar(255) NOT NULL");
            else
                SQLlabels.push("varchar(255)");
            
            labels.push(labelsComSQL[i]);
        }
    }
    var TabelaNome = labels[0];
    var entidade = labels[0].split("_")[1];

    /********************************************** */
    //                                              //
    //                                              //
    //  CRIAR ARQUIVOS DE ENTIDADE/LIST/SANDBOX     //
    //                                              //
    //                                              //
    /********************************************** */
    var CORPO_DO_ARQUIVO = `<?php

    // Incluindo arquivo de configuração
    require_once (substr($_SERVER["DOCUMENT_ROOT"], -1) === "/" ? substr($_SERVER["DOCUMENT_ROOT"], 0, strlen($_SERVER["DOCUMENT_ROOT"]) - 1) : $_SERVER["DOCUMENT_ROOT"])."/config-geral.php";

    if(!isset($_POST['rashSecurity']) || $_POST['rashSecurity'] != $rashSecurity){
    
    ?>
        <form action="" method="POST">
            <input type="text" name="rashSecurity" placeholder="rashSecurity"> <br>
            <button type="submit">Enviar</button>
        </form>
    <?php
    
    }else{
    ?>
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>${entidade} - SANDBOX</title>
        <style>
            body{
                background-color: #f7f7f7;
            }
            form{
                width: 300px;
                border: 1px solid #b9b9b9;
                margin: auto;
                text-align: center;
                padding-bottom: 40px;
                background-color: white;
            }
            label{
                font-weight: bold;
                color: #00488e;
            }
            input{
                padding: 10px 15px;
                border: 1px solid #d0d0d0;
                border-bottom: 2px solid #00488e;
            }
            button{
                background-color: #00488e;
                border: none;
                padding: 10px 15px;
                color: white;
                font-weight: bold;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <form method="POST" action="../index.php" enctype="multipart/form-data">
            <input type='hidden' name='rashSecurity' value='${rashSecurity}' />
            <br><label for="id${entidade}">id${entidade}</label><br>
            <input type="text" name="id${entidade}" id="id${entidade}" placeHolder="id${entidade}"><br>
        `;
        for(j=1; j<labels.length; j++){
            var Tabela_coluna = labels[j];
            CORPO_DO_ARQUIVO += `
            <br><label for="${Tabela_coluna}">${Tabela_coluna}</label><br>
            <input type="text" name="${Tabela_coluna}" id="${Tabela_coluna}" placeHolder="${Tabela_coluna}"><br>
            `;
        }
// FIm do arquivo
CORPO_DO_ARQUIVO += `
            <button type="submit">Enviar</button>

        </form>
    </body>
</html>
<?php
    }
?>`;



    fs.appendFile(`./teste/API/${entidade}/list/sandbox/index.php`, CORPO_DO_ARQUIVO, function (err) {
        if (err) throw err;
        consoleRunLog(`Saved API/${entidade}/list/sandbox/index.php`);
        return true;
    });
    fs.appendFile(`./teste/API/${entidade}/save/sandbox/index.php`, CORPO_DO_ARQUIVO, function (err) {
        if (err) throw err;
        consoleRunLog(`Saved API/${entidade}/save/sandbox/index.php!`);
        return true;
    });
    fs.appendFile(`./teste/API/${entidade}/remove/sandbox/index.php`, CORPO_DO_ARQUIVO, function (err) {
        if (err) throw err;
        consoleRunLog(`Saved API/${entidade}/remove/sandbox/index.php!`);
        return true;
    });












    /********************************************** */
    //                                              //
    //                                              //
    //  CRIAR ARQUIVOS DE ENTIDADE/LIST/           //
    //                                              //
    //                                              //
    /********************************************** */

    var CORPO_DO_ARQUIVO_LIST = "",
    CORPO_DO_ARQUIVO_SAVE = "",
    CORPO_DO_ARQUIVO_REMOVE = "";

    var CORPO_DO_ARQUIVO = `<?php

    // Incluindo arquivo de configuração
    require_once (substr($_SERVER["DOCUMENT_ROOT"], -1) === "/" ? substr($_SERVER["DOCUMENT_ROOT"], 0, strlen($_SERVER["DOCUMENT_ROOT"]) - 1) : $_SERVER["DOCUMENT_ROOT"])."/config-geral.php";
    header("Access-Control-Allow-Origin: *");
    

    if(!isset($_POST["rashSecurity"]) || $_POST["rashSecurity"] != $rashSecurity){

        echo json_encode("NAO AUTORIZADO");
        exit();
    }


    
    if( !isset($_POST["id${entidade}"])`;


    CORPO_DO_ARQUIVO_LIST += CORPO_DO_ARQUIVO;
    CORPO_DO_ARQUIVO_SAVE += CORPO_DO_ARQUIVO;
    CORPO_DO_ARQUIVO_REMOVE += CORPO_DO_ARQUIVO;




    for(j=1; j<labels.length; j++){
        var Tabela_coluna = labels[j];
        CORPO_DO_ARQUIVO = `
        && !isset($_POST["${Tabela_coluna}"])`;

        CORPO_DO_ARQUIVO_LIST += CORPO_DO_ARQUIVO;
        CORPO_DO_ARQUIVO_SAVE += CORPO_DO_ARQUIVO;
        CORPO_DO_ARQUIVO_REMOVE += CORPO_DO_ARQUIVO;
    }
    CORPO_DO_ARQUIVO = `){

        echo json_encode("NAO AUTORIZADO");
        exit();
    }
        

    require_once $APP_PATH_ROOT."/models/${entidade}Model.php";
    $o_${entidade} = new ${entidade}Model();

    if(isset($_POST["id${entidade}"]) && $_POST["id${entidade}"] != "" && $_POST["id${entidade}"] != null)
    $o_${entidade}->setid${entidade}($_POST["id${entidade}"]);
    else`;

    CORPO_DO_ARQUIVO_LIST += CORPO_DO_ARQUIVO;
    CORPO_DO_ARQUIVO_SAVE += CORPO_DO_ARQUIVO;
    CORPO_DO_ARQUIVO_REMOVE += CORPO_DO_ARQUIVO;


    CORPO_DO_ARQUIVO = `
    $o_${entidade}->setid${entidade}(null);
`;
    CORPO_DO_ARQUIVO_LIST += CORPO_DO_ARQUIVO;
    CORPO_DO_ARQUIVO_REMOVE += CORPO_DO_ARQUIVO;

    CORPO_DO_ARQUIVO_SAVE += CORPO_DO_ARQUIVO;



for(j=1; j<labels.length; j++){
    var Tabela_coluna = labels[j];
CORPO_DO_ARQUIVO = `
    if(isset($_POST["${Tabela_coluna}"]) && $_POST["${Tabela_coluna}"] != "" && $_POST["${Tabela_coluna}"] != null)
    $o_${entidade}->set${Tabela_coluna}($_POST["${Tabela_coluna}"]);
    else
    $o_${entidade}->set${Tabela_coluna}(null);
`;
CORPO_DO_ARQUIVO_LIST += CORPO_DO_ARQUIVO;
CORPO_DO_ARQUIVO_SAVE += CORPO_DO_ARQUIVO;
CORPO_DO_ARQUIVO_REMOVE += CORPO_DO_ARQUIVO;
}


CORPO_DO_ARQUIVO = `
    
    $result = $o_${entidade}->list(0,0,$o_${entidade}->getid${entidade}()`;
    
for(j=1; j<labels.length; j++){
    var Tabela_coluna = labels[j];
    CORPO_DO_ARQUIVO += `, $o_${entidade}->get${Tabela_coluna}()`;
} 

CORPO_DO_ARQUIVO += `);
    $resultJson = ["${entidade}s" => $result];


    echo json_encode($resultJson);

`;

CORPO_DO_ARQUIVO_LIST += CORPO_DO_ARQUIVO;


CORPO_DO_ARQUIVO = `
    
    if($o_${entidade}->save())
        echo json_encode("OK");
    else
        echo json_encode("ERRO");

`;
CORPO_DO_ARQUIVO_SAVE += CORPO_DO_ARQUIVO;


CORPO_DO_ARQUIVO = `
    
    if($o_${entidade}->remove())
        echo json_encode("OK");
    else
        echo json_encode("ERRO");

`;
CORPO_DO_ARQUIVO_REMOVE += CORPO_DO_ARQUIVO;




CORPO_DO_ARQUIVO = `

?>`;
CORPO_DO_ARQUIVO_LIST += CORPO_DO_ARQUIVO;
CORPO_DO_ARQUIVO_SAVE += CORPO_DO_ARQUIVO;
CORPO_DO_ARQUIVO_REMOVE += CORPO_DO_ARQUIVO;


    fs.appendFile(`./teste/API/${entidade}/list/index.php`, CORPO_DO_ARQUIVO_LIST, function (err) {
        if (err) throw err;
        consoleRunLog(`Saved API/${entidade}/list/index.php`);
        return true;
    });
    fs.appendFile(`./teste/API/${entidade}/save/index.php`, CORPO_DO_ARQUIVO_SAVE, function (err) {
        if (err) throw err;
        consoleRunLog(`Saved API/${entidade}/save/index.php!`);
        return true;
    });
    fs.appendFile(`./teste/API/${entidade}/remove/index.php`, CORPO_DO_ARQUIVO_REMOVE, function (err) {
        if (err) throw err;
        consoleRunLog(`Saved API/${entidade}/remove/index.php!`);
        return true;
    });
}
module.exports = createSandBox;