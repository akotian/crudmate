var Post= React.createClass({
  getInitialState: function() {
    return {is_deleted: false};
  },
  handlePostDelete: function() {
    $.ajax({
      url: this.props.url + this.props.post_id,
      dataType: 'json',
      type: 'DELETE',
    }).done(function(response) {
      this.setState({is_deleted: true});
    }.bind(this))
    .fail(function(xhr, status, err) {
      alert("Could not delete component");
    }.bind(this));
  },
  render: function() {
    var Styles = {
      isDeleted : {
        display: 'none'
      },
    };
    return (
      <div className="post row" style={this.state.is_deleted ? Styles.isDeleted : {}}>
        <div className="col-md-3 col-xs-3">
          <div className="">
            <a href="#" className="thumbnail">
              <img src={this.props.profile_image} alt="Profile Image" />
            </a>
           </div>
        </div>
        <div className="col-md-9 col-xs-9">
          <div className="row">
            <div className="col-md-10 col-xs-10">
              <strong>author{this.props.key}</strong>
            </div>
            <div className="col-md-2 col-xs-2">
              <span className="glyphicon glyphicon-remove"
                aria-hidden="true" onClick={this.handlePostDelete}>
              </span>
            </div>
          </div>
          <div className="row">
            {this.props.title}
          </div>
          <div className="row">
            {this.props.description}
          </div>
          <div className="row">
            <div className="col-md-3 col-xs-3">Repo</div>
            <div className="col-md-9 col-xs-9">
              <a href="{this.props.repo_url}">{this.props.repo_url}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var NewPost = React.createClass({
  render: function () {
    return (
      <div className="post-form">
        <input type="text" placeholder="Submit New Project"
        onClick={this.props.onInputClicked} />
      </div>
    );
  }
});

var PostForm = React.createClass({
  getInitialState: function() {
    return {title: '', description: '',
            repo_url: ''};

  },
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },
  handleDescriptionChange: function(e) {
    this.setState({description: e.target.value});
  },
  handleRepoUrlChange: function(e) {
    this.setState({repo_url: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var description = this.state.description.trim();
    var repo_url = this.state.repo_url.trim();
    if (!title) {
      alert("Please provide a title");
      return;
    }
    this.props.onPostSubmit(
      {title: title, description: description, repo_url: repo_url});
    this.setState({title: '', description: '', repo_url: ''});

  },
  render: function() {
    return (
      <div className="post-form">
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Title"
               aria-describedby="sizing-addon2" value={this.state.title}
               onChange={this.handleTitleChange} />
          </div>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Description"
               aria-describedby="sizing-addon2" value={this.state.description}
               onChange={this.handleDescriptionChange} />
          </div>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Repository Url"
               aria-describedby="sizing-addon2" value={this.state.repo_url}
               onChange={this.handleRepoUrlChange} />
          </div>
          <div className="btn-group row">
            <div className="col-md-6 col-xs-6">
              <button type="submit" className="btn btn-success">Submit</button>
            </div>
            <div className="col-md-6 col-xs-6">
              <button type="button" className="btn btn-danger" onClick={this.props.onCancelClicked}>
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
});

var PostList = React.createClass({
  render: function() {
    var url = this.props.url;
    var postNodes = this.props.data.map(function(post) {
      return (
        <Post title={post.title} description={post.description}
          key={post.id} repo_url={post.repo_url}
          profile_image={post.profile_image}
          post_id={post.id}
          url={url} />
      );
    });

    return (
      <div className="post-list">
        {postNodes}
      </div>
    );
  }
});

var PostBox = React.createClass({
  loadPostsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false
    }).done(function(data) {
        this.setState({data: data});
    }.bind(this))
    .fail(function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
    }.bind(this))
  },
  getInitialState: function() {
    return {data: [], newSubmission: false};
  },
  componentDidMount: function() {
    this.loadPostsFromServer();
    setInterval(this.loadPostsFromServer, this.props.pollInterval)
  },
  handlePostSubmit: function(post) {
    var posts = this.state.data;
    post.id = Date.now();
    var newPosts = posts.concat([post]);
    this.setState({data: newPosts});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: post,
    }).done(function(newPost) {
        this.setState({data: posts.concat(newPost)});
        this.togglePostForm();
    }.bind(this))
    .fail(function(xhr, status, err) {
        this.setState({data: posts});
        console.error(this.props.url, status, err.toString());
    }.bind(this));
  },
  togglePostForm: function() {
    this.setState({ newSubmission: !this.state.newSubmission});
  },
  render: function() {
    return (
      <div className="postBox">
        {this.state.newSubmission ?
          <PostForm onPostSubmit={this.handlePostSubmit} onCancelClicked={this.togglePostForm} /> :
          <NewPost onInputClicked={this.togglePostForm} /> }
        {this.state.newSubmission ?
          null :
          <PostList data={this.state.data} url={this.props.url} /> }
      </div>
    );
  }
});

ReactDOM.render(
  <PostBox url="/api/posts/" pollInterval={2000} />,
  document.getElementById('content')
);
