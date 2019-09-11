// ******************VARIABLES****************

// let cat = e.options[e.selectedIndex].text;

let wrap = document.getElementById("adds");
let categories = document.getElementById("select");
let search = document.getElementById("searchIn")
let isLogin=document.getElementById("isLogin");
let isLoginMob=document.getElementById("isLoginMob");
let arr = [];

let user = JSON.parse(localStorage.getItem("user"));


// ************************Events*******************


window.addEventListener("load", loadData);
categories.addEventListener("change", changed);
search.addEventListener("keyup", searchItem);



// **********************FUNCTIONS********************


function loadData() {
   
    console.log(user)
    

  
    if (!user) {
        location.assign("../Auth/Auth.html");

        isLogin.style.display="none";
        isLogin.innerHTML=user.name+`<i class="material-icons right">arrow_drop_down</i>`;
       
    }
    else {
        isLogin.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLoginMob.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLogin.style.display="block";
        arr = JSON.parse(localStorage.getItem("data"));
        showAds();

        let searched = localStorage.getItem("searched");
        let selected = localStorage.getItem("selected");
        categories.options[categories.selectedIndex].text = selected;

        (searched) ? grabSearch() : changed()
       
        
                // grabSearch();




        firebase.database().ref('Adds/').once("value", (snap) => {

            arr = [];
            let a = snap.val();
            console.log(a);


            for (var key in a) {

                // console.log(a[key])
                // arr.push(a[key]);

                for (var k2 in a[key]) {

                    a[key][k2].adKey = k2;
                    arr.push(a[key][k2])
                }



            }
            localStorage.setItem("data", JSON.stringify(arr));
            console.log(arr)

            // wrap.innerHTML = arr.map((v) => {

            //    return data(v.desc, v.url, v.title,v.adKey,v.cat);
            // }).join("\n");
            showAds();
            (searched) ? grabSearch() : changed();
            categories.options[categories.selectedIndex].text="Categories";


        })



        console.log(JSON.parse(localStorage.getItem("data")));
    }
}





function showAds() {


    if (arr) {

        wrap.innerHTML = arr.map((v) => {

            if(user.uid!==v.uid)
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



function go(id, cat) {
    console.log(id)
    let obj =
    {
        cat,
        id
    }
    localStorage.setItem("Ad", JSON.stringify(obj));
    location.assign("../Display/Display.html");

}




// ********************CATEGORIES CHANGE*****************

function changed() {


    let cat = categories.options[categories.selectedIndex].text;

    let data = JSON.parse(localStorage.getItem("data"));

    search.value = "";
    search.blur();

    filterAds(cat, data);

}

function filterAds(cat, array) {
    wrap.innerHTML = array.map((v) => {
        if (v.cat === cat && v.uid !== user.uid) {
            return data(v.desc, v.url, v.title, v.adKey, v.cat);
        }

    }).join("\n")

}


// *************SEARCH ITEMS**************

function searchItem(e) {
    if (e.keyCode === 13) {

        regSearch();
    }
}

function regSearch() {

    let reg = new RegExp(search.value, 'i');

    let local = JSON.parse(localStorage.getItem("data"));
    wrap.innerHTML = local.map((v) => {
        if (v.title.match(reg) && v.uid !== user.uid) {
            return data(v.desc, v.url, v.title, v.adKey, v.cat);
        }
    }).join("\n");
}

// *************LOCALSTORAGE SEARCHED ITEM GRABBING**************

function grabSearch() {
    search.focus();
    let a = localStorage.getItem("searched");
    search.value = a;
    regSearch();
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