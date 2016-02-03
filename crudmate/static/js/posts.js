var posts = [
  {'id': 1, 'title': 'My first post', 'description': 'My first description'},
  {'id': 2, 'title': 'My second post', 'description': 'My second description'}
]

var Post= React.createClass({
  render: function() {
    return (
      <div className="post">
        <span className="postTitle">
          {this.props.title}
        </span>
        <span className="postDesciption">
          {this.props.description}
        </span>
      </div>
    );
  }
});

var PostForm = React.createClass({
  render: function() {
    return (
      <div className="postForm">
      Wassa, I am a post form!
      </div>
    );
  }
});

var PostList = React.createClass({
  render: function() {
    var postNodes = this.props.data.map(function(post) {
      return (
        <Post title={post.title} description={post.description} key={post.id} />
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
  render: function() {
    return (
      <div className="postBox">
        <PostForm />
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
