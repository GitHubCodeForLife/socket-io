const registerForm = document.getElementById('register-form');
//console.log(registerForm);
let current_location;
getLocation();



registerForm.addEventListener('submit',(e)=>{
    //Save informationn on local storage
    //name age address{ province, district}
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const province = document.getElementById('province').value;
    const district = document.getElementById('district').value;
    const user = {
        name: name, 
        age: age, 
        location: current_location,
        address: {
            province: province, 
            district: district
        }
    }
    console.log(user);

    localStorage.setItem('user', JSON.stringify(user));
});
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    current_location = position.coords.latitude + 
    ", " + position.coords.longitude;
}

function checkUser(){
    //Get user
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString);
    console.log(user);
    document.getElementById('name').value = user.name;
    document.getElementById('age').value = user.age;
    document.getElementById('province').value = user.address.province;
    $('#province').click();
    document.getElementById('district').value = user.address.district;
}

// //Chọn tỉnh thành phố
// $.getJSON("http://mr80.net/files/2015/09/vietnam_provinces_cities.json", function(result){
//                     $.each(result, function(i, field){
//                        // console.log(field.cities);
//                       /// var district = JSON.parse(field.cities);
//                         //districts.filter(district=> console.log('hello'));
//                         $('#province').append('<option value='+i+'>'+field.name+'</option>');
//                         // for (var property in field.cities){
//                         // $("#districts").append('<option>'+field.cities[property]+'</opntion>'); 
//                       //}
//                     });
//                  });
//                  $('#province').click((e)=>{
//                     var conceptName = $('#province').val();
//                     console.log(conceptName);
//                     $("#district option").remove();
//                     // $("#district").append('<option value='+null+'>Chọn Quận / Huyện</opntion>');
//                     $.getJSON("http://mr80.net/files/2015/09/vietnam_provinces_cities.json", function(result){
//                     $.each(result, function(i, field){
//                        // console.log(field.cities);
//                       /// var district = JSON.parse(field.cities);
//                         //districts.filter(district=> console.log('hello'));
//                         for (var property in field.cities){
//                             if(conceptName==i)
//                              $("#district").append('<option value='+property+'>'+field.cities[property]+'</opntion>'); 
//                       }
//                     });
//                  });
//                  });


