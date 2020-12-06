function createSqlFile(stringModel){

    // tb_Person,Nome[varchar(255) NOT NULL],Email[varchar(255)]
    
var CORPO_DO_ARQUIVO_SQL_GLOBAL = `

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

`;


entidadesLabels = stringModel.split(";");
    for(var count=0; count<entidadesLabels.length; count++){
        if(entidadesLabels[count] != ""
        && entidadesLabels[count].substring(0,10) != "create_con"){

            

            var labelsComSQL = entidadesLabels[count].split(",");
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
                        SQLlabels.push("int NOT NULL AUTO_INCREMENT");
                    else
                        SQLlabels.push("varchar(255)");
                    
                    labels.push(labelsComSQL[i]);
                }
            }
            var TabelaNome = labels[0];
            var entidade = labels[0].split("_")[1];
        
        

var CORPO_DO_ARQUIVO_SQL_LOCAL = `
    
CREATE TABLE \`${TabelaNome}\` (
    \`id${entidade}\` ${SQLlabels[0]},`;

    

for(j=1; j<labels.length; j++){
    var TabelaColuna = labels[j];

CORPO_DO_ARQUIVO_SQL_LOCAL += `
    \`${TabelaColuna}\` ${SQLlabels[j]},`;
}



CORPO_DO_ARQUIVO_SQL_LOCAL += `
    \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (\`id${entidade}\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`;
        
            CORPO_DO_ARQUIVO_SQL_GLOBAL += CORPO_DO_ARQUIVO_SQL_LOCAL;

            fs.appendFile(`./teste/SQL/${entidade}.sql`, CORPO_DO_ARQUIVO_SQL_LOCAL, function (err) {
                if (err) throw err;
                consoleRunLog(`Saved SQL ${entidade}!`);
                return true;
            });
        }
    }
   
    fs.appendFile(`./teste/SQL/global.sql`, CORPO_DO_ARQUIVO_SQL_GLOBAL, function (err) {
        if (err) throw err;
        consoleRunLog(`Saved SQL GLOBAL!`);
        return true;
    });

}
module.exports = createSqlFile;