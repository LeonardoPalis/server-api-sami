var output = require('../../util/Output.js');
var validator = require('../validator.js');

function setRequest(con, id, type, date_request, value){
  return new Promise((resolve, callbackError)=>{
    let sqlTable = "INSERT INTO request_in (id, type, date_request, value) VALUES (\'" + id + "\', \'" + type + "\' ,\'" + date_request + "\' ,\'" + value + "\')";
    validator.validatorRequestSensor(con, id).then((result)=>{
      if(result == 200){
        con.query(sqlTable, function (err, result) {
          if (err) callbackError(err);
          output.db("1 record inserted");
          resolve(200);
        });
      }else{
        resolve(403);
      }
    })
  })
}

function deleteElement(con, column){
  return new Promise((resolve, callbackError)=>{
    let sqlDrop = "DELETE FROM " + "request_in" + " WHERE id = \'" + column + "\'";
    con.query(sqlDrop, function (err, result) {
      if (err) {
        resolve(500);
        console.log(err);
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

function save(con, request){
  return new Promise((resolve)=>{
    validator.validatorRequestSensor(con, request.sensor_id, request.authentication_key).then((validate_sensor)=>{
      if(validate_sensor.status == 409){
        let sqlTable = "INSERT INTO request_in (sensor_id, authentication_key, value, role, timeout, created_at) VALUES (\'" + request.sensor_id + "\', \'" + request.authentication_key + "\', \'" + request.value + "\' ,\'" + request.role + "\' ,\'" + request.timeout + "\' ,\'" + request.created_at +"\')";
        con.query(sqlTable, function (err, result) {
          if (err) resolve({status: 500, message: "Something is wrong"});
          resolve({status: 200, message: "Request insert sucessfuly"});
        });
      }else{
        resolve({status: 401, message: "Sensor is not authenticate"});
      }
    })
  })
}

function getAllStatesSensor(con, data){
  return new Promise((resolve)=>{
    con.query("SELECT sensors.sensor_id, request_in.authentication_key, request_in.value, request_in.created_at, sensors.model FROM request_in JOIN sensors ON sensors.sensor_id = request_in.sensor_id  WHERE request_in.sensor_id =\'" + data.sensorId + "\' AND request_in.authentication_key = \'" + data.authentication_key + "\' ", function (err, result, fields) {
      console.log(err)
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, message: result});
      }else{
        resolve({status: 409, message: "Request not found"});
      }
    });
  })
}

function getCurrentStateSensor(con, data){
  return new Promise((resolve)=>{
    con.query("SELECT sensors.sensor_id, request_in.authentication_key, request_in.value, request_in.created_at, sensors.model FROM request_in JOIN sensors ON sensors.sensor_id = request_in.sensor_id  WHERE request_in.created_at = ( SELECT MAX(created_at) FROM request_in WHERE sensor_id =\'" + data.sensorId + "\' AND authentication_key = \'" + data.authentication_key + "\' )", function (err, result, fields) {
      console.log(err)
      if (err){
        resolve(404);
      }else if(result.length > 0){
        resolve({status: 200, message: result});
      }else{
        resolve({status: 210, message: "Request not found"});
      }
    });
  })
}



exports.setRequest = setRequest;
exports.deleteElement = deleteElement;
exports.save = save;
exports.getCurrentStateSensor = getCurrentStateSensor;
exports.getAllStatesSensor = getAllStatesSensor;
