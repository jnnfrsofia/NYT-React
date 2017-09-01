// Include React
var React = require("react");

// Here we include all of the sub-components
var Form = require("./children/Form");
var Results = require("./children/Results");
var History = require("./children/Saved");

// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

// Creating the Main component
var Main = React.createClass({

  // Here we set a generic state associated with the number of clicks
  // Note how we added in this history state variable
  getInitialState: function() {
    return { searchTerm: "", results: "", saved: [] };
  },

  // The moment the page renders get the saved articles
  componentDidMount: function() {
    helpers.getHistory().then(function(response) {
      console.log(response);
      if (response !== this.state.history) {
        console.log("Saved", response.data);
        this.setState({ saved: response.data });
      }
    }.bind(this));
  },

  // If the component changes (i.e. if a search is entered)...
  componentDidUpdate: function() {

    // Run the query for the article
    helpers.runQuery(this.state.searchTerm).then(function(data) {
      if (data !== this.state.results) {
        console.log("Title", data);
        this.setState({ results: data });

        // After we've received the result... then post the articles to our saved articles.
        helpers.saveArticle(this.state.searchTerm).then(function() {
          console.log("Updated!");

          // After we've done the post... then get the updated list of saved articles
          helpers.getSaved().then(function(response) {
            console.log("Saved Articles", response.data);

            this.setState({ savedArticles: response.data });

          }.bind(this));
        }.bind(this));
      }
    }.bind(this));
  },
  // This function allows childrens to update the parent.
  setTerm: function(term) {
    this.setState({ searchTerm: term });
  },

  saveArticle: function(title, date, url){
    helpers.postArticle(title, date, url);
    this.getArticle();
  },

  deleteArticle: function(article){
    console.log(article);
    axios.delete('/api/saved/' + article._id)
      .then(function(response){
        this.setState({
          savedArticles: response.data
        });
        return response;
      }.bind(this));

    this.getArticle();
  },

  getArticle: function(){
    axios.get('/api/saved')
      .then(function(response){
        this.setState({
          savedArticles: response.data
        });
      }.bind(this));
  },
  // Here we render the function
  render: function() {
    return(

      <div className="container">

        <div className="row">

          <div className="jumbotron" >
            <h2 className="text-center">New York Times Article Search and Save</h2>
            <p className="text-center">Search for articles by topic within a certain year range & save articles you find interesting!</p>
          </div>
        </div>
        <div className="row">

          <Form setTerm={this.setTerm}/>

        </div>

        <div className="row">
      
          <Results results={this.state.results} saveArticle={this.saveArticle}/>

        </div>

        <div className="row">
        
          <Saved savedArticles={this.state.savedArticles} deleteArticle={this.deleteArticle} />

        </div>
      </div>
    )
  }
});

// Export the component back for use in other files
module.exports = Main;
