import { registerUser } from "./helper/user.js";
import { loginUser } from "./helper/user.js";
import http from 'k6/http'; 
import { check } from "k6"; // Import http untuk melakukan request
// import { createContact } from "./helper/contact.js"; // Import function contact dari helper/contact.js
import execution from 'k6/execution'; // Import execution untuk mendapatkan id instance

export const options = {
    scenarios: {
        userRegistration: {
            executor: 'shared-iterations',
            vus: 5,
            iterations: 5,
            maxDuration: '5s',
            exec: 'userRegistration', // nama function yang akan dieksekusi
        },
        createContact: {
          executor: 'shared-iterations',
          vus: 10,
          iterations: 10,
          maxDuration: '10s',
          exec: 'createContact', // nama function yang akan dieksekusi
        },
    },
}

export function userRegistration() {
    const uniqueId = new Date().getTime();
    const registerRequest = {
      username: `user-${uniqueId}`,
      password: 'rahasia',
      name: 'Irman Ramadhan'
    };
    registerUser(registerRequest); // Menggunakan fungsi registerUser dari helper/user.js
}

export function createContact() {
    const vu = execution.vu.idInInstance //user yang digunakan sudah di buat sebelumnya
    const username = `contoh${vu}` 
    const loginRequest ={
          
          username: username,
          password: 'rahasia'
        }

    const loginResponse = loginUser(loginRequest); // Menggunakan fungsi loginUser dari helper/user.js
    
    let token = loginResponse.json().data.token; // Parsing response JSON
    
    const contactRequest = {
        first_name: "Irman",
        last_name: "Ramadhan",
        email: "email@pzn.com",
        phone: "123456789",
    };
    // createContact(token, contactRequest); // Menggunakan fungsi contact dari helper/contact.js
    



    const response = http.post('http://localhost:3000/api/contacts', JSON.stringify(contactRequest), {
          headers:{
            'Accept':'application/json',
            'content-Type': 'application/json',
            'Authorization': token
          }
      });
      check(response, {
              'Contact created successfully': (r) => r.status === 200,
          });
      
          if (response.status !== 200) {
              console.error('Failed to create contact:', response.body);
              throw new Error('Failed to create contact');
          }
          
          return response;
}


//scenario disini menggunakan module untuk memanggil setiap function di module helper, supaya script scenario.js lebih rapih