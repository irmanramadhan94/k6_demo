import http from 'k6/http';
import {check, fail, sleep } from 'k6';
//harus ada import fail jika ada function fail()
//harus ada import check jika ada function check()

export const options = {

    vus:10,

    duration:'10s',

    // iterations:'1',

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

    
     const checkRegister = check(registerResponse, {
        'Register Sukses': (r) => r.status === 200 && r.body.length > 0 && JSON.parse(r.body).data.username !== null && r.json().data.name !== null
        //response harus di parsing karena masih berupa string JSON, Lebih konsisten di semua versi K6
        // Lebih aman & eksplisit
        // Gak tergantung implementasi internal K6
        //(r) itu parameter bisa dibilang variable juga, isinya bisa bebas atau () nul pun bisa, karena isinya berupa resgisterResponse
        //response harus di parsing karena masih berupa string JSON
        //Biasanya r.json() hanya dipakai kalau kamu yakin itu tersedia (misalnya di http.batch() hasil kadang beda tergantung konteks).
     })


        // console.log('Register Response Body:', r.body);

//jika register gagal iterasi bakal di stop
    if (!checkRegister){
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

const checkLogin = check(responseLogin, {
  'Login sukses': (r) => r.json().data.token !== null
});

// console.log(">>> REQUEST:");
// console.log("Body:", JSON.stringify(loginBody));
// console.log(">>> RESPONSE:");
// console.log("Status:", responseLogin.status);
// console.log("Body:", responseLogin.body);


if(!checkLogin){
  fail(`Gagal Login user-${uniqueId}`);
}
//jika login gagal iterasi bakal di stop


const responseBodyLogin = responseLogin.json()
const userCurrentResponse = http.get('http://localhost:3000/api/users/current', {
  headers:{
    'Accept':'application/json',
    'Authorization': responseBodyLogin.data.token
  }
});

const checkCurrentUser = check(userCurrentResponse, {
  'User current sukses': (r) => r.json().data.username && r.json().data.user  !== null
});

if(!checkCurrentUser){
  fail(`gagal akses current user-${uniqueId}`)
}




const responseBodyUserCureent = userCurrentResponse.json();
}