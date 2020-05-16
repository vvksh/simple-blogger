var githubUserName = 'vksah32'
var linkedinUserName = 'vksah'
var twitterUserName = 'viveksyz'

var excluded_repos = ['vksah32.github.io', 'ontrack_android_app', 'resume', 'foogle', 'ML-stuff', 'multichain-client']
function fetchInfo (numProjects) {
    console.log("fetching")
    addAbout() 
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            handleGithubResponse(myArr);
            
         }
    };

    xhttp.open("GET", `https://api.github.com/users/${githubUserName}/repos?per_page=${numProjects}&sort=updated`, true);
    xhttp.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
    xhttp.send(null);
}

function addAbout() {
    var aboutHtml = `
            <a class="fa fa-github" href="https://github.com/${githubUserName}"> </a> / 
            <a class="fa fa-linkedin" href="https://www.linkedin.com/in/${linkedinUserName}/"> </a> /
            <a class="fa fa-twitter" href="https://www.twitter.com/${twitterUserName}/"> </a>
        `;
    document.getElementById("about").innerHTML = aboutHtml;
}

function handleGithubResponse(arr) {
    console.log(arr)
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        // don't add forked repos
        if (!excluded_repos.includes(arr[i].name) && !arr[i].fork) {
            var description = ''
            if (arr[i].description != null) {
                description = arr[i].description
            }
            out +=  `<div style="margin-top:10px"> <a  href="/post.html?repoName=${arr[i].name}">${arr[i].name} </a><i style="opacity: 0.6"> ${description}</i> </div>`;
        }
    }
    document.getElementById("content").innerHTML = out;
}

function redirect(repoName) {
    window.location.href = "/post.html?repoName="+repoName
}


function getPost() {
    console.log("getting post")
    const urlParams = new URLSearchParams(window.location.search);
    var repoName = urlParams.get('repoName')
    var githubLink = `https://github.com/${githubUserName}/${repoName}`
    var homeLink = 'index.html'
    document.getElementById("home-link").innerHTML = `<a class="fa fa-home" href="${homeLink}"> Home </a>`
    document.getElementById("github-link").innerHTML = `<a class="fa fa-github" href="${githubLink}"> See code</a>`

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            renderMD(this.responseText);
         }
    };
    xhttp.open("GET", getReadmeUrl(repoName), true);
    xhttp.send(null);
}

function getReadmeUrl(repoName) {
    return `https://raw.githubusercontent.com/vksah32/${repoName}/master/README.md`
}

/**
 * Converts markdown content to html and adds to div "post-content" and then dynamically loads mathjax
 * @param text  markdown post content as string
 */
function renderMD(text) {
    var converter =  new showdown.Converter();
    document.getElementById("post-content").innerHTML = converter.makeHtml(text);
    loadMathJax()
}

/**
 * Dynamically loads mathjax
 * refer to: https://docs.mathjax.org/en/v2.7-latest/advanced/dynamic.html
 */
function loadMathJax() {
    console.log("adding mathjax")
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
    document.getElementsByTagName("head")[0].appendChild(script);
}
