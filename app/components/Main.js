// Include React
var React = require("react");

// Here we include all of the sub-components
var Form = require("./children/Form");
var Results = require("./children/Results");
var Saved = require("./children/Saved");

// Helper for making AJAX requests to our API
var helpers = require("./utils/helpers");

// Creating the Main component
var Main = React.createClass({

  // Here we set a generic state associated with the number of clicks
  getInitialState: function(){
    return {
      topic: "",
      startYear: "",
      endYear: "",
      results: [],
      savedArticles: []
    }
  },  

  // We use this function to allow children to update the parent with searchTerms.
  setTerm: function(tpc, stYr, endYr){
    this.setState({
      topic: tpc,
      startYear: stYr,
      endYear: endYr
    })
  },
  saveArticle: function(title, date, url){
    helpers.postArticle(title, date, url);
    this.getArticle();
  },
  searchArticle: function(tpc, stYr, endYr){
    helpers.runQuery(tpc, stYr, endYr);
    return {
      results: response.data
    }
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
            <h2 className="text-center">New York Times Article Scrubber</h2>
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
