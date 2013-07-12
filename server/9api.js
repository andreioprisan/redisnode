Meteor.Router.add('/api/provision', 'POST', function(id) {
  return [200, 'ok'];
});

Meteor.Router.add('/api/provision', 'GET', function(id) {
  obj = { item1: "item1val", item2: "item2val" };
  return [200, {"Content-Type": "application/json"}, JSON.stringify(obj)];
});
