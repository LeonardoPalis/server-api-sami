function validatorRequestSensor(con, sensorId,authentication_key){
  return new Promise((resolve)=>{
    con.query("SELECT con_auth_token FROM sensors WHERE sensor_id =\'" + sensorId + "\' AND hub_authenticate_key = \'" + authentication_key + "\'", function (err, result, fields) {
      console.log("HERE: " + sensorId)
      console.log("HERE2: " + authentication_key)
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 409, con_auth_token: result[0]["con_auth_token"]});
      }else{
        resolve({status: 200});
      }
    });
  })
}

function validatorExistsSensor(con, sensorId){
  return new Promise((resolve)=>{
    con.query("SELECT sensors.name AS sensor FROM sensors JOIN tokens_hub ON tokens_hub.authentication_key = sensors.hub_authenticate_key", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve(200);
      }else{
        resolve(403);
      }
    });
  })
}

function validatorCreateSensor(con, sensorId){
  return new Promise((resolve)=>{
    con.query("SELECT route FROM sensors WHERE id =\'" + sensorId + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length == 0){
        resolve(403);
      }else{
        resolve(409);
      }
    });
  })
}

function validatorCreateHub(con, hubKey){
  return new Promise((resolve)=>{
    con.query("SELECT created_at FROM authentiation_hub WHERE id =\'" + hubKey + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length == 0){
        resolve(403);
      }else{
        resolve(409);
      }
    });
  })
}

function existsHubAuthenticate(con, authentication_key){
  return new Promise((resolve)=>{
    con.query("SELECT created_at FROM tokens_hub WHERE authentication_key =\'" + authentication_key + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length == 0){
        resolve(403);
      }else{
        resolve(409);
      }
    });
  })
}

function existsGuessHubAuthenticate(con, authentication_key, auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT created_at FROM tokens_hub WHERE auth_token =\'" + auth_token + "\'AND authentication_key =\'" + authentication_key + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve(200);
      }else{
        resolve(409);
      }
    });
  })
}

function validatorGuessHubAuthenticateByAuthTokenAndAdminToken(con, auth_token_admin, auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT created_at FROM tokens_guess_hub WHERE auth_token =\'" + auth_token + "\' AND auth_token_admin =\'" + auth_token_admin +"\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve(200);
      }else{
        resolve(409);
      }
    });
  })
}

function validatorGuessHubAuthenticateByAuthToken(con, auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT role FROM tokens_guess_hub WHERE auth_token =\'" + auth_token + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, message: result[0].role});
      }else{
        resolve({status: 409, message: ""});
      }
    });
  })
}

function validatorAssociationHubUser(con, auth_token, user_id){
  return new Promise((resolve)=>{
    con.query("SELECT created_at FROM relations_hub_user WHERE auth_token =\'" + auth_token + "\' AND user_id =\'" + user_id +"\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length == 0){
        resolve(200);
      }else{
        resolve(409);
      }
    });
  })
}

function validatorRoleByAssociate(con, user_id){
  return new Promise((resolve)=>{
    var st = "SELECT tokens_guess_hub.name, tokens_guess_hub.auth_token, tokens_guess_hub.role, tokens_hub.authentication_key, tokens_guess_hub.created_at FROM tokens_guess_hub JOIN relations_hub_user JOIN tokens_hub ON tokens_guess_hub.auth_token_admin = tokens_hub.auth_token AND tokens_guess_hub.auth_token = relations_hub_user.auth_token AND relations_hub_user.user_id = \'" + user_id + "\'"
    con.query(st, function (err, result, fields) {

      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, message: result});
      }else{
        resolve({status: 409, message: "Association not found"});
      }
    });
  })
}

function validatorAdminRoleByAssociate(con, user_id){
  return new Promise((resolve)=>{
    var st = "SELECT tokens_hub.name, tokens_hub.authentication_key, tokens_hub.password, tokens_hub.auth_token, tokens_hub.role, tokens_hub.created_at FROM tokens_hub JOIN relations_hub_user ON tokens_hub.auth_token = relations_hub_user.auth_token AND relations_hub_user.user_id = \'" + user_id + "\'"
    con.query(st, function (err, result, fields) {

      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, message: result});
      }else{
        resolve({status: 409, message: "Association not found"});
      }
    });
  })
}

function validatorHubAdminUser(con, authentication_key, auth_token){

  return new Promise((resolve)=>{
    con.query("SELECT created_at FROM tokens_hub WHERE auth_token =\'" + auth_token +"\'", function (err, result, fields) {
        
      if (err){
        return resolve(404);
      }else if(result.length > 0){
        return resolve(200);
      }else{
        return resolve(403);
      }
    });
  })
}


exports.validatorRequestSensor = validatorRequestSensor;
exports.validatorCreateSensor = validatorCreateSensor;
exports.existsHubAuthenticate = existsHubAuthenticate;
exports.existsGuessHubAuthenticate = existsGuessHubAuthenticate;
exports.validatorGuessHubAuthenticateByAuthTokenAndAdminToken = validatorGuessHubAuthenticateByAuthTokenAndAdminToken;
exports.validatorAssociationHubUser = validatorAssociationHubUser;
exports.validatorGuessHubAuthenticateByAuthToken = validatorGuessHubAuthenticateByAuthToken;
exports.validatorRoleByAssociate = validatorRoleByAssociate;
exports.validatorAdminRoleByAssociate = validatorAdminRoleByAssociate;
exports.validatorHubAdminUser = validatorHubAdminUser;
exports.validatorExistsSensor = validatorExistsSensor;
