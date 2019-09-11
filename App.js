// *******************VARIABLES****************

let wrap = document.getElementById("wrap");
let categories = document.getElementById("select");
let search = document.getElementById("searchIn");
let chatPage = document.getElementById("chatPage");
let isLoginMob = document.getElementById("isLoginMob");

//    checking if user is logged in
let user = JSON.parse(localStorage.getItem("user"));
let isLogin = document.getElementById("isLogin");
let loginMob = document.getElementById("loginMob");
let arr = [];



// ***********************EVENT LISTENERS*****************

window.addEventListener("load", localData);
categories.addEventListener("change", changed);
search.addEventListener("keyup", seachItem);


// ****************FUNCTIONS*****************

function localData() {

    if ('serviceWorker' in navigator) {

        navigator.serviceWorker.register('./sw.js').then(function (registration) {

            console.log("service worker")
            // Registration was successful


        }, function (err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });


    }





    if (user) {
        isLogin.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLoginMob.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        login.style.display = "none";
        loginMob.style.display = "none";
        isLogin.style.display = "block";

        firebase.database().ref(`myMsgs/${user.uid}`).on("value",(snap)=>
        {
            localStorage.setItem("msgs",JSON.stringify(snap.val()));
        })



}
    else {
    isLogin.style.display = "none";

    isLoginMob.style.display = "none";
    loginMob.style.display = "block";
    login.style.display = "block";
}

arr = JSON.parse(localStorage.getItem("data"));
showAds(arr);



firebase.database().ref('Adds/').once("value", (snap) => {

    arr = [];
    let a = snap.val();



    for (var key in a) {



        for (var k2 in a[key]) {

            a[key][k2].adKey = k2;
            arr.push(a[key][k2])
        }



    }
    localStorage.setItem("data", JSON.stringify(arr));

    showAds(arr);
})




}



//    showing all ads

function showAds(ads) {

    if (user) {
        if (ads) {

            wrap.innerHTML = ads.map((v) => {

                // not to show the current user ads

                if (user.uid !== v.uid)
                    return data(v.desc, v.url, v.title, v.adKey, v.cat);
            }).join("\n");
        }
    }
    else {
        if (arr) {

            wrap.innerHTML = arr.map((v) => {

                // show all ads if user is not logged in

                return data(v.desc, v.url, v.title, v.adKey, v.cat);
            }).join("\n");
        }
    }


}


// returning all the innerhtml data

function data(desc, url, title, key, cat) {

    return (

        ` <div class="col s12  m6 l4">
        <div class="door">
            <div class="card z-depth-4">
                <div class="card-image waves-effect waves-block waves-light">
                    <img class="activator cardImg"  src="${url}">
                </div>
                <div class="card-content">
                    <span class="card-title activator grey-text text-darken-4">${title}<i
                            class="material-icons right">more_vert</i></span>
                    <p><button onClick="go('${key}','${cat}')" class="btn">Go to add</button></p>
                </div>
                
                <div class="card-reveal">
                    <span class="card-title grey-text text-darken-4">${cat}
                    <i class="material-icons right">close</i></span>
                    <p>${desc}</p>
                </div>
            </div>
        </div>
    </div>`
    )
}

//   got button to display a particular ad

function go(id, cat) {
    console.log(id)
    let obj =
    {
        cat,
        id
    }
    localStorage.setItem("Ad", JSON.stringify(obj));
    location.assign("./Pages/Display/Display.html");

}


// ********************CATEGORIES CHANGE*****************

function changed() {
    // console.log("change")

    let cat = categories.options[categories.selectedIndex].text;

    localStorage.setItem("selected", cat);

    localStorage.setItem("searched", "");

    location.assign("./Pages/Ads/Ads.html");


}



// **************searchItem************


function seachItem(e) {
    if (e.keyCode === 13) {

        localStorage.setItem("searched", search.value);
        localStorage.setItem("selected", "");
        location.assign("./Pages/Ads/Ads.html");
    }
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



