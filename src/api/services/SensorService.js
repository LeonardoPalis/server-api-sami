var datastoreAPI = require('../datastore.js');
var sha256 = require('sha256');
var harware = require('getmac')
import {UNIVERSAL_SENSOR_KEY} from "../../../constants.js";

function registerNewSensor(sensorId, auth, sensorInf){
  return new Promise((resolve) =>{
    datastoreAPI.validatorHubAdminUser(auth.authentication_key, auth.auth_token).then((validate)=>{
      if(validate){
        sensorInf["hub_authentication_key"] = auth.authentication_key;
        datastoreAPI.saveNewSensor(sensorId, sensorInf).then((result)=>{
          resolve(result);
        })
      }else{
        resolve({status: 401, message: "This hub is not authenticate"})
      }
    })
  })
}

function getSensorsByUser(auth){
  return new Promise((resolve) =>{
    datastoreAPI.validatorHubAdminUser(auth.authentication_key, auth.auth_token).then((validate)=>{
      if(validate){
        datastoreAPI.getAllSensorsByHub(auth.authentication_key).then((result)=>{
          resolve(result);
        })
      }else{
        resolve({status: 401, message: "This hub is not authenticate"})
      }
    })
  })
}

function getSensorsModel(id){
  return new Promise((resolve) =>{
    datastoreAPI.getSensorModel(id).then((model)=>{
      resolve({model});
    })
  })
}

function getSensorsValue(id){
  return new Promise((resolve) =>{
    datastoreAPI.getSensorValue().then((values)=>{
      resolve(values);
    })
  })
}


function authenticateNewSensor(sensorId, auth, sensorInf){
  return new Promise((resolve) =>{
    datastoreAPI.getHubAuthToken(auth.authentication_key, auth.psw).then((validate)=>{
      if(validate.status == 200){
        _hashGenerate().then((hashKey)=>{
          sensorInf["hub_authentication_key"] = auth.authentication_key;
          sensorInf["con_auth_token"] = hashKey;
          registerNewSensor(sensorId, {authentication_key: auth.authentication_key, auth_token: validate.auth_token}, sensorInf).then((result)=>{
            let response = {
              status: result.status,
              message: result.message
            }
            if(result.status == 200){
              response["con_auth_token"] = hashKey;
            }else if(result.status == 403){
              response["con_auth_token"] = result.con_auth_token;
            }
            resolve(response);
          }).catch(function(err, result){
            resolve({status: 500})
          });
        });
      }else{
        resolve({status: 401, message: "Invalid credentials"})
      }
    })
  })
}

function _hashGenerate(){
  return new Promise((resolve)=>{
    harware.getMac(function(err,macAddress){
      if (err)  throw err
      resolve(sha256(macAddress + new Date().getTime() + UNIVERSAL_SENSOR_KEY))
    })
  })
}

exports.registerNewSensor = registerNewSensor;
exports.authenticateNewSensor = authenticateNewSensor;
exports.getSensorsByUser = getSensorsByUser;
exports.getSensorsValue = getSensorsValue;
