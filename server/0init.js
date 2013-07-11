Meteor.startup(function () {
	process.env.MAIL_URL = "smtp://postmaster@redisnode.com:402ma3iic7n8@smtp.mailgun.org:465";

	Plans = new Meteor.Collection("Plans");
	Instances = new Meteor.Collection("Instances");
	Customers = new Meteor.Collection("Customers");

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

	Meteor.publish("Instances", function () {
	  return Instances.find({owner: this.userId});
	});

	Meteor.publish("Customers", function () {
	  return Customers.find({owner: this.userId});
	});

	var os = Npm.require("os");
	if (os.hostname() == "master.redisnode.com" ||
		os.hostname() == "slave.redisnode.com") {
		isProd = 1;
	} else {
		isProd = 0;
	}

	if (!isProd) {
		stripe_secret = "sk_test_2cGa3day3OCg1ZVTPFPuRetY";
		stripe_public = "pk_test_ujzLsEV3pNMBj9KIv5qkknUC";		
	} else {
		stripe_secret = "sk_live_UEu9EQkB1BdOUOBrzYcXudBG";
		stripe_public = "pk_live_voZnzGKwR0aIZ3TjXd0vQhof";
	}

	Stripe = StripeAPI(stripe_secret);

});

