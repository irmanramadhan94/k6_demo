import { loginUser, registerUser } from "./helper/user.js";
import { createContact } from "./helper/contact.js"; // Import function contact dari helper/contact.js
import { execution as exec } from 'k6/execution'; // Import execution untuk mendapatkan id instance

export const options = {
    scenarios: {
      dummy: {
        executor: 'shared-iterations',
        vus: 1,
        iterations: 1,
        maxDuration: '1s',
        exec: 'dummy'
      }
    }
  };
  
  export function dummy() {
    const a = 1;
    console.log("Running dummy");
  }