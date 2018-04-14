import React, {Component} from 'react';
import {SEED_URL} from '../constants';
import { hashHistory } from 'react-router';
import localStorageDAO from "../service/dao/LocalStorageDAO";
import {sendEvent} from '../utils';

const styles = {
  container: {
    paddingTop: 0,
  },
};

export class HomeService {

  constructor() {
  }

  start(){
    localStorage.getItem("hubs") ? sendEvent("changeCurrentHubMenu") :  this.getHubsFromUser("hubtokens/guess");
  }

  getSensors(auth_token){
    return this._getSensorsFromUser("sensors/byuser",auth_token)
  }

  getHubsFromUser(url){
    fetch(SEED_URL + url,
      {
        method: "GET", headers: {"Content-Type": "application/json; charset=utf-8", "x-access-token": localStorage.getItem("token")}
      }
    ).then((response)=>{
      response.json().then((value)=>{
        if(value.status == 401){
          console.log("Nao autorizado")
        }else if(response.status == 200){
          localStorage.setItem("hubs", JSON.stringify(value.results));
          sendEvent("changeCurrentHubMenu")
        }else{
          localStorage.setItem("hubs", "{}")
          sendEvent("changeCurrentHubMenu");
        }
      });
    })
  }

  _getSensorsFromUser(url, auth_token){
    return new Promise((resolve)=>{

      fetch(SEED_URL + url,
        {
          method: "GET", headers: {"Content-Type": "application/json; charset=utf-8", "x-access-token": localStorage.getItem("token"), "auth-token":auth_token }
        }
      ).then((response)=>{
        response.json().then((value)=>{
          if(value.status == 401){
            console.log("Nao autorizado")
          }else if(response.status == 200){
            localStorageDAO.save("sensors", JSON.stringify(value.result));
            return resolve(value.result);
          }else{
            localStorage.setItem("sensors", "{}");
            return resolve("[]");
          }
        });

      })
    })
  }
}

export default new HomeService();
