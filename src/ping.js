import http from 'k6/http';
import { sleep } from 'k6';

export const options = {

    vus:1,

    // iterations:'1', => ini artinya setara dengan jmeter thread group 1 user mengirimkan 1 request dalam 1 iterasi

    duration:'1s',

  

    summaryTrendStats: ['avg', 'p(90)', 'p(95)','p(95)']
};


export default function () {
  http.get('http://localhost:3000/ping');
  sleep(1);
  //sleep digunakan untuk mengontrol hanya ada 1 request dalam 1 detik  
}