import http from 'k6/http';
import {check, fail, sleep } from 'k6';
import execution from 'k6/execution';

//harus ada import fail jika ada function fail()
//harus ada import check jika ada function check()

export const options = {

    vus:10,

    duration:'10s',

    // iterations:'1',

    summaryTrendStats: ['avg', 'p(90)', 'p(95)','p(95)']
};


export default function () {

const username = `contoh${execution.vu.idInInstance}` 
const loginRequest ={
    
    username: username,
    password: 'rahasia'
  }

const responseLogin = http.post('http://localhost:3000/api/users/login', JSON.stringify(loginRequest), {
  headers:{
    'Accept':'application/json',
    'Content-Type': 'application/json'
  }
});

const checkLogin = check(responseLogin, {
  'Login sukses': (r) => r.json().data.token !== null
});


if(!checkLogin){
  fail(`Gagal Login ${username}`);
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
  fail(`gagal akses current ${username}`)
}




const responseBodyUserCureent = userCurrentResponse.json();
}