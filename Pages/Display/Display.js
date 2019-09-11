// *********************VARIABLE***************


let wrap = document.getElementById("wrap");
let isLogin=document.getElementById("isLogin");
let isLoginMob=document.getElementById("isLoginMob");



// *********************EVENT LISTENER****************

window.addEventListener("load", loadData);


// ***************************FUNCTION***************


function loadData() {


    let user = JSON.parse(localStorage.getItem("user"));
    console.log(user)

    if (!user) {

        location.assign("../Auth/Auth.html");

        isLogin.style.display="none";
       
    }
    else {
        isLogin.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLoginMob.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLogin.style.display="block";

        // ***********GETTING ALL THE ADS****************

        let data = JSON.parse(localStorage.getItem("data"));

        // *********BRINGING THE PRESSED PARTICULAR AD ID*********

        let Ad = JSON.parse(localStorage.getItem("Ad"));

        // ************GRABING ADD ID FROM IT************

        let adId = Ad.id;



        let h = data.find((v) => {
            return v.adKey === adId;
        })
        console.log(h)


        wrap.innerHTML = innerData(h.url, h.price, h.title, h.name, h.phone, h.desc,h.uid);


        // firebase.database().ref('Adds/' + obj.cat).child(obj.id).once("value", (snap) => {
        //     console.log(snap.val())
        //     let ad = snap.val();
        //     wrap.style.display="block";

        //     wrap.innerHTML = innerData();
        // })
    }

}


function innerData(url, price, title, name, num, desc,uid) {


    return (
        `  <div class="col s12 m12 l12 ">
        <div class="wrap">
            <div class="row">
                <div class="col l6 m6 s12">
                    <div class="imgWrap">
                        <img id="pic" src='${url}'>
                    </div>

                </div>
                <div class="col l6 m6 s12">
                    <div class="dataWrap">

                        <h3 class="head">Rs:${price}</h3>
                        <h5>${title}</h5>
                    </div>
                    <div class="chatWrap">
                        <div class="below">
                            <h4 class="head">SELLER DESCRIPTION</h4>

                            <h5 class="head"><i class="icon material-icons">face</i>${name}</h5>
                            <h5 class="head"><i class="icon material-icons">phone</i>${num}</h5>
                            <button onClick="chat('${uid}','${name}')"  class="btn chat hoverable">CHAT</button>
                            
                        </div>

                    </div>

                </div>
            </div>

        </div>
    </div>

    <div class="row">
        <div class="col s12 l12 m12 ">

            <div class="descr">
                <h3>DESCRIPTION</h3>
                <p class="flow-text" style="padding:5px; text-align:center">${desc}</p>

            </div>
        </div>
    </div>`
    )
}


function chat(uid,name)
{
    let user = JSON.parse(localStorage.getItem("user"));
    console.log(uid)
    console.log(name)
 
    let obj={
        name,
        uid
    }

    // console.log(user.uid)
    localStorage.setItem("chat",JSON.stringify(obj));
    firebase.database().ref(`myMsgs/${user.uid}/${uid}/info`).set(obj)
    .then(()=>
    {
        firebase.database().ref(`myMsgs/${uid}/${user.uid}/info`).set(user)
        .then(()=>
        {
            location.assign("../Chat/Chat.html")
        })
    })
    
}




function logOut() {
    firebase.auth().signOut().then(function () {
        swal({
            title: "Congratulations",
            text: "Successfully LoggedOut!",
            icon: "success",
        })
            .then((data) => {
                if (data) {
                    localStorage.setItem("user", null);
                   location.reload();
                }
            });


    }).catch(function (error) {
        let message = error.message;
        swal({
            title: "ERROR",
            text: message,
            icon: "warning",
        })
        // An error happened.
    });
}