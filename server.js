// import packages
import express from 'express';
import bodyParser from 'body-parser';


// define global variable
const app = express(); 
const port = process.env.PORT || 8000; // default port 

let timeout = [];

// use bodyparser
app.use(bodyParser());


// root 
app.get( '/', ( req, res ) => {
	res.send({ 'status' : 'server is running' });
});

// request for waiting given time
// @params pass in url
// connId as number 
// timeout as number  --
app.get('/api/request', ( req, res ) => {

	let timeoutID = null;   // return by setTimeout
	let starttime = null;	// time when request is begin
	const time = req.query.timeout;		// time send by client
	const connId = req.query.connId;	// id send by client

	// checking client data is valid or not
	if ( typeof(connId) !== undefined && typeof(time) !== undefined ) {

		starttime = new Date();		// get current time
		starttime = starttime.setMilliseconds(starttime.getMilliseconds()); // convert into millisecon
		// initiate setTimeout
		timeoutID = setTimeout(() => {
			// remove that element from global array which reqest has been complted
			removeByAttr(timeout, 'connId', connId);
			// res.send({ status: "ok"});		// send response

		}, time);
		// initiate setInterval
		const setInv = setInterval(() => {
			// check timeout [] conatin the current request
			const arrLength = timeout.length && timeout.filter(({ connId }) => req.query.connId === connId).length;

			if ( arrLength === 0 ) {
				res.send({ status: "ok"}); // send response
				clearInterval(setInv); 		// clear/destroy current Interval
			}

		}, 80);

		// insert the current request into global [] timeout
		timeout.push({
			connId,
			time,
			timeoutID,
			starttime,
			'endtime': +starttime + +time
		});
	} 
});
// response --> { status : 'ok'} after given time period


// api for getting running request status

app.get( '/api/serverStatus', ( req, res ) => {

	const dt = new Date(); 

	// return an array with key as connId and value as second left
	res.send(timeout.map(({ connId, endtime }) => {
		return {
			[connId]: ((+endtime - (dt.setMilliseconds(dt.getMilliseconds()))) / 1000).toFixed(2),
		}
	}));
});
// response --> {connID : timeLeft}


// api for killing perticular reqest
// @params --> pass as body
// connId  --> id for cancelation
app.put( '/api/kill', ( req, res ) => {
	// initiate default msg to be send
	let msg = 'Invalid connection id '+ req.body.connId;
	// check connId status running or stop
	timeout.length && timeout.map(( conn , i ) => {

		if( +req.body.connId === +conn.connId ) {
			// clear/destroy setTimeout
			clearTimeout(conn.timeoutID);
			removeByAttr(timeout, 'connId', conn.connId);
			msg = 'killed';	// assign new message
		}
	});
	res.send({ status : msg }); // send final response
	
});
// response --> { status : 'message'} as object

app.listen(port); // create server on port 8000
console.log(' Server is runing on port ', port);

// remove object from an array
// @params
// arr --> given array
// attr --> object key
// value --> search value
// output --> array
const removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}