const userAvartar =document.getElementById('user-avartar');
const userInfor = document.getElementById('user-info');
let user;
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


