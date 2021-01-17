//const { notify } = require("../../routes");

const userAvartar =document.getElementById('user-avartar');
const userInfor = document.getElementById('user-info');
const listUserOnline = document.getElementById('list-user-online');
const modal = document.getElementById('myModal');
const  messageChatBox     = document.getElementById('message-chat-box');
const socket = io();
let user;
let currentUserId;
let currentUser;
let historyChat = [];
let notificationList = [];
//let message 
initalUser();
function initalUser(){
    const userString = localStorage.getItem('user');
    user = JSON.parse(userString);
    if(user == null){
      console.log('Oke');
      user = {
        name: "Guest ",
        age: "20",
        address: {
          province: "TP HCM",
          district: "Quan 1"
        }
      }
      localStorage.setItem('user', JSON.stringify(user));
    }
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
  if(user.static_id==undefined){
       user.static_id = socket.id;
       localStorage.setItem('user', JSON.stringify(user));
  }
  user.id  = socket.id;
  console.log("Client socket ID: ",socket.id);
  //console.log('User: ',user);
  socket.emit('join',user);
});

//Receive message 
socket.on("sendTo",(data)=>{
  //Notification 
   //view on modal 
    if(data.id_static_sender == currentUserId){
      messageChatBox.innerHTML +=`
      <div class="friend-message ">
                <p>${data.content}<span class="time ml-5">${data.time}'</span></p>
              </div>
      `;
    }else{
      document.title = "🔔 Bạn có tin nhắn mới...";
      notificationList.forEach(i =>{
        if(i.id == data.id_static_sender){
            i.notify +=1;
            //Update notification UI
            updateNotificationUI(i.id, i.notify);
        }
      } )
    }
    //save in history Chat
    historyChat.push(data);
});
//Updata user online status
socket.on('updateUsers', (data)=>{
  listUserOnline.innerHTML = ``;
   data.map(i =>{
       var id = i.static_id;
       //Find notification 
       const result = notificationList.find(notify=> notify.id == id);
      if(result==undefined){
        //New user
        let notification = {
          id: i.static_id,
          notify: 0
        }
        notificationList.push(notification);
      }
   }) 
   console.log(data);
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
              <div class="dropdown-menu">
                <button type="button" class="btn btn-primary" onclick="openModal(this)" data-toggle="modal" data-target="#myModal">
                Send message
              </button>
              </div>
            <h2 class = "name-user">${i.name}</h2>
            <p class= "age-user"> ${i.age} tuổi</p?>
            <span class = "id-user" style ='display: none'>${i.id}</span>
            <span class = "id-static-user" style ='display: none'>${i.static_id}</span>
            <span class="badge badge-danger badge-notification position-absolute top-0 end-0 " style="display: none"> 0 </span>
  </div>`;}
  })
})

function openModal(e){
    const parent =  e.parentElement.parentElement;
    const name = parent.getElementsByClassName('name-user')[0].innerHTML;
    currentUserId = parent.getElementsByClassName('id-static-user')[0].innerHTML;
    currentUser = parent.getElementsByClassName('id-user')[0].innerHTML;
    modal.getElementsByClassName('modal-title')[0].innerHTML = `${name} Chat Message Windows`;
    messageChatBox.innerHTML ='';
    historyChat.map(i=>{
      console.log(i);
      if(i.id_static_receiver == currentUserId ){
        messageChatBox.innerHTML += `
        <div class="your-message d-flex justify-content-end">
        <p>${i.content} <span class="time ml-5">${i.time}'</span></p>
      </div
        `
      }else if(i.id_static_sender == currentUserId){
        messageChatBox.innerHTML +=`
        <div class="friend-message ">
            <p>${i.content}<span class="time ml-5">${i.time}'</span></p>
          </div>
      `
      }
      
    });

}

function enterpressalert(e, textarea){
  document.title = 'Chat Online';
  //updata Notification
  notificationList.forEach(i =>{
    if(i.id == currentUserId){
        i.notify = 0;
        //Update notification UI
        updateNotificationUI(i.id, i.notify);
    }
  } )
  var code = (e.keyCode ? e.keyCode : e.which);
  if(code == 13) { //Enter keycode
    sendMessage();
  }
}

function sendMessage(){
   notificationList.forEach(i =>{
    if(i.id == currentUserId){
        i.notify = 0;
        //Update notification UI
        updateNotificationUI(i.id, i.notify);
    }
  } )
  const text = document.getElementById('inputValid').value ;
 // console.log(text, currentUserId);
  document.getElementById('inputValid').value  = '';
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  if (text == "") return ;
  const data = {
    id_static_sender: user.static_id,
    id_sender: user.id,
    id_receiver: currentUser, 
    id_static_receiver: currentUserId,
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

function closeWindow(){
  currentUserId = "";
  currentUser = "";
}

function updateNotificationUI(id, value){
    const arrayIdStaticUser = document.getElementsByClassName('id-static-user');
    for(i =0;i<arrayIdStaticUser.length; i++){
      console.log(arrayIdStaticUser[i].innerHTML+ " AB "+  id)
      if(arrayIdStaticUser[i].innerHTML == id){
          const parent = arrayIdStaticUser[i].parentElement;
          parent.getElementsByClassName('badge-notification')[0].innerHTML = `${value}`
          if(value==0) parent.getElementsByClassName('badge-notification')[0].style.display = 'none';
          else  parent.getElementsByClassName('badge-notification')[0].style.display = 'block';
      }
    }
}
