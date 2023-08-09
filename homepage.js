serveruri = "https://moviefinder-5gk8.onrender.com"

document.getElementById("logout-button").onclick = () => {
    console.log("log out");
    deleteJWT()
    location.href = "index.html"
}

let privatePlayLists = []
let publicPlayLists = []
let activePlaylistTab = document.getElementById("pvtplaylistTab")
activePlaylistTab.style.borderBottom = "2px solid orange"
let activePlaylist = document.getElementById("movienames")
activePlaylist.setAttribute("value", "global")
document.getElementById("loadmovies").innerText = "Load more movies"

let toaddMoviePlaylist = []
var hovertile
var clickablebtn = null
let toAddMovie
var preclickedbtn
document.onmousemove = function (e) {
    e = e || window.event;
    evt = e;
    if (evt.target.id == "add-button") {
        console.log("herebtn");
        if ((clickablebtn == null) || (clickablebtn.previousElementSibling.innerText != evt.target.previousElementSibling.innerText)) {
            clickablebtn = evt.target
            clickablebtn.onclick = () => {
                if (preclickedbtn != null) {
                    preclickedbtn.innerText = "+"
                }
                preclickedbtn = clickablebtn
                console.log("on click");
                if (clickablebtn.innerText == "+") {
                    console.log(activePlaylistTab.id);
                    activePlaylistTab.id = "pvtplaylistTab"
                    document.getElementById("pvtplaylistTab").click
                    clickablebtn.innerText = "Selected"
                    console.log(clickablebtn.previousElementSibling.getAttribute("value"));
                    toAddMovie = clickablebtn.previousElementSibling.getAttribute("value")
                    let arr = [...document.getElementsByClassName("listcheck")]
                    arr.forEach(movieTab => {
                        movieTab.style.visibility = "visible"
                    });
                    document.getElementById("pubplaylistTab").style.visibility = "hidden"
                    openNav()
                } else {
                    toAddMovie = null
                    closeNav()
                }
            }
        }
    }
    try {
        if (evt.target.getAttribute("hoverfield") == "movietile") {
            if (evt.target.getAttribute("class") == "movietile") {
                hovertile.style.border = "2px solid white"
                hovertile = evt.target
                hovertile.style.border = "3px solid orange"
            }
            if (evt.target.getAttribute("class") == "movieimage") {
                hovertile.style.border = "2px solid white"
                hovertile = evt.target.parentElement.parentElement
                hovertile.style.border = "3px solid orange"
            }

        }
    }

    catch {
        if (evt.target.getAttribute("class") == "movietile") {
            hovertile = evt.target
            hovertile.style.border = "3px solid orange"
        }
        if (evt.target.getAttribute("class") == "movieimage") {
            hovertile = evt.target.parentElement.parentElement
            hovertile.style.border = "3px solid orange"
        }
    }
}



let movielist = document.getElementById("movielist")
const apiUrl = `${serveruri}/getmovies`
let movies = []



document.getElementById("loadmovies").onclick = () => {
    if (preclicked != null) {
        preclicked.style.color = "white"   
    }
    console.log(activePlaylist.getAttribute("value"));
    if (activePlaylist.getAttribute("value") == "global") {
        console.log(movies[movies.length - 1].No_of_Votes);
        getNextBatch(movies[movies.length - 1].No_of_Votes)
    } else {
        closeNav()
        activePlaylist.setAttribute("value", "global")
        document.getElementById("loadmovies").innerText = "Load more movies"
        clickablebtn = null
        renderMovieList(movies)
    }


}



const renderMovieList = (movieslisttd) => {
    movielist.innerHTML = " "
    movieslisttd.forEach(movie => {
        var li = document.createElement("li")
        li.innerHTML = `<div class="movietilediv" hoverfield="movietile"><img src="${movie.Poster_Link}" class="movieimage" alt="" hoverfield="movietile"><span class="movietitle" hoverfield="movietile" value="${movie._id}">${movie.Series_Title}</span> <button type="submit" class="addbutton" id="add-button" hoverfield="movietile">+</button></div>`
        li.setAttribute("id", "movietile")
        li.setAttribute("class", "movietile")
        li.setAttribute("hoverfield", "movietile")
        movielist.appendChild(li)
    });

}
let preclicked
const renderPrivatePlaylist = () => {
    console.log(privatePlayLists[0].name);
    activePlaylist.innerHTML = ""
    for (let index = 0; index < privatePlayLists.length; index++) {
        const playlist = privatePlayLists[index];
        var li = document.createElement("li")
        li.setAttribute("id", `${playlist._id}`)
        console.log(li.getAttribute("id"));
        if (preclicked != null) {
            if(li.getAttribute("id") == preclicked.getAttribute("id")){
                li.style.color = "orange"
                preclicked = li
            }
        }
        li.innerHTML = `<span>${playlist.name}</span><input type="checkbox" name="" id="listcheck" class="listcheck" value="${playlist.name}">`
        li.addEventListener("click", function () {
            if (preclicked != null) {
                preclicked.style.color = "white"
            }

            preclicked = document.getElementById(`${playlist._id}`)
            preclicked.style.color = "orange"
            activePlaylist.setAttribute("value", "private")
            changeHeaderBtn()
            document.getElementById("loadmovies").innerText = "Home"
            clickablebtn = null
            renderMovieList(privatePlayLists[index].movies)
        });
        activePlaylist.appendChild(li)
    }
}
const renderPublicPlaylist = () => {
    activePlaylist.innerHTML = ""
    for (let index = 0; index < publicPlayLists.length; index++) {
        const playlist = publicPlayLists[index];
        var li = document.createElement("li")
        li.setAttribute("id", `${playlist._id}`)
        console.log(li.getAttribute("id"));
        if (preclicked != null) {
            if(li.getAttribute("id") == preclicked.getAttribute("id")){
                li.style.color = "orange"
                preclicked = li
            }
        }
        li.innerHTML = `<span>${playlist.name}</span><input type="checkbox" name="" id="listcheck" class="listcheck" value="${playlist.name}">`
        li.addEventListener("click", function () {
            if (preclicked != null) {
                preclicked.style.color = "white"
            }

            preclicked = document.getElementById(`${playlist._id}`)
            preclicked.style.color = "orange"
            activePlaylist.setAttribute("value", "public")
            changeHeaderBtn()
            document.getElementById("loadmovies").innerText = "Home"
            clickablebtn = null
            renderMovieList(publicPlayLists[index].movies)
        });
        activePlaylist.appendChild(li)
    }


}

const changeHeaderBtn = ()=> {
    document.getElementById("navbarbtn").innerText = "⌂ Home"
}


const getNextBatch = (lastval) => {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "lastval": lastval })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data.movies.length);
            if (data.movies.length != 0) {
                movies.push(...data.movies)
                console.log(movies)
                activePlaylist.setAttribute("value", "global")
                document.getElementById("loadmovies").innerText = "Load more movies"
                renderMovieList(movies)
            }
        })
        .catch(error => {
            console.error('fetch error:', error);
        });
}

function openNav() {
    if(activePlaylist.getAttribute("value") != "global"){
        console.log("pressed");
        preclicked.style.color = "white"
        document.getElementById("navbarbtn").innerText = "☰ Playlists"
        closeNav()
        activePlaylist.setAttribute("value", "global")
        document.getElementById("loadmovies").innerText = "Load more movies"
        clickablebtn = null
        renderMovieList(movies)
    } else {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginLeft = "250px";
        document.getElementById("createprivateplaylistli").style.visibility = "hidden"
        document.getElementById("createpublicplaylistli").style.visibility = "hidden"
    }
       
}

function closeNav() {
    preclicked = null
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    let arr = [...document.getElementsByClassName("listcheck")]
    arr.forEach(playlistTab => {
        playlistTab.style.visibility = "hidden"
    });
    document.getElementById("pubplaylistTab").style.visibility = "visible"
    if(preclickedbtn != null){
        preclickedbtn.innerText = "+"
    }
    toaddMoviePlaylist = []
    toAddMovie = null
}


document.getElementById("createplaylist").onclick = () => {
    if (toAddMovie != null) {
        let arr = [...document.getElementsByClassName("listcheck")]
        arr.forEach(playlistTab => {
            if (playlistTab.checked) {
                console.log(playlistTab.value);
                toaddMoviePlaylist.push(playlistTab.value)
            }
        });
        fetch(`${serveruri}/addMovie`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ names: toaddMoviePlaylist, id: toAddMovie })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log("success");
                    closeNav()
                } else {
                    console.log("failure");
                    closeNav()
                }
            })
            .catch(error => {
                console.error('create playlist error:', error);
            })
    } else {
        document.getElementById("createprivateplaylistli").style.visibility = (document.getElementById("createprivateplaylistli").style.visibility == "visible") ? "hidden" : "visible"
        document.getElementById("createpublicplaylistli").style.visibility = (document.getElementById("createpublicplaylistli").style.visibility == "visible") ? "hidden" : "visible"
    }

}
let pvtplaylisticonhtml;
document.getElementById("createprivateplaylist").onclick = () => {
    console.log("clicked");
    if (document.getElementById("pvticon").innerText == "ok") {
        let name = document.getElementById("pvtplaylistname").value
        let owner = getStoredJWT()
        let access = "private"
        let apiUrl = `${serveruri}/createPlaylist`
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, owner, access })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log(data);
                    privatePlayLists.push(data.playlist)
                    console.log(activePlaylistTab.id);
                    if (activePlaylistTab.id == "pvtplaylistTab") {
                        var li = document.createElement("li")
                        li.innerHTML = `<span>${data.playlist.name}</span><input type="checkbox" name="" id="listcheck" class="listcheck">`
                        activePlaylist.appendChild(li)
                    }
                } else {
                    console.log("failed to create list");
                }
            })
            .catch(error => {
                console.error('create playlist error:', error);
            }).finally(() => {
                console.log("close");
                document.getElementById("btn-label-pvt").innerHTML = pvtplaylisticonhtml
                document.getElementById("pvticon").innerText = "Pvt"
            });
    } else {
        pvtplaylisticonhtml = document.getElementById("btn-label-pvt").innerHTML
        document.getElementById("btn-label-pvt").innerHTML = `<span class="closeinppvt" id="closeinppvt">x</span><input type="text" name="name" id="pvtplaylistname" placeholder="Playlist name" required autocomplete="off"></input>`
        document.getElementById("pvticon").innerText = "ok"
        document.getElementById("closeinppvt").onclick = () => {
            console.log("close");
            document.getElementById("btn-label-pvt").innerHTML = pvtplaylisticonhtml
            document.getElementById("pvticon").innerText = "Pvt"
        }
    }

}
let pubplaylisticonhtml;
document.getElementById("createpublicplaylist").onclick = () => {
    console.log("clicked");
    if (document.getElementById("pubicon").innerText == "ok") {
        console.log("here");
        let name = document.getElementById("pubplaylistname").value
        let owner = getStoredJWT()
        let access = "public"
        let apiUrl = `${serveruri}/createPlaylist`
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, owner, access })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log(data);
                    publicPlayLists.push(data.playlist)
                    if (activePlaylistTab.id == "pubplaylistTab") {
                        var li = document.createElement("li")
                        li.innerHTML = `<span>${data.playlist.name}</span><input type="checkbox" name="" id="listcheck" class="listcheck">`
                        activePlaylist.appendChild(li)
                    }
                } else {
                    console.log("failed to create list");
                }
            })
            .catch(error => {
                console.error('create playlist error:', error);
            }).finally(() => {
                console.log("close");
                document.getElementById("btn-label-pub").innerHTML = pvtplaylisticonhtml
                document.getElementById("pubicon").innerText = "Pub"
                console.log(document.getElementById("createpublicplaylist").id);
            });
    } else {
        pvtplaylisticonhtml = document.getElementById("btn-label-pub").innerHTML
        document.getElementById("btn-label-pub").innerHTML = `<span class="closeinppub" id="closeinppub">x</span><input type="text" name="name" id="pubplaylistname" placeholder="Playlist name" required autocomplete="off"></input>`
        document.getElementById("pubicon").innerText = "ok"
        document.getElementById("closeinppub").onclick = () => {
            console.log("close");
            document.getElementById("btn-label-pub").innerHTML = pvtplaylisticonhtml
            document.getElementById("pubicon").innerText = "Pub"
            console.log(document.getElementById("createpublicplaylist").id);
        }
    }
}


document.getElementById("pvtplaylistTab").onclick = () => {
    if (activePlaylistTab.id != "pvtplaylistTab") {
        activePlaylistTab.style.borderBottom = "none"
        activePlaylistTab = document.getElementById("pvtplaylistTab")
        activePlaylistTab.style.borderBottom = "2px solid orange"
        renderPrivatePlaylist()
    }

}

document.getElementById("pubplaylistTab").onclick = () => {
    if (activePlaylistTab.id != "pubplaylistTab") {
        activePlaylistTab.style.borderBottom = "none"
        activePlaylistTab = document.getElementById("pubplaylistTab")
        activePlaylistTab.style.borderBottom = "2px solid orange"
        renderPublicPlaylist()
    }
}





if (movies.length == 0) {
    getNextBatch(Number.MAX_SAFE_INTEGER)
}
initLists()
async function initLists() {
    console.log("initializing lists");
    let token = getStoredJWT()
    fetch(`${serveruri}/getPlaylists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log(data);
                privatePlayLists.push(...data.playlists)
                renderPrivatePlaylist()
            } else {
                console.log("failed to create list");
            }
        })
        .catch(error => {
            console.error('create playlist error:', error);
        })

    fetch(`${serveruri}/getPublicPlaylists`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log(data);
                publicPlayLists.push(...data.playlists)
            } else {
                console.log("failed to create list");
            }
        })
        .catch(error => {
            console.error('create playlist error:', error);
        })


}


const source = document.getElementById('searchmoviename');
var searchMovies = []
var lastvalsearch
const inputHandler = function(e) {
    console.log(e.target.value);
    if(searchMovies.length == 0){
        lastvalsearch = Number.MAX_SAFE_INTEGER
    }else{
        lastvalsearch = searchMovies[searchMovies.length - 1]
    }
    fetch(`${serveruri}/getmoviesSearch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastval:  lastvalsearch, str: e.target.value})
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.movies.length != 0) {
               console.log(data.movies);
               renderMovieList(data.movies)
            }
        })
        .catch(error => {
            console.error('create playlist error:', error);
        })
  }
  
  source.addEventListener('input', inputHandler);
  source.addEventListener('propertychange', inputHandler);

submitSignInWithTokenFunc("homepage")
