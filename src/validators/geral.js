const ValidarCreateRetorno = function(resultado) {
    if (resultado === null) 
        return false;

    if (resultado.id === undefined)
        return false;

    return resultado.id > 0;
}

const ValidarBulkCreateRetorno = function(resultado) {
    if (resultado === null) 
        return false;

    return resultado.length > 0;
}

const ValidarUpdateRetorno = function(resultado) {
    if (resultado === null) 
        return false;
    
    if (resultado.length < 1)
        return false;

    return resultado[0] > 0;
}

const ValidarSelectRetorno = function(resultado) {
    if (resultado === null) 
        return false;

    return resultado.length > 0;
}

module.exports = {
    ValidarCreateRetorno,
    ValidarBulkCreateRetorno,
    ValidarUpdateRetorno,
    ValidarSelectRetorno
}