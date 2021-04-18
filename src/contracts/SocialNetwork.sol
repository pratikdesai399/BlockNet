pragma solidity ^0.5.0;

contract SocialNetwork {
  // Code goes here...
  uint public imageCount = 0;
  uint public postCount = 0;
  uint public userCount = 0;
  string public name = "PRATIK";


  //Store Images
  mapping(uint => Image) public images;

  mapping(uint => Post) public posts;

  mapping(address => User) public users;

  mapping(string => bool) public usernames;

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
  }

  struct Post {
    uint id;
    string content;
    uint tipAmount;
    address payable author;
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
    address payable author
  );

  event PostCreated(
    uint id,
    string content,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  event PostTipped(
    uint id,
    string content,
    uint tipAmount,
    address payable author
  );  

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
    images[imageCount] = Image(imageCount,_imgHash,_description, 0, msg.sender);

    //Triger the event
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);

  }

  function createPost(string memory _content) public {

    // Require valid content
    require(bytes(_content).length > 0);
    
    // Increment the post count
    postCount ++;
    // Create the post
    posts[postCount] = Post(postCount, _content, 0, msg.sender);

    // Trigger event
    emit PostCreated(postCount, _content, 0, msg.sender);
  }

  function createUser(string memory username, string memory email, string memory password_enc, string memory about) public {
    // No need to check validity of arguments as they already have been checked on the frontend.

    userCount++;
    users[msg.sender] = User(username, email, password_enc, about, msg.sender);
    usernames[username] = true;

    emit UserCreated(username, email, password_enc, about, msg.sender);
  }

  function getUser(address id) public returns(address) {
    
    return users[id].user;
  }

  function getUsername(string memory uname) public returns(bool) {
    return usernames[uname];
  }

  function getCreds(address id) public returns(string memory username, string memory password) {
    return (users[id].username, users[id].password);
  }

  function updateAbout(string memory about) public {
    User storage user = users[msg.sender]; 
    user.about = about;
  }

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
    emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
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

    emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
  }

  
}