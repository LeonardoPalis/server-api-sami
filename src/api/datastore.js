var mysql = require('mysql');
var output = require('../util/Output.js');
var datastoreSensors = require('./sensors/datastore.js');
var datastoreRequestIn = require('./request_in/datastore.js');
var datastoreRequestOut = require('./request_out/datastore.js');
var datastoreHub = require('./hubs/datastore.js');
var datastoreTest = require('./test.js');
import datastoreUsers from './users/datastore.js';
var constants = require('../../constants.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var con = mysql.createConnection({
  host: "localhost",
  user: global.DATABASE_USER,
  password: global.DATABASE_PSW
});

con.connect(function(err) {
  try {
    con.query("CREATE DATABASE " + global.DATABASE_NAME, function (err, result) {
      if (err.code == "ER_DB_CREATE_EXISTS") {
        con = setDatatable();
        startTables();
        output.sys("DATABASE CREATED", "OK");
        output.sys("DATABASE SET IN " + global.DATABASE_NAME, "OK");
      }else if(err){
        console.error(err);
      }else{
        startTables();
        output.sys("DATABASE CREATED", "OK");
      }
    });
  } catch (err) {
      console.log(err);
  }
});

function setDatatable(){
  return con = mysql.createConnection({
    host: "localhost",
    user: global.DATABASE_USER,
    password: global.DATABASE_PSW,
    database: global.DATABASE_NAME
  });
}

function startTables(){
    //var sensors = "CREATE TABLE sensors (id VARCHAR(255), name VARCHAR(255), route VARCHAR(255), role VARCHAR(255), type VARCHAR(255), hub_id VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME)";
    //var users = "CREATE TABLE users (name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME) ";
    //var request_in = "CREATE TABLE request_in (id VARCHAR(255), type VARCHAR(255), date_request DATETIME, value VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME)";
    //var hubs = "CREATE TABLE hubs (id VARCHAR(255), password VARCHAR(255), user_id VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME, value VARCHAR(255), authentication_key VARCHAR(255)) ";
    var authentiation_hub = "CREATE TABLE authentiation_hub (authentication_key VARCHAR(255), auth_token VARCHAR(255), password VARCHAR(255), name VARCHAR(255), user_id VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME) ";
    var tokens_hub = "CREATE TABLE tokens_hub (authentication_key VARCHAR(255), auth_token VARCHAR(255), role VARCHAR(255), password VARCHAR(255), name VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME) ";
    var tokens_guess_hub = "CREATE TABLE tokens_guess_hub (auth_token_admin VARCHAR(255), auth_token VARCHAR(255), role VARCHAR(255), password VARCHAR(255), name VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME) ";
    var relations_hub_user = "CREATE TABLE relations_hub_user (auth_token VARCHAR(255), user_id VARCHAR(255),  role VARCHAR(255), created_at DATETIME, deleted_at DATETIME, updated_at DATETIME) ";
    var request_in = "CREATE TABLE request_in (sensor_id VARCHAR(255), authentication_key VARCHAR(255), value INT, role VARCHAR(255), timeout VARCHAR(255), created_at DATETIME)  ";
    var request_out = "CREATE TABLE request_out (sensor_id VARCHAR(255), authentication_key VARCHAR(255), value INT, role VARCHAR(255), timeout VARCHAR(255), syncronized BOOLEAN DEFAULT 0, created_at DATETIME)  ";
    var sensors = "CREATE TABLE sensors (sensor_id VARCHAR(255), model VARCHAR(255), hub_authenticate_key VARCHAR(255),  name VARCHAR(255), route VARCHAR(255), role VARCHAR(255), type VARCHAR(255), con_auth_token VARCHAR(255), created_at DATETIME, deleted_at DATETIME)";
    var users =  "CREATE TABLE users (name VARCHAR(255),  encrypted_password VARCHAR(255), email VARCHAR(255) NOT NULL PRIMARY KEY, role VARCHAR(255), created_at DATETIME, delete,d_at DATETIME)";
    var sensor_auth =  "CREATE TABLE sensor_auth (type VARCHAR(255), auth_token VARCHAR(255))";
    var sensors_info =  "CREATE TABLE sensors_info (id VARCHAR(255), model VARCHAR(255), description VARCHAR(255), role VARCHAR(255), type VARCHAR(255), created_at DATETIME)";
    var sensors_value =  "CREATE TABLE sensors_value (sensor_model VARCHAR(255), value INT, title VARCHAR(255), created_at DATETIME)";
    var authenticate_users =  "CREATE TABLE authenticate_users (user_id VARCHAR(255),  auth_token VARCHAR(255), created_at DATETIME, deleted_at DATETIME)";
    var alter_sensors_info = "ALTER table sensors add column (model VARCHAR(255));"
    //addColumn(alter_sensors_value);
    //createTable(sensors_info, "sensors_info");
    //createTable(sensors_value, "sensors_value");
    // createSensorModel("S@S001A", "Presence room - Model v1 - 2017", "Este sensor tem a finalidade de alertar quando detectar presença no ambiente", "sensor", "super" )
    // createSensorModel("S@A101X", "Lighting control - Model v1 - 2017", "Este atuador tem a finalidade de controlar a iluminação do ambiente", "actuator", "normal" )
    // createTable(authenticate_users, "authenticate_users");
    // createTable(hubs, "hubs");
    //createTable(sensors, "sensors");
    //createTable(sensors_value, "sensors_value");
     //createSensorValue("S@A101X", "Ligar luz", 11000)
     //createSensorValue("S@A101X", "Desligar luz", 11001)
     //createSensorValue("S@S001A", "Movimentação detectada", 10000)
     //createTable(sensor_auth, "sensor_auth");
    //createTable(request_in, "request_in");
    //createTable(tokens_guess_hub, "tokens_guess_hub");
    //createTable(relations_hub_user, "relations_hub_user");
   //  createTable(users, "users");
   //createTable(request_out, "request_out");
    //createTable(tokens_hub, "tokens_hub");
      // datastoreTest.popDatabase(con);
      //datastoreSensors.createAuthSensors(con, "1234","SJLKSJLKJDHJDHDJHJS")
      // let sqlTable = "UPDATE customers SET address = 'Canyon 123' WHERE address = 'Valley 345'";
      // con.query(sqlTable, function (err, result) {
      //   if (err){
      //     output.db("ERROR - Insert model");
      //   }else{
      //     output.db("Insert model successfuly");
      //   }
      // });
}

function createSensorModel(id, model, description, role, type){
  let sqlTable = "INSERT INTO sensors_info (id, model, description, type, role, created_at) VALUES (\'" + id + "\', \'" + model +  "\', \'" + description +  "\', \'" + role + "\', \'" + type +  "\', \'" + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\')";

  con.query(sqlTable, function (err, result) {
    if (err){
      output.db("ERROR - Insert model");
    }else{
      output.db("Insert model successfuly");
    }
  });
}

function createSensorValue(sensor_model, title, value){
  let sqlTable = "INSERT INTO sensors_value (sensor_model, title, value, created_at) VALUES (\'" + sensor_model + "\', \'" + title + "\', \'" + value + "\', \'" + new Date().toLocaleString().substring(0, 19).replace('T', ' ') + "\')";
  con.query(sqlTable, function (err, result) {
    if (err){
      output.db("ERROR - Insert model");
    }else{
      output.db("Insert model successfuly");
    }
  });
}

function addColumn(query){

  con.query(query, function (err, result) {
    if (err){
      output.db(err);
    }else{
      output.db("Insert column successfuly");
    }
  });
}

function userSignUp(user){
  return datastoreUsers.signUp(con, user)
}

function userSignIn(user){
  return datastoreUsers.signIn(con, user)
}

function deleteSensor(tableName, column){
  return datastoreSensors.deleteElement(con, column);
}

function getSensorModel(id){
  return datastoreSensors.getSensorModel(con, id);
}

function saveSensor(vId, vName, vRoute, vRole, vType, vHubId){
  return datastoreSensors.saveSensor(con, vId, vName, vRoute, vRole, vType, vHubId);
}

function getAuthSensorsBySensorType(type){
  return datastoreSensors.getAuthSensorsBySensorType(con,type);
}

function saveNewSensor(sensorId, sensorInf){
  return datastoreSensors.save(con, sensorId, sensorInf);
}

function verifySensorWithHub(sensor_id, hub_authentication_key){
  return datastoreSensors.verifySensorWithHub(con, sensor_id, hub_authentication_key);
}

function createHub(id, password, user_id, value, authentication_key, created_at){
  return datastoreHub.createHub(con, id, password, user_id, value, authentication_key, created_at);
}

function deleteAllSensorsInHub(){
  return datastoreSensors.deleteAllSensorsInHub();
}

function getAllSensorsByHub(authentication_key){
  return datastoreSensors.getAllSensors(con, authentication_key);
}

function verifyHubAuthentication(authentication_key){
  return datastoreHub.isAuthenticate(con, authentication_key);
}

function getHubAuthToken(authentication_key, psw){
  return datastoreHub.getToken(con, authentication_key, psw);
}

function verifyGuessHubAuthentication(authentication_key, auth_token){
  return datastoreHub.isGuessAuthenticate(con, authentication_key, auth_token);
}

function verifyGuessHubAuthenticationByTokenAndAdminToken(auth_token_admin, auth_token){
  return datastoreHub.isGuessAuthenticateByTokenAndAdminToken(con, auth_token_admin, auth_token);
}

function verifyGuessHubAuthenticationByToken(auth_token){
  return datastoreHub.isGuessAuthenticateByToken(con, auth_token);
}

function deleteGuessHubAuthenticationByTokenAndAdminToken(auth_token_admin, auth_token){
  return datastoreHub.deleteGuessHub(con, auth_token_admin, auth_token);
}

function deleteGuessHubAssociate(auth_token, user_id){
  return datastoreHub.deleteGuessHubAssociate(con, auth_token, user_id);
}

function setRequest(id, type, date_request, value){
  return datastoreRequestIn.setRequest(con, id, type, date_request, value);
}

function setNewRequestIn(request){
  return datastoreRequestIn.save(con, request);
}

function setNewRequestOut(authentication_key, request){
  return datastoreRequestOut.save(con, authentication_key, request);
}

function setSyncronizedRequests(hub_authenticate_key){
  return datastoreRequestOut.setSyncronizedRequests(con,hub_authenticate_key);
}

function getRequestsByHub(authentication_key){
  return datastoreRequestOut.getRequestsByHub(con, authentication_key);
}

function validatorHubAdminUser(authentication_key, auth_token){
  return datastoreHub.verifyAdminUser(con, authentication_key, auth_token);
}

function verifyUserAuthenticate(authentication_key, auth_token){
  return datastoreUsers.verifyUserAuthenticate(con, authentication_key, auth_token);
}

function getUserIdByAuthToken(auth_token){
  return datastoreUsers.getUserIdByAuthToken(con, auth_token);
}

function getRoleOfUser(user_id, hub_auth_token){
  return datastoreHub.getRoleOfUser(con, user_id, hub_auth_token);
}

function deleteRequest(tableName, column){
  return datastoreRequestIn.deleteElement(con, column);
}

function createNewAdminHubAuthenticate(authentication_key, name, password){
  return datastoreHub.authenticateNewHub(con, authentication_key, name, password);
}

function getGuessAuthTokenAdminByAuthToken(auth_token){
  return datastoreHub.getGuessAuthTokenAdminByAuthToken(con, auth_token);
}

function getAdminAuthTokenAdminByAuthToken(auth_token){
  return datastoreHub.getAdminAuthTokenAdminByAuthToken(con, auth_token);
}


function createNewGuessHubAuthenticate(auth_token, name, role, password){
  return datastoreHub.authenticateNewGuessHub(con, auth_token, name, role, password);
}


function createNewRelationHubUser(auth_token, user_id, role){
  return datastoreHub.relationateHubUser(con, auth_token, user_id, role);
}

function verifyHubUserAssociation(auth_token, user_id){
  return datastoreHub.isAssociateHubUser(con, auth_token, user_id);
}

function getAllHubsByUser(user_id){
  return datastoreHub.filterAllHubsByUser(con, user_id);
}

function getAllAdminHubsByUser(user_id){
  return datastoreHub.filterAllAdminHubsByUser(con, user_id);
}


function getAllDataFromHubAdminUser(auth_token){
  return datastoreHub.getDataAdminUser(con, auth_token);
}

function getAllDataFromHubGuess(auth_token){
  return datastoreHub.getDataGuess(con, auth_token);
}

function deleteHubAssociateFromAuthenticate(auth_token){
  return datastoreHub.deleteAssociateByAuthToken(con, auth_token);
}

function verifyHubAdminUser(authentication_key, auth_token){
  return datastoreHub.verifyAdminUser(con, authentication_key, auth_token);
}

function deleteHubAdminUser(auth_token){
  return datastoreHub.deleteAdminHub(con, auth_token);
}

function deleteAdminAssociation(auth_token){
  return datastoreHub.deleteAdminAssociation(con, auth_token);
}

function getCurrentStateSensors(sensor){
  return datastoreRequestIn.getCurrentStateSensor(con, sensor);
}

function getSensorValue(){
  return datastoreSensors.getSensorValue(con);
}

function createTable(sqlTable, tableName){
  con.query(sqlTable, function (err, result) {
    console.log(err)
    if(err){
      rl.question('Table ' + tableName + ' is already created. Do you wanna drop to update (Y/n)? ', (response) => {
        existsDatatable(response, tableName, sqlTable);
        rl.close();
      });
    }else{
      output.sys("CREATING DATATABLE " + tableName, "OK");
    }
  });
}

function dropTable(table, update, sqlTable){
  var sql = "DROP TABLE " + table;
  con.query(sql, function (err, result) {
    if (err){
      output.db("Is not possible delete table " + table);
    }else{
      output.db("Table " + table + " deleted");
      if(update){
        createTable(sqlTable, table);
      }
    }
  });
}

function insertInTable(tableName, sqlTable){
  con.connect(function(err) {
    if (err) throw err;
    con.query(sqlTable, function (err, result) {
      if (err) throw err;
      output.db("1 record inserted");
    });
  });
}

function getAllInTable(tableName, authentication_key){
  return new Promise((resolve, callbackError)=>{
    con.query("SELECT * FROM " + tableName + " WHERE hub_authenticate_key =\'" + authentication_key + "\'", function (err, result, fields) {
      if (err) callbackError(err);
      resolve(result);
    });
  })
}


function existsDatatable(response, table, sqlTable){
  switch (response) {
    case 'Y':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'y':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'yes':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'YES':
        output.db("Dropping datatable...");
        dropTable(table,true,sqlTable);
      break;
    case 'n':
        output.db("Database was not created!");
      break;
    case 'N':
        output.db("Database was not created!");
      break;
    case 'no':
      output.db("Database was not created!");
      break;
    case 'NO':
        output.db("Database was not created!");
      break;
    default:
      output.sys("Command not found", "IGNORED");
    break;
  }
}

exports.getAllInTable = getAllInTable;
exports.saveSensor = saveSensor;
exports.deleteSensor = deleteSensor;
exports.setRequest = setRequest;
exports.deleteRequest = deleteRequest;
exports.verifyHubAuthentication = verifyHubAuthentication;
exports.createNewAdminHubAuthenticate = createNewAdminHubAuthenticate;
exports.createNewRelationHubUser = createNewRelationHubUser;
exports.verifyGuessHubAuthentication = verifyGuessHubAuthentication;
exports.createNewGuessHubAuthenticate = createNewGuessHubAuthenticate;
exports.verifyGuessHubAuthenticationByTokenAndAdminToken = verifyGuessHubAuthenticationByTokenAndAdminToken;
exports.deleteGuessHubAuthenticationByTokenAndAdminToken = deleteGuessHubAuthenticationByTokenAndAdminToken;
exports.verifyHubUserAssociation = verifyHubUserAssociation;
exports.verifyGuessHubAuthenticationByToken = verifyGuessHubAuthenticationByToken;
exports.deleteGuessHubAssociate = deleteGuessHubAssociate;
exports.getAllHubsByUser = getAllHubsByUser;
exports.getAllDataFromHubAdminUser = getAllDataFromHubAdminUser;
exports.getAllDataFromHubGuess = getAllDataFromHubGuess;
exports.deleteHubAssociateFromAuthenticate = deleteHubAssociateFromAuthenticate;
exports.verifyHubAdminUser = verifyHubAdminUser;
exports.deleteHubAdminUser = deleteHubAdminUser;
exports.deleteAdminAssociation = deleteAdminAssociation;
exports.getHubAuthToken = getHubAuthToken;
exports.setNewRequestIn = setNewRequestIn;
exports.saveNewSensor = saveNewSensor;
exports.validatorHubAdminUser = validatorHubAdminUser;
exports.userSignUp = userSignUp;
exports.userSignIn = userSignIn;
exports.setNewRequestOut = setNewRequestOut;
exports.getUserIdByAuthToken = getUserIdByAuthToken;
exports.getRoleOfUser = getRoleOfUser;
exports.getGuessAuthTokenAdminByAuthToken = getGuessAuthTokenAdminByAuthToken;
exports.getAdminAuthTokenAdminByAuthToken = getAdminAuthTokenAdminByAuthToken;
exports.verifySensorWithHub = verifySensorWithHub;
exports.getRequestsByHub = getRequestsByHub;
exports.setSyncronizedRequests = setSyncronizedRequests;
exports.getAuthSensorsBySensorType = getAuthSensorsBySensorType;
exports.getAllSensorsByHub = getAllSensorsByHub;
exports.getAllAdminHubsByUser = getAllAdminHubsByUser;
exports.getSensorModel = getSensorModel;
exports.getCurrentStateSensors = getCurrentStateSensors;
exports.getSensorValue = getSensorValue;
