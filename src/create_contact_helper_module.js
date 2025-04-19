import http from 'k6/http';
import {check, fail, sleep } from 'k6';
import execution from 'k6/execution';
// digunakan untuk mengakses informasi tentang eksekusi Virtual User (VU) dalam tes K6. 
// Modul k6/execution menyediakan properti dan metode yang memungkinkan Anda mendapatkan 
// informasi seperti ID VU, ID iterasi, dan lainnya.
import { loginUser } from './helper/user.js'; // Import function loginUser dari helper/user.js
import { createContact } from './helper/contact.js'; // Import function contact dari helper/contact.js


export const options = {

    vus:1,

    // duration:'10s',

    iterations:'1',

    summaryTrendStats: ['avg', 'p(90)', 'p(95)','p(95)']
};

export function setup() {
  const totalContact = Number(__ENV.TOTAL_CONTACT) || 10; // Mengambil nilai dari environment variable TOTAL_CONTACT, default 10
  //diterminal bisa kita ubau total nya dengan prompt misal export TOTAL_CONTACT=20
  const data = [];
  for (let i = 0; i < totalContact; i++) {
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
  const username = `contoh${execution.vu.idInInstance}` //user yang digunakan sudah di buat sebelumnya
  const loginRequest ={
      
      username: username,
      password: 'rahasia'
    }
    
  const loginResponse = loginUser(loginRequest); // Menggunakan fungsi loginUser dari helper/user.js
  console.log('Login Response:', loginResponse.body);

  const loginBodyResponse = loginResponse.json(); // Parsing response JSON
  return loginBodyResponse.data.token; // Mengembalikan token dari login
}

export default function (data) {
  const token = getToken(); // Mendapatkan token
  for (let i=0; i < data.length; i++){
    const contact = data[i];

    // console.log(`Index ${i}:`, contact);
    // console.log(`Index ${i} typeof:`, typeof data[i]); //check data object atau bukan (json string)
    // console.log(`Index ${i} raw:`, data[i]); //check data raw/asli

    const res = createContact(token, contact); // Menggunakan fungsi contact dari helper/contact.js
    
    // console.log(`✅ Index ${i} Status:`, res.status);
    // console.log(`🧾 Index ${i} Body:`, res.body);
  };
}

export function teardown(data) {
console.info(`Finish Create: ${data.length} contacts`);

}