const createModel = require('./src/js/create-model.js');
const createConfig = require('./src/js/create-initial-config.js');
const createSandBox = require('./src/js/create-sandbox.js');
const createSqlFile = require('./src/js/create-sql-files.js');
const fs = require('fs');
const fse = require('fs-extra');
var uuid = require("uuid");


function consoleRunLog(string){
    $('.runLog').append(string+"<br>");
}
function generateSlug(){
    document.getElementById("slug").value = "\\"+limparUrl(document.getElementById("ProjectName").value);
}
function limparUrl(str){
    str = str.toLowerCase();
    str = str.split(' ').join('-');
    str = str.replace(/[ÀÁÂÃÄÅ]/g,"A");
    str = str.replace(/[àáâãäå]/g,"a");
    str = str.replace(/[ÈÉÊË]/g,"E");
    return str;
}

function downloadConfigApp(){
    var configProject = {
        ProjectName: document.getElementById("ProjectName").value,
        TargetProject: document.getElementById("TargetProject").value,
        slug: document.getElementById("slug").value,
        code: document.getElementById("code").value
    };
    var nameProjectSlug =limparUrl(document.getElementById("ProjectName").value);
    // create the text file as a Blob:
    var blob = new Blob([JSON.stringify(configProject)],{type: "text/plain"});

    // // download the file:
    download(blob,nameProjectSlug+".lewix");
}



function download(blob,name) {
    var url = URL.createObjectURL(blob),
        anch = document.createElement("a");
    anch.innerHTML = "&nbsp;";
    anch.href = url;
    anch.download = name;
    var ev = new MouseEvent("click",{});
    anch.dispatchEvent(ev);
}


var openFile = function(event) {
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){

        var obj = JSON.parse(reader.result);
        
        document.getElementById("ProjectName").value = obj.ProjectName;
        document.getElementById("TargetProject").value = obj.TargetProject;
        document.getElementById("slug").value = obj.slug;
        document.getElementById("code").value = obj.code;
        
    };
    reader.readAsText(input.files[0]);
};

function importProject(event){
    openFile(event);
    $('#CreateNew').show();
    $('#options').hide();
}


function getHash(str, algo = "SHA-256") {
    let strBuf = new TextEncoder('utf-8').encode(str);
    return crypto.subtle.digest(algo, strBuf)
      .then(hash => {
        window.hash = hash;
        // here hash is an arrayBuffer, 
        // so we'll connvert it to its hex version
        let result = '';
        const view = new DataView(hash);
        for (let i = 0; i < hash.byteLength; i += 4) {
          result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
        }
        return result;
      });
  }



$("#build-project").click(function(){

    $("#CreateNew").hide();
    $("#Load").show();

    /**************************/
    //  CREATE RASH SECURITY  //
    const rashSecurity = uuid.v4();

    var dirtemp = './teste';
    var dirPersist = document.getElementById("TargetProject").value+document.getElementById("slug").value;

    var codeDescription = document.getElementById("code").value;
    codeDescription = codeDescription.replace(/(\r\n|\n|\r)/gm,"");
    // codeDescription = codeDescription.replace(/\s/g, '');
    codeDescription = codeDescription.trim();
    var entidadesLabels = codeDescription.split(";");


    /*******************************/
    // CREATE DIRECTORIES
    if (!fs.existsSync(dirtemp)){
        fs.mkdirSync(dirtemp);
    }
    if (!fs.existsSync(dirtemp+"/models")){
        fs.mkdirSync(dirtemp+"/models");
    }
    if (!fs.existsSync(dirtemp+"/lib")){
        fs.mkdirSync(dirtemp+"/lib");
    }
    if(!fs.existsSync(dirtemp+'/SQL')){
        fs.mkdirSync(dirtemp+'/SQL');
    }
    if(!fs.existsSync(dirtemp+'/API')){
        fs.mkdirSync(dirtemp+'/API');
    }
    for(var i=0; i<entidadesLabels.length; i++){
        if(entidadesLabels[i] != ""
        && entidadesLabels[i].substring(0,10) != "create_con"){
            
            var labels = entidadesLabels[i].split(",");
            var entidade = labels[0].split("_")[1];

            if(!fs.existsSync(dirtemp+`/API/${entidade}/`)){
                fs.mkdirSync(dirtemp+`/API/${entidade}/`);
            }
            if(!fs.existsSync(dirtemp+`/API/${entidade}/list`)){
                fs.mkdirSync(dirtemp+`/API/${entidade}/list`);
            }
            if(!fs.existsSync(dirtemp+`/API/${entidade}/list/sandbox`)){
                fs.mkdirSync(dirtemp+`/API/${entidade}/list/sandbox`);
            }
            if(!fs.existsSync(dirtemp+`/API/${entidade}/save`)){
                fs.mkdirSync(dirtemp+`/API/${entidade}/save`);
            }
            if(!fs.existsSync(dirtemp+`/API/${entidade}/save/sandbox`)){
                fs.mkdirSync(dirtemp+`/API/${entidade}/save/sandbox`);
            }
            if(!fs.existsSync(dirtemp+`/API/${entidade}/remove`)){
                fs.mkdirSync(dirtemp+`/API/${entidade}/remove`);
            }
            if(!fs.existsSync(dirtemp+`/API/${entidade}/remove/sandbox`)){
                fs.mkdirSync(dirtemp+`/API/${entidade}/remove/sandbox`);
            }
        }
    }
    // FIM CREATE DIRECTORIES
    /*******************************/
    
    createConfig(codeDescription, rashSecurity);
    createSqlFile(codeDescription);

    for(var i=0; i<entidadesLabels.length; i++){
        if(entidadesLabels[i] != ""
        && entidadesLabels[i].substring(0,10) != "create_con"){
            createModel(entidadesLabels[i]);
            createSandBox(entidadesLabels[i], rashSecurity);
        }
    }






    fse.move('./teste', dirPersist, err => {
        if(err) return console.error(err);
        consoleRunLog('success!');
    });
    $(".preloader-wrapper").hide();
});






$(document).ready(function(){
    M.textareaAutoResize($('#code'));
});
