'use strict';

function Article (rawDataObj) {
  this.author = rawDataObj.author;
  this.authorUrl = rawDataObj.authorUrl;
  this.title = rawDataObj.title;
  this.category = rawDataObj.category;
  this.body = rawDataObj.body;
  this.publishedOn = rawDataObj.publishedOn;
}

// REVIEW: Instead of a global `articles = []` array, let's attach this list of all articles directly to the constructor function. Note: it is NOT on the prototype. In JavaScript, functions are themselves objects, which means we can add properties/values to them at any time. In this case, the array relates to ALL of the Article objects, so it does not belong on the prototype, as that would only be relevant to a single instantiated Article.
Article.all = [];

// XCOMMENT: Why isn't this method written as an arrow function?
// Because it would have the wrong contextual this in it.
Article.prototype.toHtml = function() {
  let template = Handlebars.compile($('#article-template').text());

  this.daysAgo = parseInt((new Date() - new Date(this.publishedOn))/60/60/24/1000);

  // xCOMMENT: What is going on in the line below? What do the question mark and colon represent? How have we seen this same logic represented previously?
  // Not sure? Check the docs!
  // Becuase this is a ternary operator and its just a way to do an if/else statement. The question mark signals the end of the argument and the colon seperates the choices.
  this.publishStatus = this.publishedOn ? `published ${this.daysAgo} days ago` : '(draft)';
  this.body = marked(this.body);

  return template(this);
};

// REVIEW: There are some other functions that also relate to all articles across the board, rather than just single instances. Object-oriented programming would call these "class-level" functions, that are relevant to the entire "class" of objects that are Articles.

// REVIEW: This function will take the rawData, how ever it is provided, and use it to instantiate all the articles. This code is moved from elsewhere, and encapsulated in a simply-named function for clarity.

// xCOMMENT: Where is this function called? What does 'rawData' represent now? How is this different from previous labs?
// The rawdata now represent an object through the constructer Article
Article.loadAll = articleData => {
  articleData.sort((a,b) => (new Date(b.publishedOn)) - (new Date(a.publishedOn)))

  articleData.forEach(articleObject => Article.all.push(new Article(articleObject)))
}

// REVIEW: This function will retrieve the data from either a local or remote source, and process it, then hand off control to the View.
Article.fetchAll = () => {
  // REVIEW: What is this 'if' statement checking for? Where was the rawData set to local storage?
  //the if statement checks the localstorage for data then if it is empty the else statement checks the "database" for data
  if (localStorage.rawData) {

    Article.loadAll();

  } else {
    $.getJSON("../data/hackerIpsum.json")
    .then(function(data) {
    Article.loadAll(data)
    localStorage.setItem('rawData', JSON.stringify(data))
    })
   
    // (data => articleView.initIndexPage())
    
    
    
    .catch( err => console.error("we suck", err));
  }
}
Article.loadAll();
Article.fetchAll();

console.log(Article.all);