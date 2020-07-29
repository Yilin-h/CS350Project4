const express = require('express');
const nodmailer = require('nodemailer');
const fs = require('fs');
const http = require('http');
const path = require('path')
const url = require('url');
const qs = require('querystring');


const mimeTypes = {
	'.html': 'text/html',
	'.htm': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.ico': 'image/x-icon',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
	'.json': 'application/json'
};


var app = express();
app.use(express.static("public"));


app.post('index.html', function(req, res){
	var body = '';
	var testValidity = false;
	req.on('data', function(chunk){
		body += chunk.toString();
	});
	
	req.on('end', function(){
		//testValidity = ffv.validateForm(body);
		//if (testValidity === true){
			var ts = Date.now();
			var parsed = qs.parse(body);
			fs.appendFile('flatfileDB.txt', convertToString(parsed, ts), function(error){
				if(error){
					console.log('Error write to flatefileDB.txt file: ', error);
					throw error;
				}
				console.log('Wrote to flatfileDB.txt file successfullu!');
			});
			Feedback(parsed['email'],ts);
			res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'});
			res.end();
		//}
		//else{
		//	res.writeHead(301, {'Content-Type': 'text/plain', Location: '/'});
		//	res.end(testValidity);
		//}
	});
});

app.get('*', function(req, res){
	if(req.url === '/favicon.ico'){
		res.writeHead(200, {'Content_Type': 'image/x-icon'});
		return res.end();
	}
	var pathname = url.parse(req.url).pathname;
	pathname = (pathname === '/' || pathname === '' ) ? '/index.html' : pathname;
	
	var ext = path.extname(pathname);
	fs.readFile(__dirname + pathname, function(err, data){
		if(err){
			if(ext){
				res.writeHead(404, {'Content-Type': mimeTypes[ext]});
			}
			else{
				res.writeHead(404, {'Content-Type': 'text/html'});
			}
			return res.end("404 Not Found");
		}
		if(ext){
			res.writeHead(200, {'Content-Type': mimeTypes[ext]});
		}
		else{
			res.writeHead(200, {'Content-Type': 'text/html'});
		}
		res.write(data);
		return res.end();
	});
});

function converToString(dirty, ts){
	dirty.id = uuidvl();
	dirty.created_at = Date();
	dirty.reference_id = ts;
	return JSON.stringify(dirty);
}

function Feedback(email, reference){
	var transporter = nodemailer.createTransport({
		service:'gmail',
		host: 'smtp.gamil.com',
		auth:{
			user:'yilynn00982@gmail.com',
			pass:'HuangYiLin00992'
		}
	});

	var mailOption = {
		from:'yilynn00982@gmail.com',
		to: email,
		subject:'Confirmation!!!',
		text:"Thanks for your feedback, your information has been received. Have a good day!"
	};

	transporter.sendMail(mailOptions,function(err,info){
		if(err){
			console.log(err);
		}
		else{
			console.log('Email Sent:' + info.response);
		}
	});
}

const listener = app.listen(process.env.PORT, () => {
	console.log("CS350 Project4 is running on port " + listener.address().port);
});