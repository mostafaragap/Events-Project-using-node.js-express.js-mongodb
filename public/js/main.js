//jshint esversion:6

 var element = document.getElementById("alllerts");
 if(element !== null)
 {
   var myTimeout = setTimeout(myGreeting, 3000);

 }
 function myGreeting() {
 element.style.display="none";
 }


 var l_Events =document.getElementById("latestEvents") ;

var events = document.getElementById("events") ;
if(!events)
{
  l_Events.style.display="none";
}


function deleteEvent(){
  let btn = document.getElementById("deleteButton");
  let id = btn.getAttribute("data-id");
  axios.delete('/events/delete/'+id).then((res)=>{
  console.log("ok");
  })
  .catch((err)=>{
    console.log(err);
  });

}


function deleteUser() {
    let btn = document.getElementById('deleteUserBtn');
    let id = btn.getAttribute('data-id');
    console.log(id);
    axios.delete('/admins/delete/' + id)
    .then( (res)=> {
        console.log(res.data);
        alert('user was deleted');
        window.location.href = '/admins/viewRegistrationUsers';
    })
    .catch( (err)=> {

        console.log(err);
    });

}

function blockUser() {
    let btn = document.getElementById('blockUserBtn');
    let id = btn.getAttribute('data-id');
    console.log(id);
    axios.patch('/admins/blockUser/' + id)
    .then( (res)=> {
        console.log(res.data);
        alert('user was Blocked');
        window.location.href = '/admins/viewRegistrationUsers';
    })
    .catch( (err)=> {

        console.log(err);
    });

}

function unblockUser() {
    let btn = document.getElementById('unblockUserBtn');
    let id = btn.getAttribute('data-id');
    console.log(id);
    axios.patch('/admins/unblockUser/' + id)
    .then( (res)=> {
        console.log(res.data);
        alert('user was Unblocked succecfully');
        window.location.href = '/admins/viewRegistrationUsers';
    })
    .catch( (err)=> {

        console.log(err);
    });

}

function hideFromtimeline() {
    let btn = document.getElementById('hideEvent');
    let id = btn.getAttribute('data-id');

    axios.patch('/admins/hideEvent/' + id)
    .then( (res)=> {
        console.log(res.data);
        alert('Event was hidden from timeline');
        window.location.href = '/admins/viewcreatedEvents';
    })
    .catch( (err)=> {

        console.log(err);
    });

}

function unhideFromtimeline() {
    let btn = document.getElementById('unhideEvent');
    let id = btn.getAttribute('data-id');

    axios.patch('/admins/unhideEvent/' + id)
    .then( (res)=> {
        console.log(res.data);
        alert('Event will show in timeline');
        window.location.href = '/admins/adminIndex';
    })
    .catch( (err)=> {

        console.log(err);
    });

}

//function to add skills
  const addedSkills = [] ;
var select = document.getElementById('selecting');
var skills = document.getElementsByClassName('.Speakerskills');
function addskills() {
  let skillValue = select.options[select.selectedIndex].value ;
    let skill = select.options[select.selectedIndex].text;
    console.log(skill);
    axios.patch('/users/addSkill/'+ skill)
    .then( (res)=> {
        console.log(res.data);

       if((res.data) !='Exist skill'){
          addedSkills.push(skill);
          const para = document.createElement("span");
          para.classList.add("badge");
          para.classList.add("bg-secondary");
          para.style.marginLeft = "2px";
             addedSkills.forEach((item, i) => {
             para.innerHTML = skill;
             document.getElementById("addedSkil").appendChild(para);
               window.location.href = '/users/profile';

           });
        }else {
           window.location.href = '/users/profile';
        }

    })
    .catch( (err)=> {

        console.log(err);
    });

}


//delete skills

var quer = document.querySelectorAll("#skillsArayy") ;
quer.forEach((name)=>{
  name.addEventListener('click' ,()=>{
    axios.patch('/users/deleteSkill/'+name.innerText).then((res)=>{
         window.location.href = '/users/profile';

    })
    .catch((err)=>{
      console.log(err);
    });


  });
});

//disable a button when select speakers
// let speakerbtn = document.getElementById('inviteSpeaker');
// speakerbtn.addEventListener('click', ()=>{
//   speakerbtn.disabled = true ;
// });

function inviteSpeaker() {
    let btn = document.getElementById('inviteSpeaker');
    let eventId = btn.getAttribute('data-id');
    let speakerId = document.getElementById('speakerid').value;
      let skills = document.getElementById('skillslist').value;
console.log(eventId);
console.log(speakerId);
console.log(skills);
    axios({
    method: 'post',
    url: '/events/inviteSpeaker',
    data: {
      eventId:eventId ,
      speakerId: speakerId,
      skillsneeded:skills
    }
  });
}



///selected
