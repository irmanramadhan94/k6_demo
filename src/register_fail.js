import http from 'k6/http';
import {fail, sleep } from 'k6';
//harus ada imfort fail jika ada function fail()

export const options = {

    vus:1,

    // duration:'1s',

    iterations:'1',

    summaryTrendStats: ['avg', 'p(90)', 'p(95)','p(95)']
};


export default function () {
 const uniqueId = new Date().getTime();
 const body = {
      username: `user-${uniqueId}`,
      password: 'rahasia',
      name: 'Irman Ramadhan'
    };
    const registerResponse = http.post('http://localhost:3000/api/users', JSON.stringify(body), {
      headers:{
        'Accept': 'application/json',
        'Content-Type' : 'application/json',
      }
    });

   
//jika register gagal iterasi bakal di stop
    if (registerResponse.status !== 200){
        fail(`Failed to register user-${uniqueId}`);
    }

const loginBody ={
  username: `user-${uniqueId}`,
  password: 'rahasia'
}

const responseLogin = http.post('http://localhost:3000/api/users/login', JSON.stringify(loginBody), {
  headers:{
    'Accept':'application/json',
    'Content-Type': 'application/json'
  }
});

// console.log(">>> REQUEST:");

// console.log("Body:", JSON.stringify(loginBody));


// console.log(">>> RESPONSE:");
// console.log("Status:", responseLogin.status);
// console.log("Body:", responseLogin.body);

//jika login gagal iterasi bakal di stop

if(responseLogin.status !== 200){
  fail(`Gagal Login user-${uniqueId}`);
}


const responseBodyLogin = responseLogin.json()
const userCurrentResponse = http.get('http://localhost:3000/api/users/current', {
  headers:{
    'Accept':'application/json',
    'Authorization': responseBodyLogin.data.token
  }
});

if(userCurrentResponse.status !== 200){
  fail(`gagal akses current user-${uniqueId}`)
}

const responseBodyUserCureent = userCurrentResponse.json();
}