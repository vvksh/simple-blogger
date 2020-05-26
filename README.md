# Simple Blogger

This is a simple blog generator which creates a blog based on a user's github projects. It creates a post for each github project and uses the content of project README as post content.

### [Demo- my blog](https://vksah32.github.io)

## How to create your own blog?

- Clone this repo
- Change `githubUserName`, `linkedinUserName`, `twitterUserName` in `index.js` to yours 
- Modify `excluded_repos` array in `index.js` based on your use case
- Create a github repo: `<<your-username>>.github.io`
- Commit changes and push to  `<<your-username>>.github.io`
- Your blog is live at `<<your-username>>.github.io`
- You can also set up custom domain. See [github-guide](https://help.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site).


## Motivation

I trired various blog generators such as Jekyll, Hugo, Ghost, but they seemed to require some maintenance overhead. Plus, for my use case, most of my post would be related to a coding project, so
I didn't want to write a project README  AND a corresponding "blog" post leading to duplication of work.

I also felt like the blog generators had too many nuts and bolts for my taste. I have tried to keep this project as vanilla as possible using plain javascript, css and html. The only dependencies are - `showdownjs`, `highlight.js` and `mathjax` -> used to render markdown (with code blocks and latex) as html.

## Design choices

- On demand rendering - every page load fetches info from github using their api
- When a post is clicked, the README content is fetched as markdown text and rendered into HTML
- Because of on-demand fetching, there is noticeable lag on page load, which is fine for my use case.
- Uses [showdownjs](https://github.com/showdownjs/showdown) to convert markdown to HTML
- Uses [highlight.js](https://highlightjs.org/) and [mathjax](https://www.mathjax.org/) to format the code blocks and latex blocks once the markdown is converted to html
- Excludes forked projects by default
- Use *whitey.css* for theme. I took whitey.css from [Typora](https://typora.io/) editor 
- Can skip repos if you don't want to create a post for certain projects (eg: unfinished/not-started projects)

## To-do
- ~~Look into latex rendering support~~ [Issue #1](https://github.com/vksah32/simple-blogger/issues/1)
- ~~Add support for non-project posts (don't wanna have to create a repo everytime you have to write a post). I am thinking of adding a special repo- "blog-posts" and fetch all files from that repo as posts.~~ [Issue #2](https://github.com/vksah32/simple-blogger/issues/2)
- [Maybe] Add recent github commits/updates to the project page




