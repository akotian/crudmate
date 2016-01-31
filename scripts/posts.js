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
    return (
      <div className="postList">
        <Post title="Post 1" description="This is post 1" />
        <Post title="Post 2" description="This is post 2" />
      </div>
    );
  }
});

var PostBox = React.createClass({
  render: function() {
    return (
      <div className="postBox">
        <PostForm />
        <h1>Posts</h1>
        <PostList />
      </div>
    );
  }
});

ReactDOM.render(
  <PostBox />,
  document.getElementById('content')
);
