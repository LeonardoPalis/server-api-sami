const express = require('express')
const app = express()
let bodyParser = require('body-parser')
let validator = require('./validator');
let datestore = require('./datastore');
let hubAPIService = require('./services/HubAPIService.js');
let sensorService = require('./services/SensorService.js');
let requestInService = require('./services/RequestInService.js');
import requestOutService from './services/RequestOutService.js';
import usersService from './services/UsersService';

var mysql = require('mysql');

app.use(function(req, res, next) { res.header('Access-Control-Allow-Origin', '*'); res.header('Access-Control-Allow-Origin', '*');  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token, auth-token, role, sensor-id'); next(); });
app.use(bodyParser.json());
app.use(express.static('build'));
var times = {}
var countingTimes = 0;

app.get('/', function (req, res) {
  res.send('Welcome SAMI API')

})

app.post('/sensors/', function (req, res) {
  datestore.validatorHubAdminUser(req.body["authentication_key"], req.body["auth_token"]).then((validate)=>{
    if(validate){
      datestore.getAllInTable("sensors", req.body["authentication_key"]).then((result)=>{
        res.status(200);
        res.send({status: 200, result: result});
      }).catch(function(err, result){
        res.status(500);
        res.send({status: 500, result: "Error finding sensors"});
      });
    }else{
      res.status(401);
      res.send({status: 401, result: "Invalid credentials"});
    }
  })
})

app.get('/sensors/model/:modelId', function (req, res) {
  let id = req.params["modelId"];
  let token = req.headers["x-access-token"];
  usersService.userValidation(token).then((validation)=>{

    if(validation){
      datestore.getSensorModel(id).then((model)=>{
        res.status(model.status);
        res.send(model);
      }).catch(function(err, result){
        res.status(500);
        res.send({status: 500, message: "Error finding models"});
      });
    }else{
      res.status(401);
      res.send({status: 401, message: "Invalid credentials"});
    }
  })
})

app.get('/sensors/byuser', function (req, res) {
  let token = req.headers["x-access-token"];
  let role = req.headers["role"];
  usersService.userValidation(token).then((validation)=>{
    if(validation){
      if(role == "guess"){
        hubAPIService.getAuthTokenAdminUserByGuess(req.headers["auth-token"]).then((data)=>{
          if(data && data.status == 200){
            datestore.verifyHubAuthentication(data.result).then((validate)=>{
              if(validate){
                datestore.getAllInTable("sensors", data.result).then((result)=>{
                  res.status(200);
                  res.send({status: 200, result: result});
                }).catch(function(err, result){
                  res.status(500);
                  res.send({status: 500, result: "Error finding sensors"});
                });
              }else{
                res.status(401);
                res.send({status: 401, result: "Invalid credentials"});
              }
            })
          }else{
            res.send({status: 403, result: "Not found"});
          }
        })
      }else{
        datestore.getAdminAuthTokenAdminByAuthToken(req.headers["auth-token"]).then((authenticationKey)=>{
          datestore.verifyHubAuthentication(authenticationKey).then((validate)=>{
            if(validate){
              datestore.getAllInTable("sensors",authenticationKey).then((result)=>{
                res.status(200);
                res.send({status: 200, result: result});
              }).catch(function(err, result){
                res.status(500);
                res.send({status: 500, result: "Error finding sensors"});
              });
            }else{
              res.status(401);
              res.send({status: 401, result: "Invalid credentials"});
            }
          })
        })
      }
    }else{
      res.status(401);
      res.send({response: "error", message: "User not authorized"});
    }
  })
})

app.post('/sensors/auth/register/:sensorId', function (req, res) {
  let sensorId = req.params["sensorId"];
  sensorService.authenticateNewSensor(sensorId, {authentication_key: req.body["authentication_key"], psw: req.body["psw"]}, {name: req.body["name"], model: req.body["model"], role: req.body["role"], type: req.body["type"] }).then((result)=>{
    res.status(result.status);
    res.send(result);
  }).catch(function(err, result){
    res.status(500);
    res.send(err);
  });
})

app.post('/users/sign_up', function (req, res) {

  usersService.signUp(req.body).then((result)=>{
    res.status(200);
    res.send({status: result.status, message: result.message});
  })
})

app.get('/requestin/byuser', function (req, res) {
  let token = req.headers["x-access-token"];
  let sensorId = req.headers["sensor-id"];
  let role = req.headers["role"];
  let authToken = req.headers["auth-token"];
  usersService.userValidation(token).then((validation)=>{
    if(validation){
      if(role == "guess"){
        hubAPIService.getAuthTokenAdminUserByGuess(authToken).then((data)=>{
          if(data && data.status == 200){
            datestore.verifyHubAuthentication(data.result).then((validate)=>{
              if(validate){
                datestore.getCurrentStateSensors({sensorId:sensorId, authentication_key: data.result }).then((result)=>{
                  res.status(200);
                  res.send({status: result.status, result: result});
                }).catch(function(err, result){
                  res.status(500);
                  res.send({status: 500, result: "Error finding sensors"});
                });
              }else{
                res.status(401);
                res.send({status: 401, result: "Invalid credentials"});
              }
            })
          }else{
            res.send({status: 409, result: "Not found"});
          }
        })
      }else{
        datestore.getAdminAuthTokenAdminByAuthToken(authToken).then((authenticationKey)=>{
          datestore.verifyHubAuthentication(authenticationKey).then((validate)=>{
            if(validate){

              datestore.getCurrentStateSensors({sensorId:sensorId, authentication_key: authenticationKey }).then((result)=>{
                res.status(result.status);
                res.send({status: result.status, result: result});
              }).catch(function(err, result){
                console.log(err)
                res.status(500);
                res.send({status: 500, result: "Error finding sensors"});
              });
            }else{
              res.status(401);
              res.send({status: 401, result: "Invalid credentials"});
            }
          })
        })
      }

    }else{
      res.status(401);
      res.send({response: "error", message: "User not authorized"});
    }
  })
})

app.post('/users/sign_in', function (req, res) {

  usersService.signIn(req.body).then((result)=>{
    res.status(200);
    res.send({status: result.status, message: result.message, auth_token: result.auth_token, user: {name: result.user.name, email: result.user.email, created_at:result.user.created_at  }});
  })
})

app.post('/sensors/:sensorId', function (req, res) {
  let sensorId = req.params["sensorId"];
  sensorService.registerNewSensor(sensorId, {authentication_key: req.body["authentication_key"], auth_token: req.body["auth_token"]}, req.body["sensor"]).then((result)=>{
    res.status(result.status);
    res.send({status: result.status, message: result.message});
  }).catch(function(err, result){
    res.status(500);
    res.send(err);
  });
})

app.post('/hubtoken/:authentication_key', function (req, res) {
  let authentication_key = req.params["authentication_key"];
  var list = datestore.getHubAuthToken(authentication_key, req.body["data"]["psw"]).then(function(result){
    res.send(result);
  }).catch(function(err, result){
    res.status(500);
    res.send(err);
  });
})

app.post('/hub/:hubId', function (req, res) {
  let hubId = req.params["hubId"];
  datestore.createHub(hubId, req.body["data"]["password"],req.body["data"]["user_id"], req.body["data"]["value"]
                             , req.body["data"]["authentication_key"]).then((result)=>{
    res.status(result);
    let response = getResponse(result);
    if(result == 200){
      res.send({"sensorId": sensorId, "result": response});
      //CALL HERE API
    }else{
      res.send({"error":response});
    }
  })
})

app.post('/requestin/', function (req, res) {

  const auth = {authentication_key: req.body["authentication_key"], auth_token: req.body["auth_token"]}
  requestInService.registerNewRequestIn(auth,req.body["data"]).then((result)=>{
    res.status(result.status);
    res.send({status: result.status, result: result.message});
  });
})

app.post('/requestout/', function (req, res) {
  const auth = {hub_auth_token: req.body["hub_auth_token"], user_auth_token: req.body["user_auth_token"]}
  requestOutService.registerNewRequestOut(auth,req.body["data"]).then((result)=>{
    res.status(result.status);
    res.send({status: result.status, result: result.message});
  });
})

app.get('/requestout/:authentication_key', function (req, res) {
  const auth = {hub_authenticate_key: req.params["authentication_key"], hub_auth_token: req.headers["auth_token"]};
  requestOutService.getRequestsByHub(auth).then((result)=>{
    res.status(result.status);
    res.send({status: result.status, requests: result.requests});
  });
})

app.get('/sensors/values', function (req, res) {
  let token = req.headers["x-access-token"];
  usersService.userValidation(token).then((validation)=>{
    if(validation){
      sensorService.getSensorsValue().then((data)=>{
        res.status(data.status);
        res.send(data);
      });
    }else{
      res.status(401);
      res.send({status: 401, message: "User not authorized"});

    }
  });
})


app.post('/authenticationhub/:authentication_key', function (req, res) {
  let token = req.headers["x-access-token"];
  usersService.userValidation(token).then((validation)=>{
    if(validation){
      let authentication_key = req.params["authentication_key"];
      datestore.getUserIdByAuthToken(token).then((userId)=>{
        let result = hubAPIService.createAdminAuthenticate(authentication_key, req.body["data"]["name"], req.body["data"]["password"], userId ).then((result)=>{
          res.status(result.status);
          res.send({status: result.status, message: result.message, auth_token: result.auth_token});

        });
      });
    }else{
      res.status(401);
      res.send({status: 401, message: "User is not authenticate"});
    }
  });
})

app.post('/authenticationguesshub/:authentication_key', function (req, res) {
  let token = req.headers["x-access-token"];
  usersService.userValidation(token).then((validation)=>{
    if(validation){
      let authentication_key = req.params["authentication_key"];
      let result = hubAPIService.createGuessAuthenticate(authentication_key, req.body["data"]["auth_token"], req.body["data"]["name"], req.body["data"]["role"], req.body["data"]["password"] ).then((result)=>{
        res.status(result.status);
        if(result.status == 200){
          res.send({status: result.status, auth_token: result.auth_token});
        }else{
          res.send({status: result.status, message: result.message});
        }
      });
    }else{
      res.status(401);
      res.send({status: 401, message: "User is not authenticate"});
    }
  })
})

app.delete('/guesshub/', function (req, res) {
  hubAPIService.deleteGuessAuthenticate(req.body["data"]["auth_token_admin"], req.body["data"]["auth_token"]).then((result)=>{
      res.status(result.status);
      if(result == 200){
        res.send({response: "ok", result: result.message});
      }else{
        res.send({response: "error", result: result.message});

      }
  })
})

app.post('/guesshubassociation/', function (req, res) {
  usersService.userValidation(req.headers["x-access-token"]).then((validation)=>{
    if(validation){
      datestore.getUserIdByAuthToken(req.body["data"]["user_auth_token"]).then((userId)=>{
        let result = hubAPIService.createHubUserGuessAssociation(req.body["data"]["auth_token"], userId, userId ).then((result)=>{
          if(result.status == 200){
            res.status(result.status);
            res.send({status: result.status, message: result.message});
          }else{
            res.status(result.status);
            res.send({status: result.status, message: result.message});
          }
        });
      })
    }else{
      res.status(401);
      res.send({response: "error", message: "User not authorized"});
    }
  })
})

app.delete('/guesshubassociation/:user_id', function (req, res) {
  let user_id = req.params["user_id"];
  hubAPIService.deleteGuessAssociate(req.body["data"]["auth_token"], user_id).then((result)=>{
      res.status(result.status);
      if(result == 200){
        res.send({response: "ok", result: result.message});
      }else{
        res.send({response: "error", result: result.message});

      }
  })
})

app.get('/hubtokens/guess', function (req, res) {
  let token = req.headers["x-access-token"];
  usersService.userValidation(token).then((validation)=>{
    if(validation){
      datestore.getUserIdByAuthToken(token).then((userId)=>{
        let result = hubAPIService.getAllHubsByUser(userId).then((result)=>{
          if(result.status == 200){
            res.status(result.status);
            res.send({status:result.status,  response: "ok", results: result.response});
          }else{
            res.status(403);
            res.send({status: 403,response: "error", message: "No data for this key"});
          }
        });
      })
    }else{
      res.status(401);
      res.send({status: 401, response: "error", message: "User not authorized"});
    }
  })
})

app.get('/hubtokens/admin', function (req, res) {
  let token = req.headers["x-access-token"];
  usersService.userValidation(token).then((validation)=>{
    if(validation){
      datestore.getUserIdByAuthToken(token).then((userId)=>{
        let result = hubAPIService.getAllAdminHubsByUser(userId).then((result)=>{
          if(result.status == 200){
            res.status(result.status);
            res.send({status:result.status,  response: "ok", results: result.response});
          }else{
            res.status(403);
            res.send({status: 403,response: "error", message: "No data for this key"});
          }
        });
      })
    }else{
      res.status(401);
      res.send({status: 401, response: "error", message: "User not authorized"});
    }
  })
})

app.post('/adminhub', function (req, res) {
  let auth_token = req.body["data"]["auth_token"];

  let result = hubAPIService.getHubDataAdminUser(auth_token).then((result)=>{
    res.status(result.status);
    if(result.status == 200){
      res.send({response: "ok", results: result.response.message});
    }else{
      res.send({response: "error", message: "Hub not found"});
    }
  });
})

app.post('/adminguess', function (req, res) {
  let auth_token = req.body["data"]["auth_token"];
  let result = hubAPIService.getHubDataGuess(auth_token).then((result)=>{
    res.status(result.status);
    if(result.status == 200){
      res.send({response: "ok", results: result.response.message});
    }else{
      res.send({response: "error", message: "Hub not found"});
    }
  });
})

app.delete('/hubadmin/:authentication_key', function (req, res) {
  let authentication_key = req.params["authentication_key"];

  hubAPIService.deleteHubAdminUser(authentication_key, req.body["data"]["auth_token"]).then((result)=>{
      res.status(result.status);
      if(result == 200){
        res.send({response: "ok", result: result});
      }else{
        res.send({response: "error", result: result});

      }
  })
})


let port = process.env.PORT || 4000;

app.set('port', port);

app.listen(4000, function () {
  console.log('Listening on port 4000!')
})

function getResponse(code){
  switch (code) {
    case 200:
      return "Ok";
    case 400:
      return "Please, make sure the hours on your device are set up correctly";
    case 403:
      return "This object are not registered";
    case 409:
      return "This id is already registered"
    default:
      return "Somithing is wrong";
  }
}
