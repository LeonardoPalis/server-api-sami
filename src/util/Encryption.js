var NodeRSA = require('node-rsa');


function encryptKey(key){
  var key = new NodeRSA({b: 512});
  var encrypted = key.encrypt(key.toString(), 'base64');
  return encrypted;
}

function decryptKey(encrypted){
  return key.decrypt(encrypted, 'utf8');
}

exports.encryptKey = encryptKey;
