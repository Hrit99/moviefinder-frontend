const storeJWT = (token) => {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("jwtToken", token);
        return true
    } else {
        console.log("Sorry, your browser does not support Web Storage...")
        return false
    }
}

const getStoredJWT = () => {
    if (typeof (Storage) !== "undefined") {
        return localStorage.getItem("jwtToken")
       
    } else {
        console.log("Sorry, your browser does not support Web Storage...")
        return " "
    }
}

const deleteJWT = ()=> {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem("jwtToken", " ");
        return true
    } else {
        console.log("Sorry, your browser does not support Web Storage...")
        return false
    }
}

const submitSignInWithTokenFunc = (val) => {
    console.log("sign in with token");
    const apiUrl = "http://localhost:3000/signintoken"
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
            location.href = "index.html"
        });
}

