// --------------------------------------------------
// Used in generic autocompletes and designed to be
// extended by other views that need extended feature
// --------------------------------------------------
define(function (require) {
	
	// Dependencies
	var $ = require('jquery'),
		_ = require('underscore'),
		Backbone = require('backbone'),
		Autocomplete = require('decoy/views/autocomplete'),
		storage = require('decoy/plugins/kizzy')('decoy.belongs-to');
			
	// Public view module
	var BelongsTo = Autocomplete.extend({
		
		// Init
		initialize: function () {
			Autocomplete.prototype.initialize.call(this);
			
			// Cache selectors
			this.$status = this.$('button');
			this.$icon = this.$status.find('i');
			this.$hidden = this.$('input[type="hidden"]');
			this.edit_route = null; // Allows the edit_route to be updated externally
			
			// Add extra events
			this.events = _.clone(this.events);
			this.events['click button'] = 'edit';
			this.events['blur input[type="text"]'] = 'blur';
			
			// If there is already a value, count that as a match
			if (this.$hidden.val()) this.found = true;
			
			// If the input and hidden have the same value, then we can
			// conclude that the page has been populated with POST values
			// by Former because there was a validation error.  Swap out
			// the value of the input with the one that we cached during
			// the edit
			if (this.$hidden.val() && this.$hidden.val() == this.$input.val()) {
				this.$input.val(storage.get(this.$input.attr('name')));
				this.id = this.$hidden.val();
				this.found = true;
				this.renderMatch();
			}
		},
		
		// Overide the match function to toggle the state of the match
		// icons and to set the hidden input field
		match: function() {
			Autocomplete.prototype.match.call(this);
			if (this.found) this.renderMatch();
			else this.renderMiss();
			
			// Store the current title value so it could be used to repopulate the field if the form
			// does not validate and Former sets the input to the id of the selection.
			storage.set(this.$input.attr('name'), this.$input.val());
		},
		
		// Make the UI indicate a match
		renderMatch: function() {
			this.$status.addClass('btn-info').prop('disabled', false).attr('href', this.route+'/'+this.id);
			this.$icon.removeClass().addClass('icon-pencil icon-white');
			this.$hidden.val(this.id);
		},
		
		// Make the UI indicate a miss
		renderMiss: function() {
			this.$status.removeClass('btn-info').prop('disabled', true).removeAttr('href');
			this.$icon.removeClass().addClass('icon-ban-circle');
			this.$hidden.val('');
		},
		
		// Clear the field if there is no match on blur
		blur: function(e) {
			if (!this.found) this.$input.val('');
		},
		
		// Visit the edit page
		edit: function(e) {
			e.preventDefault();
			location.href = (this.edit_route || this.route)+'/'+this.$hidden.val();
		}
				
	});
	
	return BelongsTo;
});