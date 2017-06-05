
var image =  document.getElementById('image');
var data1 = document.getElementById('data1');
var data2 = document.getElementById('data2');
var data3 = document.getElementById('data3');
var rand = document.getElementById('rand');
var randNo = 1;
var serverUrl = "https://jsonplaceholder.typicode.com/photos/";
var cb="";
var callback="";
var obj="";
var tempServer;
var cacheServer = {};

/**********************************
	**
	========> Getting cache server 
	**
**********************************/
tempServer =  window.localStorage.getItem('server');
//console.log("Temp Server "+tempServer);
cacheServer = JSON.parse(tempServer);
//console.log("Cache Server ");
//console.log(cacheServer);



/**********************************
	**
	========> Server is JSON object contains the format
	**
	========> Initialize server JSON
	**
**********************************/
var server = {"albumId" : "",	"id" : "",	"title" : "",	"url" : ""};

onLoad();

document.getElementById('buttonServer').addEventListener('click', function() { 
	onClickServer(); // New server requested
});

document.getElementById('buttonCached').addEventListener('click', function() {
	onClickCache(); // Cache server requested
});

/**********************************
	**
	========> On Load
	**
**********************************/
function onLoad(){
	randNo =  generateRandom();	
	rand.innerHTML= " Id : "+randNo;
	serverUrl = serverUrl+randNo;
	httpGetAsync(serverUrl, callback);                  // HTTP Get request
	image.src= server.url;
	data1.innerHTML= server.id +" & "+server.albumId;
	data2.innerHTML= server.title;
	data3.innerHTML= server.url;
}

/**********************************
	**
	========> Getting data server from  HTTP Get request
	**
**********************************/
function onClickServer(){
	randNo =  generateRandom();	
	rand.innerHTML= " url : "+randNo;
	serverUrl = serverUrl+randNo;
	httpGetAsync(serverUrl, callback);                   // HTTP Get request
	//console.log(server);

}

/**********************************
	**
	========> Getting data server from  Cache
	**
**********************************/
function onClickCache(){
	tempServer =  window.localStorage.getItem('server'); // Fetch latest cache
	cacheServer = JSON.parse(tempServer);

	image.src= cacheServer.url;
	data1.innerHTML= cacheServer.id +" & "+cacheServer.albumId;
	data2.innerHTML= cacheServer.title;
	data3.innerHTML= cacheServer.url;
}

/**********************************
	**
	========> onResponse will be executed with Response of HTTP Get request
	**
**********************************/
function onResponse(res){
	if(res){
		// Initialize values of HTML with the Response received
		image.src= res.url;
		data1.innerHTML= res.id +" & "+res.albumId;
		data2.innerHTML= res.title;
		data3.innerHTML= res.url;
		serverUrl = "https://jsonplaceholder.typicode.com/photos/";

		//Initialize server with new response
		server.id = res.id;
		server.albumId = res.albumId;
		server.title = res.title;
		server.url = res.url;
		
		//Save server to local storage
		//console.log(JSON.stringify(server));
		window.localStorage.setItem('server', JSON.stringify(server));
		var cacheServer =  window.localStorage.getItem('server');
		//console.log("New Cache Server "+cacheServer);
	}
}

/**********************************
	**
	========> generate random number to pass on url i.e serverURL/random no.
	**
**********************************/
function generateRandom(){
	return Math.floor((Math.random() * 100) + 1);
}

/**********************************
	**
	========> Making Http get request
	**
**********************************/
function httpGetAsync(theUrl, callback){
	var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
        	obj = JSON.parse(xmlHttp.responseText);
        	console.log("200 ");
            //console.log(obj);
            onResponse(obj);
        }
        else{
        	console.log("404");
        	onResponse(cacheServer);   // if Get request fails, then return cached server JSON
        }
    }
    xmlHttp.open("GET", theUrl); 
    xmlHttp.send(null);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('./service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
}
