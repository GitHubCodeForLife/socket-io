const userAvartar =document.getElementById('user-avartar');
const userInfor = document.getElementById('user-info');
const listUserOnline = document.getElementById('list-user-online');
const modal = document.getElementById('myModal');
const  messageChatBox     = document.getElementById('message-chat-box');
const socket = io();
let user;
let currentUserId;
let historyChat = [];
//let message 
initalUser();
function initalUser(){
    const userString = localStorage.getItem('user');
    user = JSON.parse(userString);
   // console.log(user);
    userInfor.innerHTML = `
    <div class="dropdown-item">Your name: ${user.name}</div>
  <div class="dropdown-item">Age: ${user.age}</div>
  <div class="dropdown-item">Address: ${user.address.province}</div>
  <a href="./"><div class="dropdown-item">Edit</div></a>`;
};

// client-side
socket.on("connect", () => {
  //console.log(socket.id);
  user.id = socket.id;
  //console.log('User: ',user);
  socket.emit('join',user);
});

//Receive message 
socket.on("sendTo",(data)=>{
  //save in history Chat
  historyChat.push(data);
  //onsole.log(data);
   //view on modal 
    if(i.id_sender == currentUserId){
   messageChatBox.innerHTML +=`
   <div class="friend-message ">
            <p>${data.content}<span class="time ml-5">${data.time}'</span></p>
          </div>
   `;
    }
});
//Updata user online status
socket.on('updateUsers', (data)=>{
  listUserOnline.innerHTML = ``;
   // console.log(data)
    if(data.length==1){
        listUserOnline.innerHTML = '<div><span class="spinner-border"></span> Waiting to other persons</div>'
    }
  data.map(i => {
    var id = String(i.id)
    if(id!=user.id){
    listUserOnline.innerHTML += `
    <div class="dropdown mr-5">
            <img
              src="./img/avatar.jpg"
              alt="avatar"
              data-toggle="dropdown"
              class="avartar"
              id="user-avartar"
            />
            <h2 class = "name-user">${i.name}</h2>
            <p class= "age-user"> ${i.age} tuổi</p?>
            <span class = "id-user" style ='display: none'>${i.id}</p>
            <div class="dropdown-menu">
            <button type="button" class="btn btn-primary" onclick="openModal(this)" data-toggle="modal" data-target="#myModal">
            Send message
          </button>
            </div>
  </div>`;}
  })
})

function openModal(e){
    const parent =  e.parentElement.parentElement;
    const name = parent.getElementsByClassName('name-user')[0].innerHTML;
    currentUserId = parent.getElementsByClassName('id-user')[0].innerHTML;

    modal.getElementsByClassName('modal-title')[0].innerHTML = `${name} Chat Message Windows`;
    messageChatBox.innerHTML ='';
    historyChat.map(i=>{
      console.log(i);
      if(i.id_receiver == currentUserId ){
        messageChatBox.innerHTML += `
        <div class="your-message d-flex justify-content-end">
        <p>${i.content} <span class="time ml-5">${i.time}'</span></p>
      </div
        `
      }else if(i.id_sender == currentUserId){
        messageChatBox.innerHTML +=`
        <div class="friend-message ">
            <p>${i.content}<span class="time ml-5">${i.time}'</span></p>
          </div>
      `
      }
      
    });

}

function enterpressalert(e, textarea){
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) { //Enter keycode
    sendMessage();
  }
}

function sendMessage(){
  const text = document.getElementById('inputValid').value ;
  console.log(text, currentUserId);
  document.getElementById('inputValid').value  = '';
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  if (text == "") return ;
  const data = {
    id_sender: user.id,
    id_receiver: currentUserId, 
    content: text, 
    time: h+ 'h' + m+',',
    location: user.location
  }
  console.log(data.time);

  socket.emit('sendTo',data);
  historyChat.push(data);
  //view on modal 
  messageChatBox.innerHTML +=`
  <div class="your-message d-flex justify-content-end">
            <p>${data.content} <span class="time ml-5">${h}h${m}'</span></p>
          </div
  `;
}
