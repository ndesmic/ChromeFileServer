var ServerView = (function(){
  function create(){
    var serverView = {};
    serverView.dom = {};
    serverView.ip = "127.0.0.1";
    serverView.port = 9009;
    serverView.fs = null;
    bind(serverView);
    serverView.gatherSelectors();
    serverView.attachEvents();
    serverView.getUserFolder();
    return serverView;
  }
  function bind(serverView){
    serverView.gatherSelectors = gatherSelectors.bind(serverView);
    serverView.attachEvents = attachEvents.bind(serverView);
    serverView.onStartClick = onStartClick.bind(serverView);
    serverView.onLocationClick = onLocationClick.bind(serverView);
    serverView.onKillClick = onKillClick.bind(serverView);
    serverView.getUserFolder = getUserFolder.bind(serverView);
  }
  function gatherSelectors(){
    this.dom.startButton = document.getElementById("btn-start");
    this.dom.locationButton = document.getElementById("btn-location");
    this.dom.killButton = document.getElementById("btn-kill");
    this.dom.serverInfo = document.getElementById("server-info");
  }
  function attachEvents(){
    this.dom.startButton.addEventListener("click", this.onStartClick);
    this.dom.locationButton.addEventListener("click", this.onLocationClick);
    this.dom.killButton.addEventListener("click", this.onKillClick);
  }
  function onStartClick(){
    if(!this.fsRoot){
	    console.log("setup location first");
	    return;
	  }

		this.dom.startButton.disabled = true;
		this.dom.killButton.disabled = false;

		this.router = Router.create({
		  fsRoot : this.fsRoot
		});

		this.server = HttpServer.create({
			port : this.port,
			ip : this.ip,
			onRequest : function(request){
				console.log("reading info", { request : request });
				return this.router.route(request.uri);
			}.bind(this),
			onKill : function(){
				this.dom.startButton.disabled = false;
				this.dom.killButton.disabled = true;
			}.bind(this),
			onError : function(error){
			  console.error(error);
			}
		});
		this.dom.serverInfo.innerText = this.ip + ":" + this.port;
		this.dom.serverInfo.href = "http://" + this.ip + ":" + this.port;
  }
  function onLocationClick(){
    this.getUserFolder();
  }
  function onKillClick(){
    this.dom.startButton.disabled = true;
		this.dom.killButton.disabld = false;
		this.server.kill();
  }
  function getUserFolder(){
    FileSystem.getUserFolder().then(function(entry){
		  this.fsRoot = entry;
		}.bind(this));
  }
  return {
    create : create
  };
})();