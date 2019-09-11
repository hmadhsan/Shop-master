
// ******************VARIABLES****************

let title = document.getElementById("titleIn");
let type = document.getElementById("typeIn");
let desc = document.getElementById("textareaIn");
let price = document.getElementById("priceIn");
let address = document.getElementById("addressIn");
let phone = document.getElementById("phoneIn");
let submit = document.getElementById("submit");
var e = document.getElementById("select");
let pic1 = document.getElementById('pic1');
let isLogin = document.getElementById("isLogin");
let isLoginMob = document.getElementById("isLoginMob");
let user = JSON.parse(localStorage.getItem("user"));
let mainDiv = document.getElementById("wrapper");

let loader = document.getElementById("divLoading");

let uid = "";
let name = "";









// ************************Events*******************

window.addEventListener("load", getAuth);
submit.addEventListener("click", submitFunc);



// **********************FUNCTIONS********************



function getAuth() {



    if (!user) {

        location.assign("../Auth/Auth.html");

        isLogin.style.display = "none";
        isLoginMob.style.display = "none";

    }
    else {


        isLoginMob.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLogin.innerHTML = user.name + `<i class="material-icons right">arrow_drop_down</i>`;
        isLogin.style.display = "block";

        firebase.database().ref("users/").child(user.uid).once("value", (snap) => {

            let u = snap.val();
            uid = u.uid;
            name = u.name;
        })

    }

}

function select(a) {
    cat = a;
}


function submitFunc() {

    console.log(loader)
    loader.style.display = "block";
    mainDiv.style.filter = "blur(2px)";

    let file = document.getElementById("pic1").files[0];
    let cat = e.options[e.selectedIndex].text;



    if (price.val <= 0) {
        loader.style.display = "none";
        mainDiv.style.filter = "blur(0px)";

        swal({
            title: "ERROR",
            text: "Type in the appropriate Price",
            icon: "warning",
        })
    }
    else {

        if (type.value.trim() !== "" && title.value.trim() != "" && address.value.trim() != "" && desc.value.trim() != "" && cat !== "CATEGORIES" && file != "") {
            if (phone.value.length != 11) {
                loader.style.display = "none";
                mainDiv.style.filter = "blur(0px)";

                swal({
                    title: "ERROR",
                    text: "Phone number must have 11 digits!",
                    icon: "warning",
                })
            }
            else {
                // console.log(cat)
                // console.log(file.name)

                let obj = {
                    cat,
                    uid,
                    name,
                    title: title.value,
                    type: type.value,
                    desc: desc.value,
                    price: price.value,
                    phone: phone.value,
                    address: address.value

                }



                console.log(obj)
                let store = firebase.storage().ref(`Adds/${file.name}`);
                store.put(file)
                    .then((url) => {
                        url.ref.getDownloadURL()
                            .then((urlRef) => {
                                // data.url = urlRef;
                                obj.url = urlRef;
                                console.log("url ref", urlRef)

                                firebase.database().ref(`Adds/${cat}`).push(obj)
                                    .then(() => {

                                        loader.style.display = "none";
                                        mainDiv.style.filter = "blur(0px)";

                                        swal({
                                            title: "Congratulations",
                                            text: "Your Add has been submitted",
                                            icon: "success",
                                        })
                                            .then(() => {
                                                location.reload();
                                            })


                                        // })

                                    }).catch(() => {
                                        loader.style.display = "none";
                                        mainDiv.style.filter = "blur(0px)";
                                    })
                            })
                    })

            }
        }
        else {

            mainDiv.style.filter = "blur(0px)";
            loader.style.display = "none";

            swal({
                title: "ERROR",
                text: "Please fill in all the input fields",
                icon: "warning",
            })




        }
    }
}


pic1.onchange = function (e) {
    // fire the upload here


    let btn = document.getElementById("btn1");
    btn.style.border = "3px solid white";
    console.log(btn)


};


// logout

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
