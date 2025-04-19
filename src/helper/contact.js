import http from 'k6/http';
import { check } from 'k6';

export function createContact(token, contactRequest) {
    let responseContact = http.post('http://localhost:3000/api/contacts', JSON.stringify(contactRequest), {
        headers:{
                 'Accept':'application/json',
                'content-Type': 'application/json',
                'Authorization': token
         }
    });

    check(responseContact, {
        'Contact created successfully': (r) => r.status === 200,
    });

    if (responseContact.status !== 200) {
        console.error('Failed to create contact:', responseContact.body);
        throw new Error('Failed to create contact');
    }
    
    return responseContact;
}