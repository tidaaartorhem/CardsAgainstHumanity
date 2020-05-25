let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
const fs = require('fs');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

let rawdata = fs.readFileSync('data.json');
let cards = JSON.parse(rawdata);
let blackCards = cards.blackCards;
let answers = []
var chosenCards=[]
for(var i=0; i<cards.whiteCards.length;i++){

    answers.push({
        Index:i,
       data:cards.whiteCards[i]
    })
    
}

blackCards.forEach(function(entry,index) {

    entry.Index= index; 
    
});


function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


    

http.listen(3000, () => {
    console.log('Listening on port *: 3000');
});

io.on('connection', (socket) => {
var users= Object.keys(io.sockets.connected).length;
    socket.emit('connections', Object.keys(io.sockets.connected).length);
    socket.emit('answer', answers);


    io.sockets.emit('questions', blackCards)  
    
socket.on('Chosen',(data)=>{

chosenCards.push(data); 
    

    if(chosenCards.length <= users){
       

   io.sockets.emit('Decision', chosenCards,users)}
else {

    var k =0;
    console.log(users)
    while(k<=users-1){
      
chosenCards.splice(k,1)

k++;}

if (chosenCards.length == 1){

    console.log('new Round',chosenCards)

    io.sockets.emit('Decision', chosenCards,users)
  
}


}



   
    
});

socket.on('judge', (data)=>{

    var filtered = [];
   

   console.log(answers.length)
    for(var l =0; l<chosenCards.length;l++){

        for (var j=0; j<answers.length;j++){

            if(chosenCards[l][l].Index == answers[j].Index){
          
             

            }
            else{
                filtered.push(answers[j])
            }

        }
    }
    console.log(filtered.length)
    
            io.sockets.emit('Winner',data,filtered)
})
    socket.on('disconnect', () => {

        console.log(users)
        console.log("A user disconnected");
    });

    socket.on('chat-message', (data) => {
        socket.broadcast.emit('chat-message', (data));
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
    });

    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    });

    socket.on('joined', (data) => {
        socket.broadcast.emit('joined', (data));
    });

    socket.on('leave', (data) => {
        socket.broadcast.emit('leave', (data));
    });

});

