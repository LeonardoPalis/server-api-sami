import datastoreAPI from '../datastore.js';


class UsersService{

  signUp(user){
      return new Promise((resolve)=>{
        datastoreAPI.userSignUp(user).then((result)=>{
          resolve(result);
        })
      })
  }

  signIn(user){
      return new Promise((resolve)=>{
        datastoreAPI.userSignIn(user).then((result)=>{
          resolve(result);
        })
      })
  }

  userValidation(token){
    return new Promise((resolve)=>{
      datastoreAPI.getUserIdByAuthToken(token).then((result)=>{
        if(result){
          resolve(true);
        }else{
          resolve(false);
        }
      })
    })
  }

}

export default new UsersService();
