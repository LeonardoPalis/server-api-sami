var output = require('../../util/Output.js');
var validator = require('../validator.js');
import {LENGTH_PACKAGE_REQUES_IN} from '../../../constants.js';

function save(con, authentication_key, request){
  return new Promise((resolve)=>{
    let sqlTable = "INSERT INTO request_out (sensor_id, authentication_key, value, role, timeout, created_at) VALUES (\'" + request.sensor_id + "\', \'" + authentication_key + "\', \'" + request.value + "\' ,\'" + request.role + "\' ,\'" + request.timeout + "\' ,\'" +  new Date().toLocaleString().substring(0, 19).replace('T', ' ')  + "\')";
    con.query(sqlTable, function (err, result) {
      if (err) resolve({status: 500, message: "Something is wrong"});
      resolve({status: 200, message: "Request insert sucessfuly"});
    });
  })
}

function getRequestsByHub(con, hub_authenticate_key){
  return new Promise((resolve)=>{
    con.query("SELECT * FROM request_out WHERE authentication_key =\'" + hub_authenticate_key + "\' AND syncronized = 0 LIMIT " + LENGTH_PACKAGE_REQUES_IN, function (err, result, fields) {
      if (err){
        resolve([]);
      }else if(result.length > 0){
        resolve(result);
      }else{
        resolve([]);
      }
    });
  })
}

function setSyncronizedRequests(con, hub_authenticate_key){
  return new Promise((resolve)=>{
    console.log("QQ"+hub_authenticate_key)
    let sqlTable = "UPDATE request_out SET syncronized = 1 WHERE syncronized = 0 AND authentication_key =\'" + hub_authenticate_key + "\' LIMIT " + LENGTH_PACKAGE_REQUES_IN;
    con.query(sqlTable, function (err, result) {
      if (err) resolve({status: 500, message: "Something is wrong"});
      resolve({status: 200, results: result});
    });
  })
}

exports.save = save;
exports.getRequestsByHub = getRequestsByHub;
exports.setSyncronizedRequests = setSyncronizedRequests;
