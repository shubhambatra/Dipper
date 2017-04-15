# Dipper

In this project playing with setTimeout, setInterval, clearTimeout and clear Interval


## Pre Requirements

node ```v5.12.0```

npm ```3.8.6```


## Install Dependencies



and type following command
```sh 
$ cd dipper

npm install
npm run server
``` 


please check this urls on Postman.

PostMan import file is https://github.com/shubhambatra/Dipper/blob/master/dipper.postman_collection.json

open http://127.0.0.1:8000/

initiate request http://localhost:8000/api/request?connId=19&timeout=8000

check running request status http://localhost:8000/api/serverStatus

this is put request

kill the connection http://localhost:8000/api/kill

body {
	"connId": 19
}

