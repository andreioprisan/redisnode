Meteor.startup(function () {
	process.env.MAIL_URL = "smtp://postmaster@redisnode.com:402ma3iic7n8@smtp.mailgun.org:465";
});


Accounts.urls.resetPassword = function (token) {
  return Meteor.absoluteUrl('reset-password/' + token);
};

Accounts.urls.verifyEmail = function (token) {
  return Meteor.absoluteUrl('verify-email/' + token);
};

Accounts.urls.enrollAccount = function (token) {
  return Meteor.absoluteUrl('enroll-account/' + token);
};

Accounts.config({sendVerificationEmail: false, forbidClientAccountCreation: false});

Accounts.emailTemplates.siteName = "redisnode";
Accounts.emailTemplates.from = "redisnode <support@redisnode.com>";
Accounts.emailTemplates.enrollAccount.subject = function (user) {
    return "Welcome to redisnode, " + user.profile.name;
};
Accounts.emailTemplates.enrollAccount.text = function (user, url) {
   return " To activate your account, simply click the link below:\n\n"
     + url;
};


Accounts.onCreateUser(function (options, user) {
	user.profile = options.profile;
//	Accounts.sendVerificationEmail(user._id, user.emails[0].address);
	return user;
});
