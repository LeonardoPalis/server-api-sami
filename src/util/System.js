exports.getTimestampSystem = function(){
  return new Date().toLocaleString().substring(0, 19).replace('T', ' ');
}
