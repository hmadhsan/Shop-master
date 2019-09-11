

// **********VARIABLE DECLARATION**************

var ref = firebase.database().ref('Users/');
var inset = document.getElementById("inset");
let wrap = document.getElementById("wrap");
let loader = document.getElementById("load");
let ul = document.getElementById("ulStyle");
let currentUserUid = ""
let msgRef = firebase.database().ref("myMsgs/");

let isLogin = document.getElementById("isLogin");
let isLoginMob = document.getElementById("isLoginMob");





// *******************EVENTS*******************


window.addEventListener("load", load);


// *****************FUNCTIONS*********************

function load() {

    let user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        location.assign("../Auth/Auth.html");
    }
    else {
        isLogin.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLoginMob.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        // let localData =JSON.parse(localStorage.getItem("msgs"));
        // showUsers(localData);
        firebase.database().ref(`myMsgs/${user.uid}`).once("value", (snap) => {

            showUsers(snap.val());
            // ul.innerHTML = "";
            // let a = snap.val();
            // let arr = [];
            // for (var key in a) {
            //     arr.push(a[key])

            //     ul.innerHTML += users(a[key].info);

            // }

            

        })
    }


}


function users(data) {

    return `<li class="hoverable" onClick="messagePage('${data.uid}','${data.name}')"  id="liStyle">${data.name}</li>`;


}


function showUsers(data) {

    ul.innerHTML = "";
    // let a = snap.val();
    let arr = [];
    for (var key in data) {
        arr.push(data[key])
    
    ul.innerHTML += users(data[key].info);
    }


    loader.style.display = "none";
    wrap.style.display = "block";
}


function messagePage(uid, name) {

    let obj =
    {

        name,
        uid
    }
    localStorage.setItem("chat", JSON.stringify(obj));
    location.assign("../Chat/Chat.html");

}

function logOut() {
    firebase.auth().signOut().then(function () {
        localStorage.setItem("user", null);
        location.assign("../../index.html")

    }).catch(function (error) {
        // An error happened.
    });
}

