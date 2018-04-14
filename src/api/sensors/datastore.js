var output = require('../../util/Output.js');
var validator = require('../validator.js');

function saveSensor(con, vId, vName, vRoute, vRole, vType, vHubId){
  return new Promise((resolve, callbackError)=>{
    validator.validatorCreateSensor(con, vId).then((result)=>{
      if(result == 403){
        let sqlTable = "INSERT INTO sensors (id, name, route, role, type, hub_id) VALUES (\'" + vId + "\', \'" + vName + "\' ,\'" + vRoute + "\' ,\'" + vRole + "\' ,\'" + vType + "\' ,\'" + vHubId + "\')";
        con.query(sqlTable, function (err, result) {
          if (err) resolve(404);
          output.db("1 record inserted");
          resolve(200);
        });
      }else{
        resolve(result);
      }
    })
  })
}

function createAuthSensors(con, type, auth_token){
  return new Promise((resolve, callbackError)=>{
      let sqlTable = "INSERT INTO sensor_auth (type, auth_token) VALUES (\'" + type + "\', \'" + auth_token + "\')";
      con.query(sqlTable, function (err, result) {
        if (err) resolve(404);
        output.db("1 record inserted");
        resolve(200);
      });
  })
}

function getAuthSensorsBySensorType(con, type){
  return new Promise((resolve, callbackError)=>{
    con.query("SELECT auth_token FROM sensor_auth WHERE type =\'" + type + "\'", function (err, result, fields) {
      if (err){
        resolve({status: 403});
      }else if(result.length > 0){
        resolve({status: 200, auth_token: result[0].auth_token});
      }else{
        resolve({status: 403});
      }
    });
  })
}

function getAllSensors(con, authentiation_hub){
  return new Promise((resolve, callbackError)=>{
    con.query("SELECT * FROM sensors WHERE hub_authentication_key =\'" + authentiation_hub + "\'", function (err, result, fields) {
      if (err){
        resolve({status: 403});
      }else if(result.length > 0){
        resolve({status: 200, auth_token: result[0]});
      }else{
        resolve({status: 403});
      }
    });
  })
}

function save(con, sensorId, sensorInf){
  return new Promise((resolve, callbackError)=>{
    validator.validatorRequestSensor(con, sensorId, sensorInf.hub_authentication_key).then((result)=>{
      if(result.status == 200){
        let sqlTable = "INSERT INTO sensors (sensor_id, hub_authenticate_key, name, route, role, type, con_auth_token, created_at, model) VALUES (\'" + sensorId + "\', \'" + sensorInf.hub_authentication_key + "\' ,\'" + sensorInf.name + "\' ,\'" + sensorInf.route + "\' ,\'" + sensorInf.role + "\' ,\'" + sensorInf.type + "\' ,\'" + sensorInf.con_auth_token
                        + "\' ,\'" + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\' ,\'" + sensorInf.model + "\')";
        con.query(sqlTable, function (err, result) {
          if (err) resolve({status: 404, message: "Something is wrong"});
          return resolve({status: 200, message: "Sensor registered sucessfuly"});
        });
      }else{
        return resolve({status: result.status, message: "This sensor is already registered for this hub", con_auth_token: result.con_auth_token});
      }
    })
  })
}

function deleteElement(con, column){
  return new Promise((resolve, callbackError)=>{
    let sqlDrop = "DELETE FROM " + "sensors" + " WHERE id = \'" + column + "\'";
    con.query(sqlDrop, function (err, result) {
      if (err) {
        resolve(500);
      }else{
        if(result.affectedRows > 0){
          resolve(200);
        }else{
          resolve(403);
        }
      }
    });
  })
}

function verifySensorWithHub(con, sensor_id, hub_authenticate_key){
  return new Promise((resolve)=>{
    con.query("SELECT created_at FROM sensors WHERE hub_authenticate_key =\'" + hub_authenticate_key + "\' AND sensor_id =\'" + sensor_id + "\'", function (err, result, fields) {
      if (err){
        resolve(false);
      }else if(result.length > 0){
        resolve(true);
      }else{
        resolve(false);
      }
    });
  })
}

function getSensorModel(con, id){
  return new Promise((resolve)=>{
    con.query("SELECT * FROM sensors_info WHERE id =\'" + id + "\'", function (err, result, fields) {
      console.log(err)
      if (err){
        resolve({status: 500, message: "Error finding model"});
      }else if(result.length > 0){
        console.log(result)
        resolve({status: 200, result: result[0] });
      }else{
        resolve({status: 404, message:"Model not found"});
      }
    });
  })
}

function getSensorValue(con, id){
  return new Promise((resolve)=>{
    con.query("SELECT * FROM sensors_value", function (err, result, fields) {
      if (err){
        resolve({status: 500, message: "Error finding sensors value"});
      }else if(result.length > 0){
        console.log(result[0])
        resolve({status: 200, result: result });
      }else{
        resolve({status: 404, message:"Sensors values not found"});
      }
    });
  })
}

exports.saveSensor = saveSensor;
exports.deleteElement = deleteElement;
exports.save = save;
exports.verifySensorWithHub = verifySensorWithHub;
exports.createAuthSensors = createAuthSensors;
exports.getAuthSensorsBySensorType = getAuthSensorsBySensorType;
exports.getAllSensors = getAllSensors;
exports.getSensorModel = getSensorModel;
exports.getSensorValue = getSensorValue;
