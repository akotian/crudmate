var Post= React.createClass({
  render: function() {
    return (
      <div className="post">
        <span className="postTitle">
          {this.props.title}
        </span>
        <span className="postShortDescription">
          {this.props.short_description}
        </span>
      </div>
    );
  }
});

var PostForm = React.createClass({
  getInitialState: function() {
    return {title: '', short_description: ''}

  },
  handleTitleChange: function(e) {
    this.setState({title: e.target.value});
  },
  handleShortDescriptionChange: function(e) {
    this.setState({short_description: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.state.title.trim();
    var short_description = this.state.short_description.trim();
    if (!title) {
      return;
    }
    this.props.onPostSubmit({title: title, short_description: short_description});
    this.setState({title: '', short_description: ''});

  },
  render: function() {
    return (
      <div className="postForm">
      <form className="postForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Title"
          value={this.state.title} onChange={this.handleTitleChange} />
        <input type="text" placeholder="Short Description"
          value={this.state.short_description} onChange={this.handleShortDescriptionChange} />
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
        <Post title={post.title} short_description={post.short_description} key={post.id} />
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
