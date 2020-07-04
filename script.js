
var movieData;
window.onload = function() {
   loadData();
   document.getElementById("language").addEventListener("click", languageSort);
   document.getElementById("movie").addEventListener("click", movieSort);
   document.getElementById("submit").addEventListener("click", submit);
}

function submit() {
var title = document.getElementById("titleInput").value;
var lang = document.getElementById("languageInput").value;
var error = document.getElementById('error');

if(title === null || title === undefined || title.trim() === "") {
    error.style.display = "block";
    error.innerHTML = "title should not be empty";
    return;
}

if(lang === null || lang === undefined || lang.trim() === "") {
    error.style.display = "block";
    error.innerHTML = "language should not be empty";
    return;
}

if(movieData == null || movieData.length == 0) {
    error.style.display = "block";
    error.innerHTML = "movieData didnot loaded correctly. Please reload again";
    return;
}
error.style.display = "none";
error.innerHTML = "";

addDataToTable(title, lang);
postData(title, lang);
}

function addDataToTable(title, lang) {
    let table = document.getElementById("movies");
    let tbody = document.querySelector("tbody");
    let tr = document.createElement("tr");
    let t = document.createElement("td");
    let l = document.createElement("td");
    t.textContent = title;
    l.textContent = lang;
    t.scope="col"
    l.scope="col";
    tr.appendChild(t);
    tr.appendChild(l);
    tbody.appendChild(tr);
}

function appendToMovieData(title, lang) {
    let temp = {};
    temp["Movie"] = title;
    temp["Language"] = lang;
    movieData.push(temp);
    return temp;
}

function postData(title, lang) {
    let temp = appendToMovieData(title, lang);
    var xhttp = new XMLHttpRequest();
    var error = document.getElementById('error');
    var success = document.getElementById('success');
    xhttp.open("POST", "http://localhost:3000/addItem", true);
    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 201) {
                error.style.display = "none";
                error.innerHTML = "";
                setTimeout(() => {
                    success.innerHTML = "";
                    success.style.display = "none";
                }, 2000);
                success.innerHTML = this.responseText;
                success.style.display = "block";
            } else if (this.status == 400) {
                error.innerHTML = this.responseText;
                error.style.display = "block";
            } else {
                error.innerHTML = this.responseText;
                error.style.display = "block";
            }
        }
    }
    xhttp.send(JSON.stringify(temp));
}

function languageSort() {
var lang = document.getElementById("language");
clearData();
if(lang.className === "asc") {
movieData.sort((a, b) => a.Language < b.Language);
lang.className = "desc";
} else {
movieData.sort((a, b) => a.Language > b.Language);
lang.className = "asc";
}
processData(movieData);
}

function movieSort() {
    var movie = document.getElementById("movie");
    clearData();
    if(movie.className === "asc") {
    movieData.sort((a, b) => a.Movie < b.Movie);
    movie.className = "desc";
    } else {
    movieData.sort((a, b) => a.Movie > b.Movie);
    movie.className = "asc";
    }
    processData(movieData);
}

function loadData() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/", true);

    xhttp.onreadystatechange = function() {
        if(this.readyState == 4) {
            if(this.status == 200) { 
            let json = JSON.parse(this.responseText);
            movieData = processData(json["data"]);
            document.getElementById('error').style.display = "none";
            document.getElementById('error').innerHTML = "";
            }
            if(this.status == 500) {
                document.getElementById('error').style.display = "block";
                document.getElementById('error').innerHTML = this.responseText;
            }
        }
    }
    xhttp.send();
}

function processData(content) {
    var table = document.getElementById("movies");
    clearData();
    var tbody = document.createElement("tbody");
    for(let i = 0; i < content.length; i++) {
        let tr = document.createElement("tr");
        tr.id = i;
        let movie = document.createElement('td');
        let language = document.createElement('td');
        movie.textContent = content[i]["Movie"];
        language.textContent = content[i]["Language"];
        movie.scope="col";
        language.scope="col";
        tr.appendChild(movie);
        tr.appendChild(language);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    return content;
}

function clearData() {
    var tbody = document.getElementById("movies").querySelector("tbody");
    if(tbody === null || tbody === undefined) return;
    tbody.remove();
}



