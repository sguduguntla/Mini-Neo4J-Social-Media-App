  function initSearch() {
    // Grab the template
    $.get('/searchResults.ejs', function(template) {
      var func = ejs.compile(template);

      getUsers(function(allUsers) {

        $("#searchForm").submit(function(e) {
          e.preventDefault();

          var searchTerm = $("#search").val().trim().toLowerCase();
          var firstname = searchTerm.split(" ")[0];
          var lastname = searchTerm.split(" ")[1];
          var users = [];

          for (var i = 0; i < allUsers.length; i++) {
            if (typeof firstname !== 'undefined' && typeof lastname !== 'undefined' && allUsers[i].fname.toLowerCase().includes(firstname.toLowerCase().trim()) && allUsers[i].lname.toLowerCase().includes(lastname.toLowerCase().trim())) {
              users.push(allUsers[i]);
            } else if (allUsers[i].fname.toLowerCase().includes(searchTerm.toLowerCase()) || allUsers[i].lname.toLowerCase().includes(searchTerm.toLowerCase())) {
              users.push(allUsers[i]);
            }
          }

          if (users.length > 0) {
            var data = {
              "users": users,
            }
            var results = func(data);

            $("#searchResults").html(results);
          } else {
            swal("Sorry!", "No users exist with the name your entered. Please try again.");
          }

          $("#clearResults").click(function(e) {
            e.preventDefault();
            $("#searchResults").html("");
          });

        });
      })

    });

  }

  function getAllNames(allUsers) {

    var allNames = [];
    for (var i = 0; i < allUsers.length; i++) {
      allNames.push(allUsers[i].fname + " " + allUsers[i].lname);
    }
    return allNames;
  }

  function getUsers(callback) {

    // Grab the data
    $.get('/users/get', function(data) {
      // Generate the html from the given data.

      callback(data.users);
    });

  }

  $("#search").autocomplete({
    source: function(request, response) {
      $.get("/users/get", function(data) {
        // assuming data is a JavaScript array such as
        // ["one@abc.de", "onf@abc.de","ong@abc.de"]
        // and not a string
        var allNames = getAllNames(data.users);

        response(allNames);
      });
    }
  });
