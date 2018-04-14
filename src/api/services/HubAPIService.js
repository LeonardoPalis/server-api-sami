var datastoreAPI = require('../datastore.js');
var async = require('async')
function createAdminAuthenticate(authentication_key, name, password, user_id){
  return new Promise((resolve)=>{
    datastoreAPI.verifyHubAuthentication(authentication_key).then((result)=>{
      if(!result){
        datastoreAPI.createNewAdminHubAuthenticate(authentication_key, name, password).then((token)=>{
          let auth_token = token.auth_token;
          datastoreAPI.createNewRelationHubUser(auth_token, user_id, "admin").then((user_registered)=>{
            return resolve({status: 200, auth_token: auth_token});
          })
        })
      }else{
        return resolve({status: 409, message: "This Hub is already in use"});
      }
    })
  })
}

function createGuessAuthenticate(authentication_key, auth_token, name, role, password){
  return new Promise((resolve)=>{
    if(role == "user" || role == "smp_user"){
      datastoreAPI.verifyGuessHubAuthentication(authentication_key, auth_token).then((result)=>{
        if(result){
          datastoreAPI.createNewGuessHubAuthenticate(auth_token, name, role, password).then((token)=>{
            let auth_token = token.auth_token;
            return resolve({status: 200, auth_token: auth_token});
          })
        }else{
          return resolve({status: 409, message: "Invalid credentials"});
        }
      })
    }else{
      return resolve({status: 500, message: "Invalid role"});
    }
  })
}

function deleteGuessAuthenticate(auth_token_admin, auth_token){
  return new Promise((resolve)=>{
    datastoreAPI.verifyGuessHubAuthenticationByTokenAndAdminToken(auth_token_admin, auth_token).then((result)=>{
      if(result){
        datastoreAPI.deleteGuessHubAuthenticationByTokenAndAdminToken(auth_token_admin, auth_token).then((token)=>{
          datastoreAPI.deleteHubAssociateFromAuthenticate(auth_token).then((query)=>{
            return resolve({status: 200, message: token.message});
          })
        })
      }else{
        return resolve({status: 403, message: "Invalid credentials"});
      }
    })
  })
}

function createHubUserGuessAssociation(auth_token, user_id, user_auth_token){
  return new Promise((resolve)=>{
    datastoreAPI.verifyGuessHubAuthenticationByToken(auth_token).then((result)=>{
      if(result.response){
        var roleUser = result.message;
        datastoreAPI.verifyHubUserAssociation(auth_token, user_auth_token).then((response)=>{
          if(response == 200){
            datastoreAPI.createNewRelationHubUser(auth_token, user_auth_token, roleUser).then((association)=>{
              resolve({status: 200, message: "Token registered successfuly"})
            })
          }else if(response == 409){
            resolve({status: 409, message: "This token is already in use"})
          }else{
            resolve({status: 404, message: "Invalid token"})

          }
        })
      }else{
        return resolve({status: 404, message: "Invalid token"});
      }
    })
  })
}

function deleteGuessAssociate(auth_token, user_id){
  return new Promise((resolve)=>{
    datastoreAPI.verifyHubUserAssociation(auth_token, user_id).then((result)=>{
      if(!result){
        datastoreAPI.deleteGuessHubAssociate(auth_token, user_id).then((token)=>{
          return resolve({status: 200, message: token.message});
        })
      }else{
        return resolve({status: 403, message: "Invalid credentials"});
      }
    })
  })
}

function getAllHubsByUser(user_id){
  return new Promise((resolve)=>{
    datastoreAPI.getAllHubsByUser(user_id).then((result)=>{
      return resolve({status: result.status, response: result.message});
    })
  })
}

function getAllAdminHubsByUser(user_id){
  return new Promise((resolve)=>{
    datastoreAPI.getAllAdminHubsByUser(user_id).then((result)=>{
      return resolve({status: result.status, response: result.message})
    })
  })
}

function getHubDataAdminUser(user_id){
  return new Promise((resolve)=>{
    datastoreAPI.getAllDataFromHubAdminUser(user_id).then((result)=>{
      return resolve({status: result.status, response: result})
    })
  })
}

function getAuthTokenAdminUserByGuess(guess_auth_token){
  return new Promise((resolve)=>{
    datastoreAPI.getGuessAuthTokenAdminByAuthToken(guess_auth_token).then((result)=>{
      if(result){

        datastoreAPI.getAdminAuthTokenAdminByAuthToken(result).then((data)=>{
          return resolve({status: 200, result: data})
        })
      }else{
        return resolve(null)

      }
    })
  })
}

function getHubDataGuess(user_id){
  return new Promise((resolve)=>{
    datastoreAPI.getAllDataFromHubGuess(user_id).then((result)=>{
      return resolve({status: result.status, response: result})
    })
  })
}

function deleteHubAdminUser(authentication_key, auth_token){
  return new Promise((resolve)=>{
    datastoreAPI.verifyHubAdminUser(authentication_key, auth_token).then((result)=>{
        if(result){
          datastoreAPI.deleteHubAdminUser(auth_token).then((data)=>{
            if(data.status == 200){
              datastoreAPI.deleteAdminAssociation(auth_token).then((response)=>{
                if(response.status == 200){
                  return resolve({status: 200, message:"Hub deleted successfully"})
                }else{
                  return resolve({status: 403, message:"Hub association not found"})
                }
              })
            }else{
              return resolve({status: 403, message:"Hub not found"})
            }
          })
        }else{
          return resolve({status: 403, message:"Invalid credentials"})
        }
      })
    })
}

exports.createAdminAuthenticate = createAdminAuthenticate;
exports.createGuessAuthenticate = createGuessAuthenticate;
exports.createHubUserGuessAssociation = createHubUserGuessAssociation;
exports.deleteGuessAssociate = deleteGuessAssociate;
exports.deleteGuessAuthenticate = deleteGuessAuthenticate;
exports.getAllHubsByUser = getAllHubsByUser;
exports.getHubDataAdminUser = getHubDataAdminUser;
exports.getHubDataGuess = getHubDataGuess;
exports.deleteHubAdminUser = deleteHubAdminUser;
exports.getAuthTokenAdminUserByGuess = getAuthTokenAdminUserByGuess;
exports.getAllAdminHubsByUser = getAllAdminHubsByUser;
