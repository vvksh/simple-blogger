

function fetchInfo (numProjects) {
    console.log("fetching")
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            handleGithubResponse(myArr);
            
         }
    };
    xhttp.open("GET", "https://api.github.com/users/vksah32/repos?per_page="+numProjects+"&sort=updated", true);
    xhttp.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
    xhttp.send(null);
}

https://github.com/vksah32/mapreduce/blob/master/README.md

function handleGithubResponse(arr) {
    console.log(arr)
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out +=  '<a class="link" href="/post.html?repoName='+arr[i].name + '>'+ arr[i].name +'\')">' + arr[i].name + '</a><br>';


        // out +=  '<div class="link" onclick="redirect(\''+ arr[i].name +'\')">' + arr[i].name + '</div><br>';
    }
    document.getElementById("content").innerHTML = out;
}

function redirect(repoName) {
    // window.location.href = decodeURI("/post.html?repoName="+repoName)
    window.location.href = "/post.html?repoName="+repoName
}

function getPost() {
    console.log("getting post")
    const urlParams = new URLSearchParams(window.location.search);
    var repoName = urlParams.get('repoName')

    var readMeUrl = 'https://raw.githubusercontent.com/vksah32/'+ repoName + '/master/README.md'
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
            renderMD(this.responseText);
         }
    };
    xhttp.open("GET", readMeUrl, true);
    // xhttp.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
    xhttp.send(null);
}

function renderMD(text) {
    var converter =  new showdown.Converter();
    document.getElementById("post-content").innerHTML = converter.makeHtml(text);

}

