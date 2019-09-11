
// ****************VARIABLE DECLARATION***********

let send = document.getElementById("send");
let msg = document.getElementById("input");
let username = document.getElementById("user");
let wrap = document.getElementById("wrap");
let loader = document.getElementById("load")
let ul = document.getElementById("ulStyle");
let currentUserUid="";

let isLogin=document.getElementById("isLogin");
let isLoginMob=document.getElementById("isLoginMob");





let chatUser = JSON.parse(localStorage.getItem("chat"));
let name=chatUser.name;
let recieverUid = chatUser.uid;

let totalData = [];
var i = 0;



let msgRef = firebase.database().ref("myMsgs");

// *************EVENTS***************

window.addEventListener("load", onLoad);

send.addEventListener("click", sendData);


// **************FUNCTIONS***************

function onLoad() {

    
    let user = JSON.parse(localStorage.getItem("user"));
   




    if(!user)
    {
        location.assign("../Auth/Auth.html");

        isLogin.style.display="none";



        
       
    }
    else
    {
        currentUserUid=user.uid;




        isLogin.innerHTML=user.name+`<i class="material-icons right">arrow_drop_down</i>`;
        isLoginMob.innerHTML=user.name+`<i class="material-icons right">arrow_drop_down</i>`;

    console.log(user);
    console.log(chatUser)

    username.innerText=chatUser.name;


    
    getData(currentUserUid, recieverUid);

    msg.focus()


    }

}


// *************DATALOAD***********



function getData() {
    msgRef.child(`${currentUserUid}/${recieverUid}/msgs`).on("value", (snap) => {
        totalData = [];
        ul.innerHTML = "";

        console.log(snap.val())

        for (var key in snap.val()) {
            totalData.push(snap.val()[key])

        }




        wrap.style.display = "block"
        loader.style.display = "none";
        console.log(totalData)
        ul.innerHTML = data(totalData);



        totalData = []

        ul.scrollTop = ul.scrollHeight;

    })


}



function data(d) {

    return (
        d.map((v) => {
            if (v.uid !== currentUserUid) {
                return `<li class="U">${v.msg}
           <br />
            <span class="sender">${name} [${timeConvert(v.time)}]</span>
           </li>`;
            }
            else {
                return `<li class="I">${v.msg}
           <br />
            <span class="sender"> [${timeConvert(v.time)}]</span>
           </li>`;
            }
        })
    )
}

function timeConvert(t) {
    let d = new Date(t);
    let hours = d.getHours();
    let min = d.getMinutes();
    return (hours + ":" + min)


}


function sendData() {

    let obj =
    {
        msg: msg.value,
        time: Date.now(),
        uid: currentUserUid
    }
    msgRef.child(`${currentUserUid}/${recieverUid}/msgs`).push(obj)
        .then((a) => {

            // localStorage.setItem("chatUser", JSON.stringify(obj));

            msgRef.child(`${recieverUid}/${currentUserUid}/msgs`).push(obj)
                .then(() => {

                  
                    getData();
                    msg.value = ""
                    ul.scrollTop = ul.scrollHeight;


                })


        })

}


// /* ======================== SEND-PUSH-NOTIFICATION-FUNCTION  STARTS ======================== */

// function sendNotification(uid,msg) {
  

//     firebase.database().ref("/fcmTokens").once("value", function(snapshot) {
//         snapshot.forEach(function(token) {
//             if (token.val() == uid) { //Getting the token of the reciever using  if condition..!   
//                 // console.log(token.key)   
//                 $.ajax({
//                     type: 'POST',
//                     url: "https://fcm.googleapis.com/fcm/send",
//                     headers: { Authorization: 'key=' + 'AIzaSyCBlZZCfgEfkdothiuq3zQYq9noBMNi5xc' },
//                     contentType: 'application/json',
//                     dataType: 'json',
//                     data: JSON.stringify({
//                         "to": token.key,
//                         "notification": {
//                             "title": `New Notification Recieved`,
//                             "body": msg.value,
//                             "icon": `https://freeiconshop.com/wp-content/uploads/edd/notification-flat.png`, //Photo of sender
//                             "click_action": `https://www.google.com` //Notification Click url notification par click honay k bad iss url par redirect hoga
//                         }
//                     }),
//                     success: function(response) {
//                         console.log(response);
//                         //Functions to run when notification is succesfully sent to reciever
//                     },
//                     error: function(xhr, status, error) {
//                         //Functions To Run When There was an error While Sending Notification
//                         console.log(xhr.error);
//                     }
//                 });
//             }
//         });
//     });

// }



// function logOut() {
//     firebase.auth().signOut().then(function () {
//         swal({
//             title: "Congratulations",
//             text: "Successfully LoggedOut!",
//             icon: "success",
//         })
//             .then((data) => {
//                 if (data) {
//                     localStorage.setItem("user", null);
//                    location.reload();
//                 }
//             });


//     }).catch(function (error) {
//         let message = error.message;
//         swal({
//             title: "ERROR",
//             text: message,
//             icon: "warning",
//         })
//         // An error happened.
//     });
// }