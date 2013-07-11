Meteor.startup(function () {
	process.env.MAIL_URL = "smtp://postmaster@redisnode.com:402ma3iic7n8@smtp.mailgun.org:465";

	Plans = new Meteor.Collection("Plans");
	Instances = new Meteor.Collection("Instances");

	Plans.remove({});

	if (Plans.find().count() === 0) {
		Plans.insert({name: "64MB", cost: 0, mb: 64, dbs: 16, conn: 1024, id: 0});
		Plans.insert({name: "512MB", cost: 5, mb: 512, dbs: 999999, conn: 999999, id: 1});
		Plans.insert({name: "1GB", cost: 10, mb: 1024, dbs: 999999, conn: 999999, id: 2});
		Plans.insert({name: "2GB", cost: 20, mb: 2048, dbs: 999999, conn: 999999, id: 3});
		Plans.insert({name: "4GB", cost: 32, mb: 4096, dbs: 999999, conn: 999999, id: 4});
		Plans.insert({name: "8GB", cost: 64, mb: 8192, dbs: 999999, conn: 999999, id: 5});
		Plans.insert({name: "16GB", cost: 128, mb: 16384, dbs: 999999, conn: 999999, id: 6});
		Plans.insert({name: "32GB", cost: 256, mb: 32768, dbs: 999999, conn: 999999, id: 7});
	}

	Meteor.publish("Plans", function () {
	  return Plans.find();
	});

	if (Instances.find().count() === 0) {
		Instances.insert({plan: 4, port: 10001, password: "askjdfkalsjdflkjsa", owner: "e9HRDm6Dg5wnfBM78"});
		Instances.insert({plan: 6, port: 10002, password: "askjdfkalsjdflkjs2", owner: "e9HRDm6Dg5wnfBM79"});
	}

	Meteor.publish("Instances", function () {
	  return Instances.find({owner: this.userId});
	});

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

var sys = Npm.require('sys');
var exec = Npm.require('child_process').exec;

Meteor.methods({
    'provision': function provisionRedisContainer(planid, port, databases, memory, connections, password) {
		var child;

		var provCommand = "/etc/init.d/redis -p "+port+" -d "+databases+" -m "+memory+" -c "+connections+" -x "+password+" -a create && /etc/init.d/redis -p "+port+" -a start";
		child = exec(provCommand, function (error, stdout, stderr) {
		    sys.print('stdout: ' + stdout);
		    sys.print('stderr: ' + stderr);
		    if (error !== null) {
		        console.log('exec error: ' + error);
		    } else {
		    }
		});

		return child;
    }
  });

