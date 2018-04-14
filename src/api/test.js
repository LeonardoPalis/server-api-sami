function createNewAuthenticationHub(con, key){
  return new Promise((resolve, callbackError)=>{
    let sqlTable = "INSERT INTO authentiation_hub (authentication_key, created_at ) VALUES (\'" + key + "\', \'" + new Date() + "\')";
    con.query(sqlTable, function (err, result) {
      if (err) callbackError(err);
      console.log("1 record inserted");
    });
  })
}

function createSensors(con, id, name, role, route, type, hub_id, created_at){
  return new Promise((resolve, callbackError)=>{
    let sqlTable = "INSERT INTO sensors (id, name, route, role, type, hub_id, created_at ) VALUES (\'" + id + "\', \'" + name +  "\', \'" + role +  "\', \'" + route +  "\', \'" + type +  "\', \'" + hub_id +  "\', \'"  + created_at + "\')";
    con.query(sqlTable, function (err, result) {
      if (err) callbackError(err);
      console.log("1 record inserted");
    });
  })
}

function createHubToken(con, authentication_key, auth_token, role, password){
  return new Promise((resolve, callbackError)=>{
    let sqlTable = "INSERT INTO tokens_hub (authentication_key, auth_token, role, password, created_at) VALUES (\'" + authentication_key + "\', \'" + auth_token +  "\', \'" + role +  "\', \'" + password +  "\', \'"  + new Date() + "\')";
    con.query(sqlTable, function (err, result) {
      if (err) callbackError(err);
      console.log("1 record inserted");
    });
  })
}
function createHubs(con, id, password, user_id, value, authentication_key){
  return new Promise((resolve, callbackError)=>{
    let sqlTable = "INSERT INTO hubs (id, password, user_id, value, authentication_key, created_at ) VALUES (\'" + id + "\', \'" + password +  "\', \'" + user_id +  "\', \'" + value +  "\', \'" + authentication_key +  "\', \'"  + new Date() + "\')";
    con.query(sqlTable, function (err, result) {
      if (err) callbackError(err);
      console.log("1 record inserted");
    });
  })
}

function popDatabase(con){
  // createSensors(con, "B406AC52214949B8B529A476DFC920D2", "Window", "adm", "192.0.0.0",  "PAS", "ADAD2AB5D835420FB42DCA45B9EDF2F0", new Date());
  // createSensors(con, "C0BD9C9809E04E7E9E0187EF535D4378", "Door", "adm", "192.0.0.1", "PAS", "8CB32B85C7E84892A55395320D86D551", new Date());
  // createSensors(con, "BB2FD8F153CD44A2A62070597C9DE466", "Room", "adm", "192.0.0.2", "PAS", "495B9C5A35FA43CB94675F98055923B3", new Date());
  // createSensors(con, "428AB8D678BC48F1B58DBAC564268ADA", "Garden", "adm", "192.0.0.3", "PAS", "FE72E21635344C3BA48788280EF82B77", new Date());
  //
  // createNewAuthenticationHub(con, "ADAD2AB5D835420FB42DCA45B9EDF2F0");
  // createNewAuthenticationHub(con, "422262052086471FAEDB7587792125FE");
  // createNewAuthenticationHub(con, "8CB32B85C7E84892A55395320D86D551");
  // createNewAuthenticationHub(con, "1D9760CA78CF4080963EB417C16731F0");
  // createNewAuthenticationHub(con, "495B9C5A35FA43CB94675F98055923B3");
  // createNewAuthenticationHub(con, "3DFB8146F6ED4BBB96BEE5875A8EFE76");
  // createNewAuthenticationHub(con, "98EE829F01D54BA9B3DF3491A3163763");
  // createNewAuthenticationHub(con, "FE72E21635344C3BA48788280EF82B77");
  // createNewAuthenticationHub(con, "9354B1CABCB84AFCA935B0E9BB3DD1A5");
  //
  // createHubs(con, "920FE536477040F6BA0D08C55562B4B5", "123123", "1", "0", "ADAD2AB5D835420FB42DCA45B9EDF2F0", new Date());
  // createHubs(con, "2F4C5CF1627F472B952AF929266B0621", "123123", "2", "1", "422262052086471FAEDB7587792125FE", new Date());
  // createHubs(con, "E4BFA4A1A3394A40A0D71AAD09061EA2", "123123", "3", "1", "8CB32B85C7E84892A55395320D86D551", new Date());
  // createHubs(con, "16DD390EC04A42D3BEED58539E802423", "123123", "4", "00", "1D9760CA78CF4080963EB417C16731F0", new Date());
  // createHubs(con, "752F71CD396941669C4315776F2FD0CD", "123123", "5", "11", "495B9C5A35FA43CB94675F98055923B3", new Date());
  // createHubs(con, "0E1B4CA2A6084958A06E7903CC3D3AD0", "123123", "6", "10", "3DFB8146F6ED4BBB96BEE5875A8EFE76", new Date());
  // createHubs(con, "225CADC327DE48D58B834F4629FD9F63", "123123", "7", "01", "98EE829F01D54BA9B3DF3491A3163763", new Date());
  // createHubs(con, "11E857D11A7246D1AE23798E3634448D", "123123", "8", "0",  "FE72E21635344C3BA48788280EF82B77", new Date());

  createHubToken(con,"ADAD2AB5D835420FB42DCA45B9EDF2F0", "920FE536477040F6BA0D08C55562B4B5", "ADM", "123123" );
}

exports.popDatabase = popDatabase;
