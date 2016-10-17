var neo4j = require("neo4j-driver").v1;
var username = process.env['NEO4J_USERNAME'];
var password = process.env['NEO4J_PASSWORD'];
var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic(username, password));
var session = driver.session();

var User = function(userInfo) {
  this.userInfo = userInfo;
}

User.createUser = function(userInfo, handler) {
  if (typeof userInfo != 'undefined') {

    //Check for existing user with email
    User.findByEmail(userInfo.email, function(user, msg) {
      if (Object.keys(user).length === 0 && user.constructor === Object) { //If no user exists

        //Check for existing user with username
        User.findByUsername(userInfo.username, function(user, msg) {
          if (Object.keys(user).length === 0 && user.constructor === Object) { //If no user exists

            //Create new user with the specified info
            var statement = "CREATE (n:User {fname:{fname}, lname:{lname}, email:{email}, username:{username}, password:{password}}) RETURN n.fname";
            session.run(statement, userInfo)
              .then(function(result) {
                handler("User has been successfully created!");
                session.close();
              })
              .catch(function(err) {
                handler(err);
              });

          } else {
            handler("User already exists. Please use a different username.");
          }

        });

      } else {
        //User already exists
        handler("User already exists. Please use a different email.");
      }

    });

  } else {
    handler("No user found.");
  }

}

User.getAllUsers = function(handler) {
  var statement = "MATCH (n:User) RETURN n";
  session
    .run(statement)
    .then(function(result) {
      var userArr = [];
      result.records.forEach(function(record) {
        userArr.push({
          "fname": record._fields[0].properties.fname,
          "lname": record._fields[0].properties.lname,
          "email": record._fields[0].properties.email,
          "username": record._fields[0].properties.username
        });
      });
      handler(userArr, "All users have been returned.");
    }).catch(function(err) {
      handler([], err);
    });
}

User.findByEmail = function(email, handler) {
  if (email) {

    var statement = "MATCH (n:User) WHERE n.email='" + email + "' RETURN n";

    session
      .run(statement)
      .then(function(result) {
        var user = {
          "fname": result.records[0]._fields[0].properties.fname,
          "lname": result.records[0]._fields[0].properties.lname,
          "email": result.records[0]._fields[0].properties.email,
          "username": result.records[0]._fields[0].properties.username
        };
        handler(user, "User with email: " + email + " has been found.");

      }).catch(function(err) {
        handler({}, err);
      });
  } else {
    handler({}, "Please pass a valid email.");
  }

}

User.findByUsername = function(username, handler) {
  if (username) {

    var statement = "MATCH (n:User) WHERE n.username='" + username + "' RETURN n";

    session
      .run(statement)
      .then(function(result) {
        var user = {
          "fname": result.records[0]._fields[0].properties.fname,
          "lname": result.records[0]._fields[0].properties.lname,
          "email": result.records[0]._fields[0].properties.email,
          "username": result.records[0]._fields[0].properties.username
        };
        handler(user, "User with username: " + username + " has been found.");

      }).catch(function(err) {
        handler({}, err);
      });
  } else {
    handler({}, "Please pass a valid username");
  }

}

User.removeUser = function(userInfo, handler) {
  if (typeof userInfo != 'undefined') {

    //Check for user
    User.findByEmail(userInfo.email, function(user, msg) {
      if (Object.keys(user).length === 0 && user.constructor === Object) { //If User not found
        handler("The selected user doesn't exist.");
      } else {
        var statement = "MATCH (n:User) WHERE n.email='" + userInfo.email + "' DETACH DELETE n;";
        session.run(statement, userInfo)
          .then(function(result) {
            handler("User has been successfully deleted!");
            session.close();
          })
          .catch(function(err) {
            handler(err);
          });
      }

    });

  } else {
    handler("No user found.");
  }

}

User.updateUser = function(userInfo, handler) {
  if (typeof userInfo != 'undefined') {

    //Check for user
    User.findByEmail(userInfo.email, function(user, msg) {
      if (Object.keys(user).length === 0 && user.constructor === Object) { //If User not found
        handler("The selected user doesn't exist.");
      } else {
        console.log(userInfo);
        var statement = "MATCH (n:User) WHERE n.email='" + userInfo.email + "' SET n.fname='" + userInfo.fname + "', n.lname='" + userInfo.lname + "', n.email='" + userInfo.email + "', n.username='" + userInfo.username + "' RETURN n;";
        session.run(statement, userInfo)
          .then(function(result) {
            handler("User has been successfully updated!");
            session.close();
          })
          .catch(function(err) {
            handler(err);
          });
      }

    });

  } else {
    handler("No user found.");
  }
}

User.addFriend = function(senderInfo, receiverInfo, handler) {
  if (typeof senderInfo != 'undefined' && typeof receiverInfo != 'undefined') {

    //Check for user
    User.findByEmail(receiverInfo.email, function(receiver, msg) {
      if (Object.keys(receiver).length === 0 && receiver.constructor === Object) { //If User not found
        handler("The selected user doesn't exist.");
      } else {
        var statement = "MATCH (sender:User {email:'" + senderInfo.email + "'}), (receiver:User {email:'" + receiver.email + "'}) CREATE (sender)-[:FRIENDED{status:'waiting'}]->(receiver);";
        session.run(statement)
          .then(function(result) {
            handler(receiver.fname + " " + receiver.lname + " has been added as a friend. Awaiting response...");
            session.close();
          })
          .catch(function(err) {
            handler(err);
          });

      }

    });

  } else {
    handler("No user found.");
  }

}



module.exports = User;
