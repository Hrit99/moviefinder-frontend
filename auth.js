let serveruri = "https://moviefinder-5gk8.onrender.com"

const headerBtn = document.getElementById("header-button") 
headerBtn.onclick = ()=> {

    if (headerBtn.innerText == "Sign up") {
        headerBtn.innerText = "Sign in"
        renderSignUp()
    } else {
        headerBtn.innerText = "Sign up"
        renderSignIn()
    }
}
function renderSignIn() {
    headerBtn.innerText = "Sign up"
    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("form-title").innerText = "SIGN IN"
    document.getElementById("submit-button").value = "Sign in"
}
function renderSignUp() {
    headerBtn.innerText = "Sign in"
    document.getElementById("email").value = ""
    document.getElementById("password").value = ""
    document.getElementById("form-title").innerText = "SIGN UP"
    document.getElementById("submit-button").value = "Sign up"
}

const submitSignUpFunc = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const apiUrl = `${serveruri}/signup`

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const token = data.token;
            if (token != null) {
                let stored = storeJWT(token)
                console.log(stored);
               renderSignIn()
            } else {
                console.log("Already exists!!");
            }
        })
        .catch(error => {
            console.error('Signup error:', error);
        });
    console.log("sign up");
}

const submitSignInFunc = ()=> {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const apiUrl = `${serveruri}/signin`

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                let stored = storeJWT(data.token)
                console.log(stored);
               console.log("signed in");
               location.href = "homepage.html"
            } else {
                console.log("Unable to sign in");
            }
        })
        .catch(error => {
            console.error('Login error:', error);
        });

}

document.getElementById("authform").addEventListener("submit", function (event) {
    event.preventDefault();

    submitFunc()
});

const submitFunc = () => {
    headerBtn.innerText == "Sign up" ? submitSignInFunc():submitSignUpFunc()
}

console.log("init here");

const submitSignInWithTokenFuncAuth= (val) => {
    console.log("sign in with token");
    const apiUrl = `${serveruri}/signintoken`
    const storedJWT = getStoredJWT()
    console.log(storedJWT);
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "token": storedJWT})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            if (val == "index") {
                if (data.success) {
                    console.log("signed in");
                   location.href = "homepage.html"
                 } else {
                     console.log("Unable to sign in");
                 }
            } else {
                if (!data.success) {
                   location.href = "index.html"
                 } 
            }
          
        })
        .catch(error => {
            console.error('Login error:', error);
        });
}
submitSignInWithTokenFuncAuth("index")




// function makeAuthenticatedApiCall(endpoint, method, data) {
//     const jwtToken = localStorage.getItem('jwtToken');

//     if (!jwtToken) {
//         // Handle the case when the user is not authenticated
//         return Promise.reject(new Error('Not authenticated'));
//     }

//     return fetch(endpoint, {
//         method,
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${jwtToken}`
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         });
// }


// makeAuthenticatedApiCall('https://example.com/api/some-endpoint', 'GET')
//     .then(data => {
//         console.log(data);
//     })
//     .catch(error => {
//         console.error('API call error:', error);
//     });



