App = window.App || {};
var LoginErr, createUserError, recoverEmailError, passwordUpdateError;


/*==========  SIGNUP  ==========*/


App.signupRules = {
	rules: {
		usernameSignup: {
			required: true,
			alphanumeric: true,
			minlength: 6
		},
		email: {
			required: true,
			email: true
		},
		passwordSignup: {
			required: true
		},
		password_againSignup: {
			required: true,
			equalTo: "#passwordSignup",
			minlength: 6,
			maxlength: 50
		},
		firstName: {
			required: true,
			minlength: 3,
			maxlength: 50
		},
		lastName: {
			required: true,
			minlength: 3,
			maxlength: 50
		},
		creditCardNumber: {
			required: true,
			minlength: 10,
			maxlength: 30
		},
		zipCode: {
			required: true,
			minlength: 3,
			maxlength: 20
		},		
	}
};


App.signupMessages = {
	messages: {
		usernameSignup: {
			required: "<strong>Note!</strong> required *",
			alphanumeric: "Must be alphanumerical",
			minlength: "must be at least 2 chars"
		},
		email: {
			required: "We need your email adress to contact you",
			email: "Your email must be in the format of name@domain.com"
		},
		password_againSignup: {
			required: "Retype your password",
			equalTo: "The passwords have to match",
			minlength: "At least 3 chars!",
			maxlength: "No longer then 12 chars!"
		},
		firstName: {
			required: "What is your first name?",
			minlength: "At least 3 chars!",
			maxlength: "no longer then 50 chars!"
		},
		lastName: {
			required: "What is your last name?",
			minlength: "At least 3 chars!",
			maxlength: "no longer then 50 chars!"
		},
		creditCardNumber: {
			required: "Please enter a valid credit card number",
		},
		zipCode: {
			required: "Please enter your billing zip code",
		},			
	}
};

App.billUser = function () {
	var email = $("#email").val().toLowerCase();	
	var firstName = $("#firstName").val();	
	var lastName = $("#lastName").val();	
	var planId = $("#plan").val();	
	var ccnum = $("#creditCardNumber").val();	
	var ccmonth = $("#ccMonth").val();	
	var ccyear = $("#ccYear").val();	
	var zip = $("#zipCode").val();	

    Meteor.call('createCustomerFromCard', firstName+" "+lastName, email, ccnum, ccmonth, ccyear, cczip, planId, function() {});


	return 1;
};

App.createUserAccount = function () {	
	// get the values form the input elements 
	var username = $("#email").val().toLowerCase();
	var email = $("#email").val().toLowerCase();	
	var password = $("#passwordSignup").val();
	var firstName = $("#firstName").val();	
	var lastName = $("#lastName").val();	
	var planId = $("#plan").val();	

	createUserError = App.billUser();

	Accounts.createUser({
		username: username, 
		password: password, 
		email: email, 
		profile: {
			firstName: firstName, 
			lastName: lastName,
			plan: planId
		}
	}, function(error) {
		if (error) {
			//$("#signupForm div .alert").remove();
			$("#createUser").button('reset');
			if (createUserError >= 1) {
				$("#main div.alert:first").fadeOut(100).fadeIn(100);
			} else {
				$("form#signupForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
				createUserError = 1;
			}
		} else {
			if (!planId) {
				planId = 0;
			}
			var plan = Plans.find({id: parseInt(planId)}).fetch();
			var port = Math.floor(Math.random()*60000 + 1024);
			var password = Meteor.uuid().replace(/-/g, '');
		    Meteor.call('provision', parseInt(planId), port, plan[0].dbs, plan[0].mb, plan[0].conn, password, function() {});
			Instances.insert({plan: planId, port: port, password: password, owner: Meteor.user()._id});
			//this.userId

			Meteor.Router.to("/users/"+Meteor.user()._id+"");
		}
	});
	
};

App.signupForm = "#signupForm";

App.messagePlacement = {
	onkeyup: false,
	debug: false,
	errorElement: "div",
	success: function(label) {
		label.html("<strong>Ok!</strong>");
		label.parent("div.alert").removeClass("alert-info alert-error").addClass("alert-success").addClass("hide");
	},
	errorPlacement: function(error, element) {
		if (element.parent().children("div.alert").length < 1) {
			var help_block = element.parent().children("div.help-block");
			if(help_block.length < 1) {
				element.parent().append("<div class='alert alert-error hide'></div>");
			} else {
				help_block.removeClass("help-block muted").removeClass("hide").addClass("alert alert-error");
			}
			element.next("div.alert").html(error);
		} else {
			element.next("div.alert").html(error);
		}
	},
	highlight: function(element, errorClass, validClass) {
		$(element).next("div.alert").removeClass("alert-info alert-success").addClass("alert-error").removeClass("hide");
	},
	unhighlight: function(element, errorClass, validClass) {
		$(element).next("div.alert").removeClass("alert-error alert-info").addClass("alert-success");
	}
};

App.signupHandleSubmit = {
	submitHandler: function () {
		$("#createUser").button('loading');
		App.createUserAccount();
		return false;
	}
};



/*==========  LOGIN  ==========*/

App.login = function () {
	var username = $("#usernameLogin").val();
	var password = $("#passwordLogin").val();
	Meteor.loginWithPassword(username, password, function (error){
		if (error) {

			if (LoginErr >= 1) {
				$("#main div.alert").fadeOut(100).fadeIn(100);
				LoginErr = LoginErr + 1;
			} else {
				$("form#loginForm").before("<div class='alert alert-error'>Incorrect username and password combination!</div>");
				LoginErr = 1;
			}


			$("#login").button('reset');
		} else {
			Meteor.Router.to("/");
		}
	});
}



App.loginRules = {
	rules: {
		usernameLogin: {
			required: true,
			alphanumeric: true,
			minlength: 2
		},
		passwordLogin: {
			required: true,
			minlength: 2
		}
	}
};





App.loginMessages = {
	messages: {
		usernameLogin: {
			required: "<strong>required</strong>",
			alphanumeric: "Please use only digits and letters!",
			minlength: "Must be at least 6 characters long"
		}, 
		passwordLogin: {
			required: "<strong>required</strong>",
			minlength: "Must be at least 6 characters long"
		}
	}
};


App.loginForm = "#loginForm"



App.loginHandleSubmit = {
	submitHandler: function () {
		$("#login").button('loading');
		$("#loginForm div .alert").remove();
		App.login();
		return false;
	}
};




/*==========  EDIT PROFILE  ==========*/

App.editUserAccount = function () {
	console.log("2INIT create user account ");
	
	// get the values form the input elements 
	var firstName = $("#firstName").val();	
	var lastName = $("#lastName").val();	
	var bio = $("#bio").val();	

	Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.firstName": firstName, "profile.lastName": lastName, "profile.bio": bio}});
	$("#editProfileForm div.alert").remove();
	$("#saveEdit").button('reset');
	
	Meteor.Router.to("/users/" + Meteor.userId());
	
};


App.editProfileRules = {
	rules: {
		firstName: {
			required: true,
			minlength: 3,
			maxlength: 50
		},
		lastName: {
			required: true,
			minlength: 3,
			maxlength: 50
		},
	}
};


App.editProfileMessages = {
	messages: {
		firstName: {
			required: "What is your first name?",
			minlength: "Your name must be least 3 characters long!",
			maxlength: "Your name can be no longer than 50 chars!"
		},
		lastName: {
			required: "What is your last name?",
			minlength: "Your name must be least 3 characters long!",
			maxlength: "Your name can be no longer than 50 chars!"
		}
	}
};

App.editProfileForm = "#editProfileForm";


App.editProfileHandleSubmit = {
	submitHandler: function () {
		$("#saveEdit").button('loading');
		App.editUserAccount();
		return false;
	}
};




/*==========  RECOVERY EMAIL  ==========*/

App.recoverEmailSubmit = function () {
	
	// get the values form the input elements 
	var email = $("#email").val();	
	Accounts.forgotPassword({email: email}, function(error){
		if (error) {
			console.log(error);
			$("#recoverEmail").button('reset');
			if (recoverEmailError >= 1) {
				$("#main div.alert:first").fadeOut(100).fadeIn(100);
			} else {
				$("form#recoverEmailForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
				recoverEmailError = 1;
			}
		} else {
			Meteor.Router.to("/login");
		}
	});
	
};


App.recoverEmailRules = {
	rules: {
		email: {
			required: true,
			email: true
		}
	}
};


App.recoverEmailMessages = {
	messages: {
		email: {
			required: "We need your email adress",
			email: "Your email must be of the format name@domain.com"
		}
	}
};

App.recoverEmailForm = "#recoverEmailForm";


App.recoverEmailHandleSubmit = {
	submitHandler: function () {
		$("#recoverEmail").button('loading');
		App.recoverEmailSubmit();
		return false;
	}
};




/*==========  PASSWORD UPDATE  ==========*/

App.passwordUpdateSubmit = function () {
	var password = $("#passwordUpdate").val();	
	Accounts.resetPassword(Session.get('resetPassword'), password, function(error){
		if (error) {
			$("#passwordUpdateBtn").button('reset');
			if (passwordUpdateError >= 1) {
				$("#main div.alert:first").fadeOut(100).fadeIn(100);
			} else {
				$("form#passwordUpdateForm").before("<div class='alert alert-error'>" + error.reason + "</div>");
				passwordUpdateError = 1;
			}
		} else {
			Meteor.Router.to("/login");
		}
	});
	
};


App.passwordUpdateRules = {
	rules: {
		passwordUpdate: {
			required: true,
			minlength: 3,
			maxlength: 50
		},
		password_againUpdate: {
			required: true,
			equalTo: "#passwordUpdate",
			minlength: 3,
			maxlength: 50
		},
	}
};


App.passwordUpdateMessages = {
	messages: {
		passwordUpdate: {
			required: "Please enter a valid password",
			minlength: "Your password must be least 3 characters long!",
			maxlength: "Your password can be no longer than 50 chars!"
		},
		password_againUpdate: {
			required: "Please confirm your password",
			equalTo: "Your passwords do not match! Please try again",
			minlength: "Your password must be least 3 characters long!",
			maxlength: "Your password can be no longer than 50 chars!"
		}
	}
};

App.passwordUpdateForm = "#passwordUpdateForm";


App.passwordUpdateHandleSubmit = {
	submitHandler: function () {
		$("#passwordUpdateBtn").button('loading');
		App.passwordUpdateSubmit();
		return false;
	}
};

