var output = require('../../util/Output.js');
var validator = require('../validator.js');
var encryption = require('../../util/Encryption.js');
var constants = require('../../../constants.js');
var bcrypt = require('bcrypt');

function signUp(con, user){
  return new Promise((resolve)=>{
    let salt = bcrypt.genSaltSync(12);
    let encrypted_password = bcrypt.hashSync(user.password, salt);

    let sqlTable = "INSERT INTO users (name, email, encrypted_password, role, created_at) VALUES (\'" + user.name + "\', \'" + user.email +  "\', \'" + encrypted_password + "\', \'" + "admin" +  "\', \'"  + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\')";

    con.query(sqlTable, function (err, result) {
      if (err){
        if(err.code == "ER_DUP_ENTRY"){
          resolve({status: 409, message: "This email is already in use"});

        }else{
          resolve({status: 500, message: err.sqlMessage});
        }
      }else{
        resolve({status: 200, message: "User created successfuly"});
      }
    });
  })
}

function _getInfByEmail(con, email){
  return new Promise((resolve)=>{

    let sqlTable = "SELECT * FROM users WHERE email =\'" + email + "\'";

    con.query(sqlTable, function (err, result) {
      if (err){
        resolve(false);
      }else{
        if(result.length > 0){
          resolve(result[0]);
        }else{
          resolve(false);
        }
      }
    });
  })
}

function signIn(con, user){
  return new Promise((resolve)=>{

    _getInfByEmail(con, user.email).then((userData)=>{

      if(userData.encrypted_password){
        let authentication = bcrypt.compareSync(user.password, userData.encrypted_password);
        if(authentication){
          var auth_token = encryption.encryptKey(user.encrypted_password + global.HUB_PERMISSION + new Date().getTime());
          let sqlTable = "INSERT INTO authenticate_users (user_id, auth_token, created_at) VALUES (\'" + user.email + "\', \'" + auth_token + "\', \'"  + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\')";
          con.query(sqlTable, function (err, result) {
            if (err){
              resolve({status: 500, message: "Something is wrong"});
            }else{
              console.log(userData.name)
              resolve({status: 200, message: "User logged successfuly", auth_token: auth_token, user: userData});
            }
          });
        }else{
          resolve({status: 401, message: "Invalid credentials"});
        }
      }else{
        resolve({status: 401, message: "Invalid credentials"});
      }
     })
  })
}

function getUserIdByAuthToken(con, auth_token){
  return new Promise((resolve)=>{

    let sqlTable = "SELECT user_id FROM authenticate_users WHERE auth_token =\'" + auth_token + "\' LIMIT 1";
    con.query(sqlTable, function (err, result) {
      console.log(result)
      if (err){
        resolve(null);
      }else{
        if(result.length > 0){
          resolve(result[0].user_id);
        }else{
          resolve(null);
        }
      }
    });
  })
}


exports.signUp = signUp;
exports.signIn = signIn;
exports.getUserIdByAuthToken = getUserIdByAuthToken;
