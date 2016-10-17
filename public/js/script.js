initSearch(); //Fetch all users and add to search results

$("#form-signup").submit(function(e) {
  e.preventDefault();
  var formValues = $(this).serializeArray();

  var isFilled = true;

  for (var i = 0; i < formValues.length; i++) {
    if (formValues[i].value.trim() == "") {
      isFilled = false;
      break;
    } else {
      isFilled = true;
    }
  }

  if (isFilled) {

    var userInfo = {
      "first_name": formValues[0].value.trim(),
      "last_name": formValues[1].value.trim(),
      "email": formValues[2].value.trim(),
      "username": formValues[3].value.trim(),
      "password": formValues[4].value.trim()
    }

    $.ajax({
      type: "POST",
      url: "/users/signup",
      data: JSON.stringify(userInfo),
      success: function(msg) {
        console.log(msg);
        if (msg == "User has been successfully created!") {
          $("#form-signup").trigger("reset");
          swal("Thanks for Signing Up!", "Welcome to Sai Social Media!", "success");
        } else {
          swal("User already exists", msg);
        }
      },
      error: function(err) {
        console.log("Server not responding. Please try again later.");
        console.log(err);
      },
      dataType: "text",
      contentType: "application/json"
    });

    initSearch(); //Re-fetch all new users and add to search results

  } else {
    swal("Please fill out all fields!", "Cannot signup without all fields being entered.");
  }
});
