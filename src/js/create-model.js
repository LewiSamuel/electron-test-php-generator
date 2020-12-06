function createModel(stringModel){

    var labelsComSQL = stringModel.split(",");
    var labels = [];
    var SQLlabels = [];
    var mapTypes = ["int", "string", "string", " string"];

    for(var i=0; i<labelsComSQL.length; i++){
        if(labelsComSQL[i].indexOf("[") != -1){
            var labelSemSql = labelsComSQL[i].split("[");
            labels.push(labelSemSql[0]);
            var aux = labelSemSql[1].split("]");
            SQLlabels.push(mapTypes[parseInt(aux[0])]);
        }else{
            if(i == 0)
                SQLlabels.push(mapTypes[0]);
            else
                SQLlabels.push(mapTypes[0]);
            
            labels.push(labelsComSQL[i]);
        }
    }
    var TabelaNome = labels[0];
    var entidade = labels[0].split("_")[1];


var CORPO_DO_ARQUIVO = `<?php
    require_once $APP_PATH_ROOT."/lib/BDConBaseModel.php";

    class ${entidade}Model extends BDConBaseModel {`;




    CORPO_DO_ARQUIVO += `
    
//*********************************************///
//                                             ///
//     PROPRIEDADES PRIVADAS DO OBJETO         ///
//                                             ///
//*********************************************///

        private $id${entidade};`;
    for(var i=1; i<labels.length; i++){
        CORPO_DO_ARQUIVO += `
        private $${labels[i]};`;
    }








    
CORPO_DO_ARQUIVO += `

/********************************************** */
//                                              //
//                                              //
//    GETTERS E SETTERS DAS PROPRIEDADES        //
//                                              //
//                                              //
/********************************************** */

        public function getid${entidade}() {
            return $this->id${entidade};
        }
        public function setid${entidade}(\$id${entidade}) {
            $this->id${entidade} = \$id${entidade};
        }
`;
for(var j=1; j<labels.length; j++){
var Tabela_coluna = labels[j];
CORPO_DO_ARQUIVO += `
        public function get${Tabela_coluna}() {
            return $this->${Tabela_coluna};
        }
        public function set${Tabela_coluna}($${Tabela_coluna}) {
            $this->${Tabela_coluna} = $${Tabela_coluna};
        }
`;
}

















CORPO_DO_ARQUIVO += `







/********************************************** */
//                                              //
//                                              //
//           METODO DE LISTAR (  SELECT )       //
//                                              //
//                                              //
/********************************************** */

        public function list($pagesize = 0,
                            $shift = 0,
                            $pagenumber = 1,
                            $id${entidade} = null`;
     
     for(var j=1; j<labels.length; j++){
         var Tabela_coluna = labels[j];
         CORPO_DO_ARQUIVO += `,
                            $${Tabela_coluna} = null`;
     } 
CORPO_DO_ARQUIVO += `){




            // garante que a primeira página não seja menor que 1 e o tamanho não seja maior que 100
            if (is_null($pagenumber) || ($pagenumber < 1)) { $pagenumber = 1; }
            if (is_null($pagesize) || ($pagesize < 1) || ($pagesize > 100)) { $pagesize = 100; }





            $sql = "SELECT`;

CORPO_DO_ARQUIVO += `
                        ${TabelaNome}.id${entidade},`;

    for(var j=1; j<labels.length; j++){
        var Tabela_coluna = labels[j];
        
        if(j == labels.length-1)
        CORPO_DO_ARQUIVO += `
                        ${TabelaNome}.${Tabela_coluna}`;
        else
        CORPO_DO_ARQUIVO += `
                        ${TabelaNome}.${Tabela_coluna},`;

    }                  
CORPO_DO_ARQUIVO += `
                    FROM
                        ${TabelaNome}
                    WHERE
                        1 = 1";
               
            if(isset($id${entidade}))
            $sql .= " AND ${TabelaNome}.id${entidade} = ".$this->o_db->quote($id${entidade})." ";
    `;
                        
for(var j=1; j<labels.length; j++){
    var Tabela_coluna = labels[j];
    CORPO_DO_ARQUIVO += `
            if(isset($${Tabela_coluna}))
            $sql .= " AND ${TabelaNome}.${Tabela_coluna} = ".$this->o_db->quote($${Tabela_coluna})." ";
    `;
}    

CORPO_DO_ARQUIVO += `


            $sql .= " ORDER BY ${TabelaNome}.${labels[1]} ASC; ";


            $skipvalue = ($pagesize * ($pagenumber - 1));
            $sql = $sql . " LIMIT $pagesize OFFSET $skipvalue";


            try{
                $array = array();
                // lê os registros no bd
                if($resultset = $this->o_db->query($sql)){
                    // transforma os registros em objetos e adiciona ao array de retorno
                    while($obj = $resultset->fetchObject()){
                        array_push($array, $obj);
                    }
                }
                // retorna a lista de objetos como array
                return $array;
        
            }catch(Exception $e){
                return array();
            }


            
        }
`;
























CORPO_DO_ARQUIVO += `






/********************************************** */
//                                              //
//                                              //
//           METODO DE SALVAR/ATUALIZAR         // 
//              ( INSERT/ UPDATE )              //
//                                              //
//                                              //
/********************************************** */
public function save(){

    
    if(!isset($this->id${entidade})){

        $sql = "INSERT INTO
                    ${TabelaNome}(`;



CORPO_DO_ARQUIVO += `
                        id${entidade},`;

    for(j=1; j<labels.length; j++){
        var Tabela_coluna = labels[j];
        
        if(j == labels.length-1)
        CORPO_DO_ARQUIVO += `
                        ${Tabela_coluna}`;
        else
        CORPO_DO_ARQUIVO += `
                        ${Tabela_coluna},`;

    } 

CORPO_DO_ARQUIVO += `)
                VALUES
                    (`;
                
CORPO_DO_ARQUIVO += `
                    ".$this->o_db->quote($this->id${entidade}).",`;

for(j=1; j<labels.length; j++){
    var Tabela_coluna = labels[j];

if(j == labels.length-1)
CORPO_DO_ARQUIVO += `
                    ".$this->o_db->quote($this->${Tabela_coluna})."`;
else
CORPO_DO_ARQUIVO += `
                    ".$this->o_db->quote($this->${Tabela_coluna}).",`;

} 
CORPO_DO_ARQUIVO += `);";
    }else{
        $sql = "UPDATE
                    ${TabelaNome}
                SET
                ";
`;


for(j=1; j<labels.length; j++){
var Tabela_coluna = labels[j];

CORPO_DO_ARQUIVO += `
                if($this->${Tabela_coluna})
                $sql .= " ${Tabela_coluna} = ".$this->o_db->quote($this->${Tabela_coluna}).", ";
                `;
}


CORPO_DO_ARQUIVO += `
                if($this->id${entidade})
                $sql .= " id${entidade} = ".$this->o_db->quote($this->id${entidade})." ";
                `;
CORPO_DO_ARQUIVO += `
        $sql .= "
                WHERE
                    id${entidade} = ".$this->o_db->quote($this->id${entidade}).";
                ";
    }
    

    try{
        if($this->o_db->exec($sql) || ($this->o_db->errorInfo()[0] === "00000")){
            return true;
        }
    }catch(Exception $e){
        return false;
    }


}`;



















// Espaço de identação
CORPO_DO_ARQUIVO += `





/********************************************** */
//                                              //
//                                              //
//           METODO DE DELETAR ( DELETE )       //
//                                              //
//                                              //
/********************************************** */

public function remove(){
    
    if(!isset($this->id${entidade}))
    return false;

    $sql = "DELETE FROM
                ${TabelaNome}
            WHERE
                id${entidade} = ".$this->o_db->quote($this->id${entidade})." ";

    try{
        if($this->o_db->exec($sql) || ($this->o_db->errorInfo()[0] === "00000")){
            return true;
        }
    }catch(Exception $e){
        return false;
    }

}

`;






















    
CORPO_DO_ARQUIVO += `



    }
?>`;
fs.appendFile(`./teste/models/${entidade}Model.php`, CORPO_DO_ARQUIVO, function (err) {
    if (err) throw err;
    consoleRunLog(`Saved Models ${entidade}!`);
    return true;
});


}

module.exports = createModel;