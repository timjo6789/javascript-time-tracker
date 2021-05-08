function to_seconds(string){
  regex = /(?:(\d+)h)?(?:(\d+)?m)?(\d+)s.*/gm;
  element = [...string.matchAll(regex)][0];
  hour = element[1] === undefined ? 0 : parseInt(element[1]);
  minute = element[2] === undefined ? 0 : parseInt(element[2]);;
  second = parseInt(element[3]);
  total = hour * 3600 + minute * 60 + second 
  return total;
}


function pretty_time(seconds){
  minute = Math.floor(seconds / 60);
  seconds = seconds % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;

  minute = hour > 0 || minute > 0 ? `${minute}m` : '';
  hour = hour > 0 ? `${hour}h` : '';
  return `${hour}${minute}${seconds}s`;
}

// https://stackoverflow.com/questions/43733099/javascript-difference-between-two-time-strings/43733867
// with some modification
function get_duration(d1, d2) {
  d3 = new Date(Date.parse(d2)).getTime() - new Date(Date.parse(d1)).getTime();

  seconds = Math.round(d3 / 1_000, 0);

  return pretty_time(seconds);
}


var start_time = null;
var end_time = null;

function stop() {
 end_time = new Date(); 
}

function start() {
 start_time  = new Date();
 stop();
}


function length() {
  return get_duration(start_time, end_time);
}


var ratio = 6;

function break_length() {
 var study = to_seconds(length());
 var break_time = study / ratio;
 console.log('total study time: ' + pretty_time(study));
 console.log('total break: ' + pretty_time(Math.round(break_time)));
}


const http = require('http');

start();
stop();
const server = http.createServer((request, response) => {
 const url = request.url;
 
 if (url === '/') {
  console.log('/');
  var study = to_seconds(length());
  var break_time = study / ratio;
  let string_1 = 'total study time: ' + pretty_time(study);
  let string_2 = 'total break: ' + pretty_time(Math.round(break_time));

  response.write(`
    <script>
      function trigger() {
       fetch('http://172.28.245.3:8080/data')
       .then(response => response.text())
       .then(data => {
        data = data.split(' ');
        string_1 = 'total study time: ' + data[0];
        string_2 = 'total break: ' + data[1];

        document.querySelector('#string_1').innerText = string_1;
        document.querySelector('#string_2').innerText = string_2;
       });
      }
      setInterval(trigger, 1000);
    </script>
    <a href="/start">Start</a><br>
    <a href="/stop">End</a>
    <p id='string_1'>${string_1}</p>
    <p id='string_2'>${string_2}</p>
  `);
  response.end();
  return;
 }

 if (url === '/start') {
  console.log('/start');
  start();
  response.setHeader('Location', '/');
  response.statusCode = 302;
  response.end();
  return;
 }

 if (url === '/stop') {
  console.log('/stop');
  stop();
  response.setHeader('Location', '/');
  response.statusCode = 302;
  response.end();
  return;
 }
 if (url === '/data') {
  var study = to_seconds(get_duration(start_time, new Date()));
  var study_end = to_seconds(get_duration(start_time, end_time));
  var break_time = study / ratio;
  var break_time_end = study_end / ratio;
  response.write(pretty_time(study) + ' ' + pretty_time(parseInt(break_time)) + ' ' + pretty_time(parseInt(break_time_end)));
  response.end();
  return;
 }
 
});

server.listen(8080);





