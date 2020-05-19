// Change these to your usernames 
var githubUserName = 'vksah32'
var linkedinUserName = 'vksah'
var twitterUserName = 'viveksyz'

//Default readme filename
var readmeFile = 'README.md'

// Toggle it to false if you don't have blog posts
var includeBlogPosts = true;

// Change this if your blog-post repo is different
var blogPostsRepo = "blog-posts"

var numRecentResponses = 10;
var numAllResponses = 100;

//These repos are excluded from the site
var excluded_repos = ['vksah32.github.io', 'ontrack_android_app', 'resume', 'foogle', 'ML-stuff', 'multichain-client', 'blog-posts', 'distributed-systems-6.824']

/**
 * Adds a list of recent posts and project pages on home page
 */
function fetchRecent() {
    addAbout() 
    fetchProjects(numRecentResponses, addProjectsToPage);
    if (includeBlogPosts) {
        fetchPosts(numRecentResponses, addPostsToPage);
    }
}

/**
 * Adds list of all blog posts and removes projects 
 */
function fetchAllPosts() {
    fetchPosts(numAllResponses, addPostsToPage);
    document.getElementById("projects").innerHTML = ""
}

/**
 * Adds list of all projects and removes blogs list
 */
function fetchAllProjects() {
    fetchProjects(numAllResponses, addProjectsToPage);
    document.getElementById("posts").innerHTML = ""
}

/**
 * Fetches github projects for a user and applies user supplied function to the projects
 * @param {number} numResponses nu,ber of projects to fetch
 * @param {function} projectResponseHandler function to apply to projects
 */
function fetchProjects (numResponses, projectResponseHandler) {
    const getProjectsEndpoint = `https://api.github.com/users/${githubUserName}/repos?per_page=${numResponses}&sort=updated`;
    callApi(getProjectsEndpoint, numResponses, projectResponseHandler)
}

/**
 * Fetches blog posts for a user and applies user supplied function to the blog posts
 * @param {number} numResponses number of posts to fetch
 * @param {function} projectResponseHandler function to apply to blog posts
 */
function fetchPosts (numResponses, postResponseHandler) {
   var getPostEndpoint = `https://api.github.com/repos/${githubUserName}/${blogPostsRepo}/contents?per_page=${numResponses}&sort=updated`
   callApi(getPostEndpoint, numResponses, postResponseHandler)
}

/**
 * General purpose method to trigger a HTTP GET request to a given endpoint and apply user specified function to the response
 * @param {string} endpoint endpoint to call
 * @param {number} numResponses this will be input to responseHandler; used here to differentiate between All vs Recent mode
 * @param {function} responseHandler user specified function to call on the http response of the call
 */
function callApi(endpoint, numResponses, responseHandler) {
    console.log("fetching "+ endpoint)
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
             if (numResponses > 0) {
                // this for addPosts to addProjects
                responseHandler(numResponses, this.responseText);
             } else {
                 // this for renderMarkdownHandler
                responseHandler(this.responseText);
             }
            
         }
    };

    xhttp.open("GET", endpoint , true);
    xhttp.setRequestHeader("Accept", "application/vnd.github.inertia-preview+json");
    xhttp.send(null);
}

/**
 * Adds about info (twitter, github, linkedin)
 */
function addAbout() {
    var aboutHtml = `
            <a class="fa fa-github" href="https://github.com/${githubUserName}"> </a> / 
            <a class="fa fa-linkedin" href="https://www.linkedin.com/in/${linkedinUserName}/"> </a> /
            <a class="fa fa-twitter" href="https://www.twitter.com/${twitterUserName}/"> </a>
        `;
    document.getElementById("about").innerHTML = aboutHtml;
}

/**
 * Adds a list of blogs to homepage
 * @param {number} numResponses used here to differentiate between All vs Recent mode
 * @param {blob} blogPostArrayRawResponse response returned by http call
 */
function addPostsToPage(numResponses, blogPostArrayRawResponse) {
    const blogPostArray = JSON.parse(blogPostArrayRawResponse)
    console.log(blogPostArray)
    var out = "<h3>Recent Posts</h3>"
    var linkToAll = '<div style="text-align: center; margin-top: 2%;text-decoration: underline; " onclick="fetchAllPosts()" ><small><i style="opacity: 0.6"> See all posts </i> </small></div>';
    if (numResponses > numRecentResponses) {
        out = "<h3>All Posts</h3>";
        linkToAll = ""
    }
    for(i = 0; i < blogPostArray.length; i++) {
        out +=  `<div style="margin-top:10px"> <a  href="/post.html?type=blog&fileName=${blogPostArray[i].name}">${blogPostArray[i].name} </a></div>`;
    }
    out += linkToAll
    document.getElementById("posts").innerHTML = out;
}

/**
 * Adds a list of projects to homepage
 * @param {number} numResponses used here to differentiate between All vs Recent mode
 * @param {blob} blogPostArrayRawResponse response returned by http call
 */
function addProjectsToPage(numResponses, projectsArrayRawResponse) {
    const projectsArray = JSON.parse(projectsArrayRawResponse)
    console.log(projectsArray)
    var out = "<h3>Recent Projects</h3>"
    var linkToAll = '<div style="text-align: center; margin-top: 2%;text-decoration: underline; " onclick="fetchAllProjects()" ><small><i style="opacity: 0.6"> See all projects </i> </small></div>';
    if (numResponses > numRecentResponses) {
        out = "<h3>All Projects</h3>";
        linkToAll = ''
    }
    var i;
    for(i = 0; i < projectsArray.length; i++) {
        // don't add forked repos
        if (!excluded_repos.includes(projectsArray[i].name) && !projectsArray[i].fork) {

            var description = ''
            if (projectsArray[i].description != null) {
                description = projectsArray[i].description
            }
            out +=  `<div style="margin-top:10px"> <a  href="/post.html?type=project&repoName=${projectsArray[i].name}&filename=${readmeFile}">${projectsArray[i].name} </a><i style="opacity: 0.6"> ${description}</i> </div>`;
        }
    }
    out +=   linkToAll  

    document.getElementById("projects").innerHTML = out;
}

/**
 * Gets a post content from github and adds the content to 'post' html page
 */
function getPost() {
    console.log("getting post")
    const urlParams = new URLSearchParams(window.location.search);
    var type = urlParams.get('type')
    if (type == 'project' ) {
        var repoName = urlParams.get('repoName')
        var githubLink = `https://github.com/${githubUserName}/${repoName}`
        document.getElementById("github-link").innerHTML = `<a class="fa fa-github" href="${githubLink}"> See code</a>`
        callApi(getDownloadUrl(repoName, "README.md"), 0, renderMarkdown)
    } else {
        var fileName = urlParams.get('fileName')
        callApi(getDownloadUrl(blogPostsRepo, fileName), 0, renderMarkdown)
    }
}

/**
 * Given reponame and filename, this function returns the download link
 * @param {string} repoName
 * @param {string} filename
 */
function getDownloadUrl(repoName, filename) {
    return `https://raw.githubusercontent.com/vksah32/${repoName}/master/${filename}`
}

/**
 * Converts markdown content to html and adds to div "post-content" and then dynamically loads mathjax
 * @param text  markdown post content as string
 */
function renderMarkdown(text) {
    var converter =  new showdown.Converter();
    document.getElementById("post-content").innerHTML = converter.makeHtml(text);
    loadMathJax()
}

/**
 * Dynamically loads mathjax
 * refer to: https://docs.mathjax.org/en/v2.7-latest/advanced/dynamic.html
 *
 * The default math delimiters are $$...$$ and \[...\] for displayed mathematics, and \(...\) for in-line mathematics.
 * Note in particular that the $...$ in-line delimiters are not used by default.
 * However, since Typora (editor of choice) only supports $...$ for in-line mathematics, adding that into Mathkax config
 */
function loadMathJax() {
    console.log("adding mathjax")
    var head = document.getElementsByTagName("head")[0], script;
    script = document.createElement("script");
    script.type = "text/x-mathjax-config";
    script[(window.opera ? "innerHTML" : "text")] =
        "MathJax.Hub.Config({\n" +
        "  tex2jax: { inlineMath: [['$','$']] }\n" +
        "});";
    head.appendChild(script);

    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
    head.appendChild(script);
}