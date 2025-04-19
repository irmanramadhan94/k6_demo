import http from 'k6/http';
import { sleep } from 'k6';

export const options = {

  

    stages: [
        {duration: '20s', target: 10},
        {duration: '50s', target: 10},
        {duration: '100s', target: 35},
        {duration: '30s', target: 10},
        {duration: '10s', target: 0}

    ],

    summaryTrendStats: ['avg', 'p(90)', 'p(95)','p(95)']
};


export default function () {
  http.get('http://localhost:3000/ping');
//   sleep(1);
}