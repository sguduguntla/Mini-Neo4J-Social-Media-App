$('.modal-trigger').leanModal();

$(".addFriend").click(function(e) {
  e.preventDefault();

  $(this).addClass("disabled");
  $(this).attr("value", "Added");

  var sender = {
    "fname":"Sriharsha",
    "lname":"Guduguntla",
    "username":"sguduguntla",
    "email":"sreeharsha11@gmail.com"
  }

  var receiver = {
    "fname": $(this).parent().parent().find('td:eq(1)').text().trim().replace(/\s+/g, " ").split(" ")[0],
    "lname": $(this).parent().parent().find('td:eq(1)').text().trim().replace(/\s+/g, " ").split(" ")[1],
    "username": $(this).parent().parent().find('td:eq(2)').text().trim().replace(/\s+/g, "").substring(1),
    "email": $(this).parent().parent().find('td:eq(3)').text().trim().replace(/\s+/g, "")
  }

  var bothUsers = [sender, receiver];

  $.ajax({
    type: "POST",
    url: "/friends/add",
    data: JSON.stringify(bothUsers),
    success: function(msg) {
      console.log(msg);
    },
    error: function(err) {
      console.log("Unable to send friend request!");
      console.log(err);
    },
    dataType: "text",
    contentType: "application/json"
  });

});

$(".deleteUser").click(function(e) {
  e.preventDefault();

  $(this).parent().parent().fadeOut();

  var sender = {
    "fname": $(this).parent().parent().find('td:eq(1)').text().trim().replace(/\s+/g, " ").split(" ")[0],
    "lname": $(this).parent().parent().find('td:eq(1)').text().trim().replace(/\s+/g, " ").split(" ")[1],
    "username": $(this).parent().parent().find('td:eq(2)').text().trim().replace(/\s+/g, "").substring(1),
    "email": $(this).parent().parent().find('td:eq(3)').text().trim().replace(/\s+/g, "")
  }

  $.ajax({
    type: "POST",
    url: "/users/remove",
    data: JSON.stringify(sender),
    success: function(msg) {
      console.log(msg);
    },
    error: function(err) {
      console.log("Unable to remove user!");
      console.log(err);
    },
    dataType: "text",
    contentType: "application/json"
  });

  initSearch(); //Reset Search results

});

$(".updateModalTrigger").click(function(e) {
  var sender = {
    "fname": $(this).parent().parent().find('td:eq(1)').text().trim().replace(/\s+/g, " ").split(" ")[0],
    "lname": $(this).parent().parent().find('td:eq(1)').text().trim().replace(/\s+/g, " ").split(" ")[1],
    "username": $(this).parent().parent().find('td:eq(2)').text().trim().replace(/\s+/g, "").substring(1),
    "email": $(this).parent().parent().find('td:eq(3)').text().trim().replace(/\s+/g, "")
  }

  $("#new_first_name").val(sender.fname);
  $("#new_last_name").val(sender.lname);
  $("#new_username").val(sender.username);
  $("#new_email").val(sender.email);

});

$("#updateUser").click(function(e) {
  e.preventDefault();

  var userInfo = {
    "fname": $("#new_first_name").val().trim(),
    "lname": $("#new_last_name").val().trim(),
    "email": $("#new_email").val().trim(),
    "username": $("#new_username").val().trim()
  }

  $.ajax({
    type: "POST",
    url: "/users/update",
    data: JSON.stringify(userInfo),
    success: function(msg) {
      console.log(msg);
      if (msg == "User has been successfully updated!") {
        swal(msg, "success");
        initSearch(); //Reset Search results
      } else {
        swal(msg, "The user could not be found");
      }
    },
    error: function(err) {
      console.log("Server not responding. Please try again later.");
      console.log(err);
    },
    dataType: "text",
    contentType: "application/json"
  });

});
