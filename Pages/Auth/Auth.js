// ******************VARIABLES****************

let l_email = document.getElementById("l-email");
let l_password = document.getElementById("l-password");
let l_btn = document.getElementById("l-btn");

let s_name = document.getElementById("s-name");
let s_email = document.getElementById("s-email");
let s_password = document.getElementById("s-password");
let s_btn = document.getElementById("s-btn");

let wrap = document.getElementById("wrap");
let loader = document.getElementById("load");

let loginForm = document.getElementById("loginForm");
let signupForm = document.getElementById("signupForm");




// ******************LISTENERS**************

signupForm.addEventListener("submit", signup);
loginForm.addEventListener("submit", login);




//******************* */FUNCTIONS************************


function login(e) {
  e.preventDefault();
  loader.style.display = "block";
  wrap.style.filter = "blur(2px)";
  let obj =
  {
    email: l_email.value,
    password: l_password.value
  }


  firebase.auth().signInWithEmailAndPassword(l_email.value, l_password.value)
    .then((a) => {
     

      // getting the logged in user name from the database and putting it in the localstorage
      firebase.database().ref("users/").child(a.user.uid).on("value", (snap) => {
        console.log(snap.val())
        let a = snap.val();
        let obj = {
          name: a.name,
          uid: a.uid

        }
        localStorage.setItem("user", JSON.stringify(obj))
        loader.style.display = "none";
        wrap.style.filter = "blur(0px)";


        swal({
          title: "Congratulations",
          text: "Login Successfully!",
          icon: "success",
        })
          .then((data) => {
            if (data) {

              location.assign("../../index.html")
            }
          });

      })

    })
    .catch(error => {
      // Handle Errors here.
      loader.style.display = "none";
      wrap.style.filter = "blur(0px)";
      var errorCode = error.code;
      var errorMessage = error.message;

      swal({
        title: "ERROR",
        text: errorMessage,
        icon: "warning",
      })

      // ...
    
    });

}


function signup(e) {

  e.preventDefault();
  loader.style.display = "block";
  wrap.style.filter = "blur(2px)";


  let obj =
  {
    name: s_name.value,
    email: s_email.value,
    password: s_password.value,

  }


  firebase.auth().createUserWithEmailAndPassword(s_email.value, s_password.value)
    .then((a) => {
     
      obj.uid = a.user.uid;
      loader.style.display = "none";
      wrap.style.filter = "blur(0px)";

      firebase.database().ref("users/").child(a.user.uid).set(obj)
        .then(() => {
          swal({
            title: "Congratulations",
            text: "Successfully signed Up!",
            icon: "success",
          })
            .then((data) => {
              if (data) {
                location.reload();
              }
            });
        });
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      loader.style.display = "none";
      wrap.style.filter = "blur(0px)";

      swal({
        title: "ERROR",
        text: errorMessage,
        icon: "warning",
      })

      // ...
    });


}

//  ****************SWITCH FORMS******************


function signupShow() {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
}

function loginShow() {
  signupForm.style.display = "none";
  loginForm.style.display = "block";
}
