$( document ).ready(function() {
    var botLogo = "https://lh3.googleusercontent.com/-7FXV5V8aKJ8/AAAAAAAAAAI/AAAAAAAAANY/Pogm301Gil4/s64-c-k-no/photo.jpg";
    var socket = io.connect('https://smsa-express.herokuapp.com');
    socket.on('new message', function (data) {
        console.log(data);
    });
    function sendTextMessage(msg){
        var message =`
       <div class="msg">
            <p class="msgSent">`+msg+`</p>
       </div>`;
        $("#chatbox .chat_body").append(message);
        $("#chatbox .chat_body").animate({ scrollTop: $('#chatbox .chat_body').prop("scrollHeight")}, 350);
        $(".msgInput").val("");
    }
    function sendImage(file){
        var message =`
       <div class="msg">
            <p class="msgSent">`+msg+`</p>
       </div>`;
        $("#chatbox .chat_body").append(message);
        $("#chatbox .chat_body").animate({ scrollTop: $('#chatbox .chat_body').prop("scrollHeight")}, 350);
        $(".msgInput").val("");
    }
    function sendAudio(file){
        var message =`
       <div class="msg">
            <p class="msgSent">`+msg+`</p>
       </div>`;
        $("#chatbox .chat_body").append(message);
        $("#chatbox .chat_body").animate({ scrollTop: $('#chatbox .chat_body').prop("scrollHeight")}, 350);
        $(".msgInput").val("");
    }
    function sendVideo(file){
        var message =`
       <div class="msg">
            <p class="msgSent">`+msg+`</p>
       </div>`;
        $("#chatbox .chat_body").append(message);
        $("#chatbox .chat_body").animate({ scrollTop: $('#chatbox .chat_body').prop("scrollHeight")}, 350);
        $(".msgInput").val("");
    }
    function sendFile(file){
        var message =`
       <div class="msg">
            <p class="msgSent">`+msg+`</p>
       </div>`;
        $("#chatbox .chat_body").append(message);
        $("#chatbox .chat_body").animate({ scrollTop: $('#chatbox .chat_body').prop("scrollHeight")}, 350);
        $(".msgInput").val("");
    }
    
    $(".getStarted").click(function(){
        $(this).hide();
        var obj={
            msgType:'payload',
            payload:'getStarted'
        }
        socket.emit('new message', obj);
        console.log("obj sent :");
        console.log(obj);
        sendTextMessage("Get Started");
        $("#sendMessageForm").show();
    });
    $(".media").click(function(){
        $("#mediaFile").trigger("click");
    });
    
   $( "#sendMessageForm" ).submit(function( event ) {
       event.preventDefault();
       sendTextMessage($(".msgInput").val());
   });
    
    function showMessage(msg){
        msg={
            msgType:'text',
            message:{
                text:'Some Text'
            }
        };
        if(msg.hasOwnProperty('msgType')){
            if(msg.msgType=="text"){
                
            }
            else if(msg.msgType=="button"){
                
            }
            else if(msg.msgType=="audio"){
                
            }
            else if(msg.msgType=="video"){
                
            }
            else if(msg.msgType=="image"){
                
            }
            else if(msg.msgType=="carousel"){
                
            }
            else{
                console.log("unknown message type");
            }
        }else{
            console.log("undefined message type");
        }
    }
    
});