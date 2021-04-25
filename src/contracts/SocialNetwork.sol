pragma solidity ^0.5.0;

contract SocialNetwork {
  // Code goes here...
  uint public imageCount = 0;
  uint public postCount = 0;
  uint public userCount = 0;
  uint public videoCount = 0;

  string public name = "PRATIK";


  //Store Images
  mapping(uint => Image) public images;

  mapping(uint => Post) public posts;

  mapping(address => User) public users;
  address[] public userAddr;
 

  mapping(string => address) public usernames;
  mapping(uint => Video) public videos;

  // mapping(address => address[]) followers;
  // mapping(address => address[]) following;

  struct Video {
    uint id;
    string hash;
    string title;
    address author;
  }

  event VideoUploaded(
    uint id,
    string hash,
    string title,
    address author
  );

  struct User {
    string username;
    string email;
    string password;
    string about;
    address payable user;
  }

  struct Image{
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address payable author;
    uint likes;
    uint dislikes;
  }

  struct Post {
    uint id;
    string content;
    uint tipAmount;
    address payable author;
    uint likes;
    uint dislikes;
  }

  event UserCreated(
    string username,
    string email,
    string password,
    string about,
    address payable user
  );

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  );

  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  );

  event PostTipped(
    uint id,
    string content,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  );

  event ImageLiked(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  ); 
  event ImageDisliked(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  ); 

  event PostLiked(
    uint id,
    string content,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  ); 
  event PostDisliked(
    uint id,
    string content,
    uint tipAmount,
    address payable author,
    uint likes,
    uint dislikes
  );

  event ProfileUpdated(
    address payable userid,
    string email,
    string password,
    string about
  );

  // event Follow(
  //   address payable user,
  //   address user_tbf
  // );

  constructor() public {
  }

  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
    require(bytes(_videoHash).length > 0);
    // Make sure video title exists
    require(bytes(_title).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Increment video id
    videoCount ++;

    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);
    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);
  }

  //Creating Images
  function uploadImage(string memory _imgHash, string memory _description) public{

    // Make sure the image hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure image description exists
    require(bytes(_description).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));


    //Increment image count
    imageCount++;

    //Add image to contract
    images[imageCount] = Image(imageCount,_imgHash,_description, 0, msg.sender, 0, 0);

    //Trigger the event
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender, 0, 0);

  }

  function createPost(string memory _content) public {

    // Require valid content
    require(bytes(_content).length > 0);
    
    // Increment the post count
    postCount ++;
    // Create the post
    posts[postCount] = Post(postCount, _content, 0, msg.sender, 0, 0);

    // Trigger event
    emit PostCreated(postCount, _content, 0, msg.sender, 0, 0);
  }

  function createUser(string memory username, string memory email, string memory password_enc, string memory about) public {
    // No need to check validity of arguments as they already have been checked on the frontend.

    userCount++;
    users[msg.sender] = User(username, email, password_enc, about, msg.sender);
    usernames[username] = msg.sender;
    userAddr.push(msg.sender);

    emit UserCreated(username, email, password_enc, about, msg.sender);
  }

  function getAllUsers() public returns (address[] memory){
    return userAddr;
  }

  function getUser(address id) public returns(address) {
    
    return users[id].user;
  }

  function getUsername(string memory uname) public returns(bool) {
    if(usernames[uname] != address(0)) {
      return true;
    }
    return false;
  }

  function getUserDetails(address id) public returns(
    string memory username, 
    string memory email,
    string memory password,
    string memory about
    ) {
    User memory user = users[id];
    return (user.username, user.email, user.password, user.about);
  }

  function getUserProfile(string memory uname) public returns(
    string memory email,
    string memory about,
    address uaddr
  ) {
    address addr = usernames[uname];
    return(users[addr].email, users[addr].about, addr);
  }

  function setUserDetails(string memory email, string memory password, string memory about) public {
    User storage user = users[msg.sender];
    user.email = email;
    user.password = password;
    user.about = about;

    emit ProfileUpdated(msg.sender, email, password, about);
  }

  // function follow(address user_tbf) public {
  //   require(user_tbf != address(0), 'No account');
  //   require(user_tbf != msg.sender, 'Cannot follow yourself');
  //   followers[user_tbf].push(msg.sender);
  //   following[msg.sender].push(user_tbf);

  //   emit Follow(msg.sender, user_tbf);
  // }

  // function unFollow(address user_tbf) public {
  //   require(user_tbf != address(0), 'No account');
  //   uint len = followers[user_tbf].length;
  //   for(uint i = 0; i < len; i++) {
  //     if(followers[user_tbf][i] == msg.sender) {
  //       followers[user_tbf][i] = followers[user_tbf][len - 1];
  //       delete followers[user_tbf][len - 1];
  //       followers[user_tbf].length--;
  //     }
  //   }
  //   len = following[msg.sender].length; 
  //   for(uint i = 0; i < len; i++) {
  //     if(following[msg.sender][i] == user_tbf) {
  //       followers[msg.sender][i] = followers[msg.sender][len - 1];
  //       delete followers[msg.sender][len - 1];
  //       followers[msg.sender].length--;
  //     }
  //   }
  // }

  // function getFollowers(address addr) public view returns(address[] memory) {
  //   require(addr != address(0), 'No account');
  //   return followers[addr];
  // }

  // function getFollowing(address addr) public view returns(address[] memory) {
  //   require(addr != address(0), 'No account');
  //   return following[addr];
  // }

  // function follows(address user2, address user1) public view returns(bool) {
  //   require(user1 != address(0), 'No account');
  //   require(user2 != address(0), 'No account');
  //   uint len = followers[user1].length; // user2 follows user1
  //   for(uint i = 0; i < len; i++) {
  //     if(followers[user1][i] == user2) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  function tipImageOwner(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= imageCount);
    // Fetch the image
    Image memory _image = images[_id];
    // Fetch the author
    address payable _author = _image.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _image.tipAmount = _image.tipAmount + msg.value;
    // Update the image
    images[_id] = _image;
    // Trigger an event
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author, _image.likes, _image.dislikes);
  } 

  function tipPost(uint _id) public payable {

    require(_id > 0 && _id <= postCount);
    // Fetch the post
    Post memory _post = posts[_id];
    // Fetch the author
    address payable _author = _post.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _post.tipAmount = _post.tipAmount + msg.value;
    // Update the post
    posts[_id] = _post;

    emit PostTipped(postCount, _post.content, _post.tipAmount, _author, _post.likes, _post.dislikes);
  }

  function likeImage(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= imageCount);
    // Fetch the image
    Image memory _image = images[_id];
    // Increment the likes
    _image.likes = _image.likes + (msg.value*10);
    // Update the image
    images[_id] = _image;
    // Trigger an event
    emit ImageLiked(_id, _image.hash, _image.description, _image.tipAmount, _image.author, _image.likes,_image.dislikes);
  } 

  function disLikeImage(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= imageCount);
    // Fetch the image
    Image memory _image = images[_id];
    // Increment the dislikes
    _image.dislikes = _image.dislikes + (msg.value*10);
    // Update the image
    images[_id] = _image;
    // Trigger an event
    emit ImageDisliked(_id, _image.hash, _image.description, _image.tipAmount, _image.author, _image.likes,_image.dislikes);
  }

  function likePost(uint _id) public payable {

    require(_id > 0 && _id <= postCount);
    // Fetch the post
    Post memory _post = posts[_id];
    // Increment the likes
    _post.likes = _post.likes + (msg.value*10);
    // Update the post
    posts[_id] = _post;

    emit PostLiked(postCount, _post.content, _post.tipAmount, _post.author,_post.likes,_post.dislikes);
  }

  function disLikePost(uint _id) public payable {

    require(_id > 0 && _id <= postCount);
    // Fetch the post
    Post memory _post = posts[_id];
    // Increment the dislikes
    _post.dislikes = _post.dislikes + (msg.value*10);
    // Update the post
    posts[_id] = _post;

    emit PostDisliked(postCount, _post.content, _post.tipAmount, _post.author,_post.likes,_post.dislikes);
  }

}