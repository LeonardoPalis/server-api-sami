var output = require('../../util/Output.js');
var validator = require('../validator.js');
var encryption = require('../../util/Encryption.js');
var constants = require('../../../constants.js');

function createHub(con, id, password, user_id, value, authentication_key, created_at){
  return new Promise((resolve, callbackError)=>{
    validator.validatorCreateHub(con, vId).then((result)=>{
      let sqlTable = "INSERT INTO hubs (id, password, user_id, value, authentication_key, created_at ) VALUES (\'" + id + "\', \'" + password +  "\', \'" + user_id +  "\', \'" + value +  "\', \'" + authentication_key +  "\', \'"  + created_at + "\')";
      let auth_token_generator = encryption.encryptKey(authentication_key);
      let sqlAuthTable = "INSERT INTO authentiation_hub (authentication_key, auth_token, created_at) VALUES (\'" + authentication_key + "\', \'" + auth_token_generator +  "\', \'" + system.timestampSystem() + "\')";

      con.query(sqlAuthTable, function (err, result) {
        if (err) {
          resolve(404);
        }else{
          output.db("1 record inserted");
          resolve({status: 200, auth_token: auth_token_generator});
        }
      });
    })
  })
}

function isAuthenticate(con, authentication_key){
  console.log(authentication_key)
  return new Promise((resolve)=>{
    validator.existsHubAuthenticate(con, authentication_key).then((result)=>{
      if(result == 403){
        return resolve(false);
      }else{
        return resolve(true);
      }
    })
  })
}

function isGuessAuthenticate(con, authentication_key, auth_token){
  return new Promise((resolve)=>{
    validator.existsGuessHubAuthenticate(con, authentication_key, auth_token).then((result)=>{
      if(result == 200){
        return resolve(true);
      }else{
        return resolve(false);
      }
    })
  })
}

function isGuessAuthenticateByTokenAndAdminToken(con, auth_token_admin, auth_token){
  return new Promise((resolve)=>{
    validator.validatorGuessHubAuthenticateByAuthTokenAndAdminToken(con, auth_token_admin, auth_token).then((result)=>{
      if(result == 200){
        return resolve(true);
      }else{
        return resolve(false);
      }
    })
  })
}

function isGuessAuthenticateByToken(con, auth_token){
  return new Promise((resolve)=>{
    validator.validatorGuessHubAuthenticateByAuthToken(con, auth_token).then((result)=>{
      if(result.status == 200){
        return resolve({response: true, message: result.message});
      }else{
        return resolve({response: false, message: ""});
      }
    })
  })
}

function getToken(con, authentication_key, password){
  console.log(authentication_key)
  console.log(password)
  return new Promise((resolve)=>{
    con.query("SELECT auth_token FROM tokens_hub WHERE authentication_key =\'" + authentication_key + "\' AND password =\'" + password + "\'", function (err, result, fields) {
      console.log(result)
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, auth_token: result[0].auth_token});
      }else{
        resolve({status: 409, message: "Hub not found"});
      }
    });
  })
}

function getRoleOfUser(con, user_id, hub_auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT role FROM relations_hub_user WHERE user_id =\'" + user_id + "\' AND auth_token =\'" + hub_auth_token + "\' LIMIT 1", function (err, result, fields) {
      if (err){
        resolve(false);
      }else if(result.length > 0){
        resolve(result[0].role);
      }else{
        resolve(false);
      }
    });
  })
}

function getGuessAuthTokenAdminByAuthToken(con, hub_auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT auth_token_admin FROM tokens_guess_hub WHERE auth_token =\'" + hub_auth_token + "\'", function (err, result, fields) {
      if (err){
        resolve(null);
      }else if(result.length > 0){
        resolve(result[0].auth_token_admin);
      }else{
        resolve(null);
      }
    });
  })
}

function getAdminAuthTokenAdminByAuthToken(con, hub_auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT authentication_key FROM tokens_hub WHERE auth_token =\'" + hub_auth_token + "\'", function (err, result, fields) {
      console.log(result)
      if (err){
        resolve(null);
      }else if(result.length > 0){
        resolve(result[0].authentication_key);
      }else{
        resolve(null);
      }
    });
  })
}

function authenticateNewHub(con, authentication_key, name, password){
  return new Promise((resolve)=>{
    var auth_token = encryption.encryptKey(authentication_key + global.HUB_PERMISSION + new Date().getTime());
    let sqlTable = "INSERT INTO tokens_hub (authentication_key, auth_token, role, name, password, created_at) VALUES (\'" + authentication_key + "\', \'" + auth_token +  "\', \'" + "admin" + "\', \'" + name +  "\', \'" + password +  "\', \'"  + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\')";

    con.query(sqlTable, function (err, result) {
      if (err){
        resolve({status: 500, message: "Something is wrong"});
      }else{
        resolve({status: 404, auth_token: auth_token});
      }
    });
  })
}

function authenticateNewGuessHub(con, auth_token_admin, name, role, password){
  return new Promise((resolve)=>{
    var auth_token = encryption.encryptKey(auth_token_admin + global.HUB_GUESS_PERMISSION + new Date().getTime());
    let sqlTable = "INSERT INTO tokens_guess_hub (auth_token_admin, auth_token, role, name, password, created_at) VALUES (\'" + auth_token_admin + "\', \'" + auth_token +  "\', \'" + role + "\', \'" + name +  "\', \'" + password +  "\', \'"  + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\')";

    if (role == "user" || "smp_user"){
      con.query(sqlTable, function (err, result) {
        if (err){
          resolve({status: 500, message: "Something is wrong"});
        }else{
          resolve({status: 200, auth_token: auth_token});
        }
      });
    }else{
      resolve({status: 500, message: "This role is not defined"});
    }
  })
}

function deleteGuessHub(con, auth_token_admin, auth_token){
  return new Promise((resolve)=>{
    var sqlTable = "DELETE FROM tokens_guess_hub WHERE auth_token =\'" + auth_token + "\' AND auth_token_admin =\'" + auth_token_admin + "\'";
    con.query(sqlTable, function (err, result) {
      if (err){
        resolve({status: 500, message: "Something is wrong"});
      }else{
        resolve({status: 200, message: "Hub deleted successfully"});
      }
    });

  })
}

function deleteAssociateByAuthToken(con, auth_token){
  return new Promise((resolve)=>{
    var sqlTable = "DELETE FROM relations_hub_user WHERE auth_token =\'" + auth_token + "\'";

    con.query(sqlTable, function (err, result) {
      if (err){
        resolve({status: 500, message: "Something is wrong"});
      }else{
        resolve({status: 200, message: "Hub association deleted successfully"});
      }
    });

  })
}

function deleteGuessHubAssociate(con, auth_token, user_id){
  return new Promise((resolve)=>{
    var sqlTable = "DELETE FROM relations_hub_user WHERE auth_token =\'" + auth_token + "\' AND user_id =\'" + user_id + "\'";

    con.query(sqlTable, function (err, result) {
      if (err){
        resolve({status: 500, message: "Something is wrong"});
      }else{
        resolve({status: 200, message: "Hub association deleted successfully"});
      }
    });

  })
}

function relationateHubUser(con, auth_token, user_token, role){
  return new Promise((resolve)=>{
    let sqlTable = "INSERT INTO relations_hub_user (auth_token, user_id, role, created_at) VALUES (\'" + auth_token + "\', \'" + user_token + "\',\'" + role + "\', \'" + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\')";
    con.query(sqlTable, function (err, result) {
      if (err){
        resolve(err);
      }else{
        resolve(200);
      }
    });
  })
}

function isAssociateHubUser(con, auth_token, user_id){
  return new Promise((resolve)=>{
    validator.validatorAssociationHubUser(con, auth_token, user_id).then((result)=>{
      return resolve(result);
    })
  })
}

function getDataAdminUser(con, auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT authentication_key, role, name, password, created_at FROM tokens_hub WHERE auth_token =\'" + auth_token + "\'", function (err, result, fields) {
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, message: result[0]});
      }else{
        resolve({status: 409, message: "Hub not found"});
      }
    });
  })
}

function getDataGuess(con, auth_token){
  return new Promise((resolve)=>{
    con.query("SELECT role, name, created_at FROM tokens_guess_hub WHERE auth_token =\'" + auth_token + "\'", function (err, result, fields) {

      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, message: result[0]});
      }else{
        resolve({status: 409, message: "Hub not found"});
      }
    });
  })
}

function filterAllHubsByUser(con, user_id){
  console.log("UID: " + user_id)
  return new Promise((resolve)=>{
    validator.validatorRoleByAssociate(con, user_id).then((result)=>{
      if(result.status == 200){
          return resolve({status: 200, message: result})
      }else{
        return resolve({status: 409, message: "No results"})
      }
    })
  })
}

function filterAllAdminHubsByUser(con, user_id){
  console.log("UID: " + user_id)
  return new Promise((resolve)=>{
    validator.validatorAdminRoleByAssociate(con, user_id).then((result)=>{
      if(result.status == 200){
          return resolve({status: 200, message: result})
      }else{
        return resolve({status: 409, message: "No results"})
      }
    })
  })
}


function verifyAdminUser(con, authentication_key, auth_token){
  return new Promise((resolve)=>{
    validator.validatorHubAdminUser(con, authentication_key, auth_token).then((result)=>{
      console.log("HUB SYNCRONIZED");
      if(result == 200){
        return resolve(true);
      }else{
        return resolve(false);
      }
    })
  })
}

function deleteAdminHub(con, auth_token){
  return new Promise((resolve)=>{
    var sqlTable = "DELETE FROM tokens_hub WHERE auth_token =\'" + auth_token + "\'";
    con.query(sqlTable, function (err, result) {
      if (err){
        resolve({status: 500, message: "Something is wrong"});
      }else{
        resolve({status: 200, message: "Hub deleted successfully"});
      }
    });
  })
}

function deleteAdminAssociation(con, auth_token){
  return new Promise((resolve)=>{
    var sqlTable = "DELETE FROM relations_hub_user WHERE auth_token =\'" + auth_token + "\'";
    con.query(sqlTable, function (err, result) {
      if (err){
        resolve({status: 500, message: "Something is wrong"});
      }else{
        resolve({status: 200, message: "Hub association deleted successfully"});
      }
    });
  })
}

exports.createHub = createHub;
exports.isAuthenticate = isAuthenticate;
exports.authenticateNewHub = authenticateNewHub;
exports.relationateHubUser = relationateHubUser;
exports.isGuessAuthenticate = isGuessAuthenticate;
exports.authenticateNewGuessHub = authenticateNewGuessHub;
exports.isGuessAuthenticateByTokenAndAdminToken = isGuessAuthenticateByTokenAndAdminToken;
exports.deleteGuessHub = deleteGuessHub;
exports.isAssociateHubUser = isAssociateHubUser;
exports.isGuessAuthenticateByToken = isGuessAuthenticateByToken;
exports.deleteGuessHubAssociate = deleteGuessHubAssociate;
exports.filterAllHubsByUser = filterAllHubsByUser;
exports.getDataAdminUser = getDataAdminUser;
exports.getDataGuess = getDataGuess;
exports.deleteAssociateByAuthToken = deleteAssociateByAuthToken;
exports.verifyAdminUser = verifyAdminUser;
exports.deleteAdminHub = deleteAdminHub;
exports.deleteAdminAssociation = deleteAdminAssociation;
exports.getToken = getToken;
exports.getRoleOfUser = getRoleOfUser;
exports.getGuessAuthTokenAdminByAuthToken = getGuessAuthTokenAdminByAuthToken;
exports.getAdminAuthTokenAdminByAuthToken = getAdminAuthTokenAdminByAuthToken;
exports.filterAllAdminHubsByUser = filterAllAdminHubsByUser;
