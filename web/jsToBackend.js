// This is the javascript file I added for the connection to the backend

//get the hosting url.
var base_url = location.protocol + '//' + location.host;
var uid;
var session_key;

function loginToBackend()
{
    // converts the username into json
    var username = userTextBox.text;
    var password = loginPassword;
    var convertToJSON = {"username": username, "password": password};

    $.ajax({
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(convertToJSON),
        url: 'http://' + base_url + '/login', // change to 8080 if this doesnt work
        dataType: 'json',
        crossDomain: 'true',
        xhrFields: {
            withCredentials: true
        },
        success: function(callback) {
            if(callback.errorCode != 0)
            {
                alert("Incorrect Username or Password");
                return;
            }
            uid = callback.data.uid;
            session_key = callback.data.session_key;
            toProjectSelection();
            currentActivity = "AllProjects";
        },
        error: function(xhr, status, error) {
            alert("Internal Server Error: 500");
        }
    });
}

function signUpBackend()
{
    var username = SU_userTextBox.text;
    var email = SU_emailTextBox.text;
    var password = signUpPassword;
    var confirmPassword = signUpRePassword;
    var legalName = legalTextBox.text;
    var institution = institutionTextBox.text;
    var convertToJSON = {"username": username, "password": password, "email": email, "legalname": legalName, "institution": institution};

    if(confirmPassword != password)
    {
        alert("Passwords do not match! Try again!");
        return;
    }

    // Ensures the email must be an edu email address
    if(!email.includes(".edu"))
    {
        alert("Not a valid email address!");
        return;
    }

    $.ajax({
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(convertToJSON),
        url: 'http://' + base_url + '/signup',
        dataType: 'json',
        crossDomain: 'true',
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            userTextBox.text = username;
            toProjectSelection();
            currentActivity = "AllProjects";
        },
        error: function(xhr, status, error) {
            alert("Internal Server Error: 500");
        }
    });
}

function gatherUserSettings()
{
    // This loads the information about the userSettings
    var username = userTextBox.text;
    $.ajax({
        method: 'GET',
        contentType: 'application/json',
        headers: {"uid": uid, "session_key": session_key},
        url: 'http://' + base_url + '/user',
        dataType: 'json',
        crossDomain: 'true',
        xhrFields: {
            withCredentials: true
        },
        success: function(callback) {
            if(callback.errorCode != 0)
            {
                alert("Error loading the user settings!");
            }
            userSettingsResponse = callback.data;
            createUIProjects();
        },
        error: function(xhr, status, error) {
            alert("Internal Server Error: 500");
        }
    });
}

function postNewProject(data)
{
    let newProjectSettings = {newProjectSettings: data};
    $.ajax({
        method: 'POST',
        contentType: 'application/json',
        headers: {"uid": uid, "session_key": session_key},
        data: JSON.stringify(newProjectSettings),
        url: 'http://' + base_url + '/project/create',
        dataType: 'json',
        crossDomain: 'true',
        xhrFields: {
            withCredentials: true
        },
        success: function(callback) {
            if(callback.errorCode != 0)
            {
                alert("Error loading the user settings!");
            }
            userSettingsResponse = callback.data;
            createUIProjects();
        },
        error: function(xhr, status, error) {
            alert("Internal Server Error: 500");
        }
    });
}