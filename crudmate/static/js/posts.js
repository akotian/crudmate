var Post= React.createClass({
  render: function() {
    return (
      <div className="post">
        <span className="postTitle">
          {this.props.title}
        </span>
        <span className="postDescription">
          {this.props.description}
        </span>
        <span className="postDescription">
          {this.props.repo_url}
        </span>
      </div>
    );
  }
});

var PostForm = React.createClass({
  getInitialState: function() {
    return {title: '', description: '',
            reop_url: ''};

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
      return;
    }
    this.props.onPostSubmit(
      {title: title, description: description, repo_url: repo_url});
    this.setState({title: '', description: '', repo_url: ''});

  },
  render: function() {
    return (
      <div className="postForm">
      <form className="postForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Title"
          value={this.state.title} onChange={this.handleTitleChange} />
        <input type="text" placeholder="Description"
          value={this.state.description} onChange={this.handleDescriptionChange} />
        <input type="text" placeholder="Repo Url"
          value={this.state.repo_url} onChange={this.handleRepoUrlChange} />
        <input type="submit" value="Post" />
      </form>
      </div>
    );
  }
});

var PostList = React.createClass({
  render: function() {
    var postNodes = this.props.data.map(function(post) {
      return (
        <Post title={post.title} description={post.description} key={post.id} repo_url={post.repo_url} />
      );
    });

    return (
      <div className="postList">
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
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
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
      success: function(newPost) {
        this.setState({data: posts.concat(newPost)});
      }.bind(this),
      error: function(xhr, status, err) {
        this.setState({data: posts});
        console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="postBox">
        <PostForm onPostSubmit={this.handlePostSubmit} />
        <h1>Posts</h1>
        <PostList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
  <PostBox url="/api/posts/" pollInterval={2000} />,
  document.getElementById('content')
);
