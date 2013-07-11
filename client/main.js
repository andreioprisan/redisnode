var App = window.App || {};
Plans = new Meteor.Collection("Plans");
Meteor.subscribe("Plans");
Instances = new Meteor.Collection("Instances");
Meteor.subscribe("Instances");

// Add 'active' class to current page link
Handlebars.registerHelper('TabActive', function (route) {
    return (route == Session.get("current_page")) ? "active" : "";
});




// Login
Template.login.events({
    "keyup #password": function (event) {
        if (event.type == "keyup" && event.which == 13) {
            console.log("keyup identified enter was pressed");
            App.login();
        }
    },

    "click #login": function(event) {
        App.login();
    }
});

Template.login.rendered = function() {
    App.myValidation (App.loginRules, App.loginMessages, App.loginForm, App.messagePlacement, App.loginHandleSubmit);
};




// Signup
Template.signup.rendered = function() {
    App.myValidation (App.signupRules, App.signupMessages, App.signupForm, App.messagePlacement, App.signupHandleSubmit);
};




// Logged in views
Template.editProfile.user = function() {
    return Meteor.user();
};

Template.editProfile.planName = function() {
    return getPlanName(parseInt(Meteor.user().profile.plan));
};

Template.editProfile.rendered = function() {
    App.myValidation (App.editProfileRules, App.editProfileMessages, App.editProfileForm, App.messagePlacement, App.editProfileHandleSubmit);
};

Template.viewProfile.user = function() {
    return Meteor.user();
};

Template.viewProfile.planName = function() {
    return getPlanName(parseInt(Meteor.user().profile.plan));
};

function getPlanName(id) {
    var plan = Plans.find({id: id}).fetch();
    console.log(plan);
    console.log('we got');
    console.log(plan[0]);
    return plan[0].name+" at $"+plan[0].cost+"/month";
}

Template.loggedin_header.helpers({
    fullName: function() {
        var profile = Meteor.user().profile;
        return profile.firstName + ' ' + profile.lastName;
    },

    id: function() {
        return Meteor.user()._id;
    }
});




Template.password_update.rendered = function() {
    if(Session.get("resetPassword")) {
        // update password
        App.myValidation (App.passwordUpdateRules, App.passwordUpdateMessages, App.passwordUpdateForm, App.messagePlacement, App.passwordUpdateHandleSubmit);    
    } 
};

Template.recover_email.rendered = function() {
    
        // password reset email form
        App.myValidation (App.recoverEmailRules, App.recoverEmailMessages, App.recoverEmailForm, App.messagePlacement, App.recoverEmailHandleSubmit);    
    
    
};