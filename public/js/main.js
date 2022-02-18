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
