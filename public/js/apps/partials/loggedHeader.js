define(function(require) {

	var Backbone = require('Backbone');

	var LoggedHeaderView = Backbone.View.extend({
		tagName: 'div',
		template: require('hbs!./loggedHeaderView'),
		initialize: function() {},
		render: function(data) {
			this.$el.html(this.template());
			return this;
		}
	});
	
	return LoggedHeaderView;
});