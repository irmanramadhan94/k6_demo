import http from 'k6/http';
import {check, fail, sleep } from 'k6';
import execution from 'k6/execution';

//harus ada import fail jika ada function fail()
//harus ada import check jika ada function check()

export const options = {

    vus:10,

    // duration:'10s',

    iterations:'10',

    summaryTrendStats: ['avg', 'p(90)', 'p(95)','p(95)']
};

export function setup() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      
        "first_name" : "Irman",
        "last_name" : `Ke-${i}`,
        "email" : `email-${i}@pzn.com`,
        "phone" : "123456789",
      })
  }
  return data; // Data dikembalikan dari setup()
}


export function getToken() {
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
  return responseBodyLogin.data.token;
  //untuk mengembalikan data token ke getToken() = (berisi data token)
}

export default function (data) {
  const token = getToken(); // Mendapatkan token
  for (let i=0; i < data.length; i++){
    const contact = data[i];
    const response = http.post('http://localhost:3000/api/contacts', JSON.stringify(contact), {
      headers:{
        'Accept':'application/json',
        'content-Type': 'application/json',
        'Authorization': token
      }
  });
  check(response, {
    'Success Create Contact': (r) => r.status === 200
  });
  }
}

export function teardown(data) {
console.info(`Finish Create: , ${data.length}contacts`);

}