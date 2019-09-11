// ******************VARIABLES****************



let wrap = document.getElementById("adds");

let isLogin = document.getElementById("isLogin");
let isLoginMob=document.getElementById("isLoginMob");

let arr = [];

let user = JSON.parse(localStorage.getItem("user"));


// ************************Events*******************


window.addEventListener("load", loadData);




// **********************FUNCTIONS********************


function loadData() {

    



    if (!user) {
        location.assign("../Auth/Auth.html");


        isLogin.style.display = "none";
        isLogin.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;

    }
    else {
        isLogin.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLogin.style.display = "block";
        isLoginMob.innerHTML=user.name + `<i class="material-icons right">arrow_drop_down</i>`;
       
       
        arr = JSON.parse(localStorage.getItem("data"));
        showAds();

        firebase.database().ref('Adds/').once("value", (snap) => {

            arr = [];
            let a = snap.val();
            console.log(a);


            for (var key in a) {



                for (var k2 in a[key]) {

                    a[key][k2].adKey = k2;
                    arr.push(a[key][k2])
                }



            }
            localStorage.setItem("data", JSON.stringify(arr));
            console.log(arr)

            showAds();
           


        })



        console.log(JSON.parse(localStorage.getItem("data")));
    }
}





function showAds() {


    if (arr) {

        wrap.innerHTML = arr.map((v) => {

            if (user.uid === v.uid)
                return data(v.desc, v.url, v.title, v.adKey, v.cat);
        }).join("\n");
    }


}



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