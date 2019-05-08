// // filters: [{ name: '', match: /./, callback: unsubscriber }, { name: 'Capital', archive: true, match: /To: .*?@inventum.capital/, callback: unsubscriber }],
var supers = {
	unsubscribe: null,
	regex: {
		subscription_giveaways: new RegExp(/unsubscribe|optout|opt\-out|remove/i),
		email_body_hrefs: new RegExp(/<a[^>]*href=["'](https?:\/\/[^"']+)["'][^>]*>(.*?)<\/a>/gi),
		list_unsub_url: new RegExp(/^list\-unsubscribe:(.|\r\n\s)+<(https?:\/\/[^>]+)>/im),
		list_unsub_email: new RegExp(/^list\-unsubscribe:(.|\r\n\s)+<mailto:([^>]+)>/im)
	}
};
var preprocs = {
	unsubscriber: function (thread) {
		var messages = thread.getMessages();
		if (messages == null) return;
		var message = messages[messages.length - 1];
		var spam_detected = procs.unsubscriber(message);
		if (spam_detected) {
			var spam_detected_label = GmailApp.getUserLabelByName("spam_detected");
			thread.addLabel(spam_detected_label);
			thread.moveToArchive();
			var body = 'Unsubscribed from ' + JSON.stringify(supers.unsubscribe, null, '\t');
			GmailApp.sendEmail("pavlovcik@gmail.com", "Unsubscriber", body, {
				// name: "Alexander Pavlovcik",
				replyTo: "Alexander V. Pavlovcik <alexander@pavlovcik.com>",
				from: (function () {
					var aliases = GmailApp.getAliases();
					return aliases[2];
				})()
			});
		}
	}
};
var procs = {
	label: {
		slicer: function (labelPart, i) {
			label.string = label.string + (i === 0 ? '' : '/') + labelPart.trim();
			label.special_object = procs.label.find_or_create(label.string);
		},
		apply: function (name, thread) {
			var label = {
				special_object: void 0,
				string: '',
				cache: {}
			};
			name.split('/').forEach(procs.label.slicer);
			thread.addLabel(label.special_object);
		},
		find_or_create: function (name) {
			if (label.cache[name] === void 0) label.cache[name] = GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name)
			return label.cache[name];
		}
	},
	unsubscriber: function (message) {
		var spam_detected = false,
			raw_email_body = message.getRawContent(),
			unsubscribe = {
				urls: raw_email_body.match(supers.regex.list_unsub_url),
				emails: false
			};
		if (unsubscribe.urls) {
			UrlFetchApp.fetch(unsubscribe.urls[2], { muteHttpExceptions: true });
			spam_detected = true;
		} else {
			unsubscribe.emails = raw_email_body.match(supers.regex.list_unsub_email);
			if (unsubscribe.emails) {
				var no_query_string_in_url = unsubscribe.emails[2].split('?').shift();
				unsubscribe.emails[2] = no_query_string_in_url;
				if (unsubscribe.emails[2] == 'ur@unsubscribe.alerts.google.com') return spam_detected;
				spam_detected = true;
				// var aliases = GmailApp.getAliases();
				// GmailApp.sendEmail(unsubscribe.emails[2], "Unsubscribe", "Unsubscribe", {
				//     from: aliases[aliases.length - 1]
				// });
			} else {
				var email_body_no_spaces = message.getBody().replace(/\s/g, ""),
					email_body_hrefs = supers.regex.email_body_hrefs,
					subscription_giveaways = supers.regex.subscription_giveaways;
				while (unsubscribe.urls = email_body_hrefs.exec(email_body_no_spaces)) {
					var first_match = unsubscribe.urls[1].match(subscription_giveaways);
					if (first_match || unsubscribe.urls[2].match(subscription_giveaways)) {
						UrlFetchApp.fetch(unsubscribe.urls[1], { muteHttpExceptions: true });
						spam_detected = true;
						break;
					}
				}
			}
		}
		// Logger.log('unsubscribe object: ' + JSON.stringify(unsubscribe, null, '\t'));
		if (spam_detected) supers.unsubscribe = unsubscribe;
		return spam_detected;
	},
	thread: function (thread) {
		var messages = thread.getMessages();
		if (messages == null) return;
		var message = messages[messages.length - 1];
		var body = message.getRawContent();
		filters.forEach(procs.filter);
	},
	filter: function (filter) {
		if (filter.subject) filter.match = new RegExp('Subject:.*?' + filter.subject, 'i');
		var matches = filter.match.exec(body);
		if (matches !== null) {
			var label = filter.name || matches[1];
			if (label !== void 0) procs.label.apply(label, thread);
			if (filter.star) message.star();
			if (filter.markRead) message.markRead();
			if (filter.callback) filter.callback(message);
			if (filter.archive) thread.moveToArchive();
		}
	}
};

function main_labeler() {
	var options = {
			inbox: GmailApp.search('in:inbox'),
			today: (function () {
				var d = new Date();
				d.setDate(d.getDate() - 1);
				d = d.toISOString().slice(0, 10); //	yesterday
				var q = 'in:inbox after:' + d;
				return GmailApp.search(q);
			})()
		},
		threads = options.today;
	// var messages = GmailApp.getMessagesForThreads(threads);
	threads.forEach(preprocs.unsubscriber);
	// threads.forEach(procs.thread);
}