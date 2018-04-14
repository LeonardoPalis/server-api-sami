var datastore = require('../datastore.js');

class RequestOutService{

  registerNewRequestOut(authenticate, request){
    return new Promise((resolve)=>{


      datastore.getUserIdByAuthToken(authenticate.user_auth_token).then((userId)=>{
        if(userId){
          datastore.getRoleOfUser(userId, authenticate.hub_auth_token).then((role)=>{
            if(role){
              if(role == "admin"){
                datastore.getAdminAuthTokenAdminByAuthToken( authenticate.hub_auth_token).then((authentication_key)=>{
                  datastore.verifySensorWithHub(request.sensor_id, authentication_key).then((sensorValidade)=>{
                    if(sensorValidade){
                       this._validRequest(authentication_key,request).then((result)=>{
                         resolve(result);
                       })
                    }else{
                      return resolve({status: 401, message: "This sensor dont exists for this hub"});
                    }
                  })
                })
              }else if(role == "smp_user" || role == "user"){
                 datastore.getGuessAuthTokenAdminByAuthToken(authenticate.hub_auth_token).then((admin_hub_user)=>{
                   datastore.getAdminAuthTokenAdminByAuthToken(admin_hub_user).then((authentication_key)=>{
                     datastore.verifySensorWithHub(request.sensor_id, authentication_key).then((sensorValidade)=>{
                       if(sensorValidade){
                          this._validRequest(authentication_key,request).then((result)=>{
                            resolve(result);
                          })
                       }else{
                         return resolve({status: 401, message: "This sensor dont exists for this hub"});
                       }
                     })
                   })
                 })

              }
            }else{
              return resolve({status: 401, message: "This user dont have permission to access this hub"});
            }
          })
        }else{
          return resolve({status: 401, message: "Invalid credentials"});
        }
      })

    })
  }

  _validRequest(authentication_key, request){
    return new Promise((resolve)=>{
      datastore.setNewRequestOut(authentication_key, request).then((result)=>{
        return resolve({status: result.status, message: result.message});
      })
    })
  }

  getRequestsByHub(authenticate){
    return new Promise((resolve)=>{
      datastore.validatorHubAdminUser(authenticate.hub_authenticate_key, authenticate.hub_auth_token).then((validate)=>{
        if(validate){
          datastore.getRequestsByHub(authenticate.hub_authenticate_key).then((requests)=>{
             datastore.setSyncronizedRequests(authenticate.hub_authenticate_key).then((syncronized)=>{
               if(syncronized){
                return resolve({status: 200, requests: requests})
               }else{
                 return resolve({status: 500, requests: "Something is wrong"})
               }
             })
          })
        }else{
          return resolve({status: 401, requests: "Invalid credentials"})
        }
      })
    })
  }
}

export default new RequestOutService();
