var datastore = require('../datastore.js');

function registerNewRequestIn(authenticate, requests){
  return new Promise((resolve)=>{
    datastore.validatorHubAdminUser(authenticate.authentication_key, authenticate.auth_token).then((authentication)=>{

      if( authentication ){
        requests.forEach((request)=>{
          datastore.setNewRequestIn({sensor_id: request.sensor_id, authentication_key: authenticate.authentication_key, timeout: request.timeout, value: request.value
            ,role: request.role, created_at: request.created_at}).then((result)=>{
              return resolve({status: result.status, message: result.message});
            })
        })
      }else{
        return resolve({status: 401, message: "This hub is not authenticate"});
      }
    })
  })
}

exports.registerNewRequestIn = registerNewRequestIn;
