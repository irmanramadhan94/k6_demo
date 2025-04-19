import http from 'k6/http';
import {check} from 'k6';

export function registerUser(body) {

    const registerResponse = http.post('http://localhost:3000/api/users', JSON.stringify(body), {
      headers:{
        'Accept': 'application/json',
        'Content-Type' : 'application/json',
      }
    });

    
     const checkRegister = check(registerResponse, {
        'Register Sukses': (r) => r.status === 200 && r.body.length > 0 && JSON.parse(r.body).data.username !== null && r.json().data.name !== null
          
        
     });

     console.log('Register Response Body:', registerResponse.body);
     console.log("Body Request Register:", JSON.stringify(body)) //check request body register // Tambahkan logging untuk debugging
     return registerResponse;
};

export function loginUser(body) {

    let responseLogin = http.post('http://localhost:3000/api/users/login', JSON.stringify(body), {
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    });
    console.log('Login Response Body:', responseLogin.body); // Tambahkan logging untuk debugging
    console.log("Body Request Login:", JSON.stringify(body)) //check request body login // Tambahkan logging untuk debugging

    const checkLogin = check(responseLogin, {
      'Login sukses': (r) => r.json().data.token !== null
    });
    return responseLogin;
};

export function getUser(token) {

    const userCurrentResponse = http.get('http://localhost:3000/api/users/current', {
      headers:{
        'Accept':'application/json',
        'Authorization': token
      }
    });
    
    const checkCurrentUser = check(userCurrentResponse, {
      'User current sukses': (r) => r.json().data.username && r.json().data.user  !== null
    });
    if (!checkCurrentUser){
            fail(`Gagal Login user-${uniqueId}`);
        }
    return userCurrentResponse;
};