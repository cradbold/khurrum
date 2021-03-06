module.exports = function(gc) {

	var api = "/api";
	var version = '/v0.1';
	var prefix = api + version;

	var db = require(__dirname + '/../db/database');

	gc.get(api, function(req, res) {
		res.send('GC API is up and running -- append a version...\n');
	});

	gc.get(prefix, function(req, res) {
		res.send('GC ' + version + ' API is up and running...\n');
	});

	gc.get(prefix, function(req, res) {
		res.send('GC ' + version + ' API is up and running...\n');
	});

	gc.get(prefix + '/meeting', function(req, res) {

		if (!req.user || req.user.userType != 'teacher') {
			res.send([]);
			return;
		}

		// --

		db.meeting.find({}).sort({
			_id: 1
		}).exec(function(err, data) {

			if (err) {
				console.log(err);
			}

			var convertedD = [];
			var userId = req.user['_id'];

			if (data.length !== undefined) {

				for (var row in data) {

					var isAvai = false;
					var avaiTeach = data[row].teachers;

					if (avaiTeach) {

						for (var index in avaiTeach) {
							if (avaiTeach[index] && (avaiTeach[index]).toString() == userId.toString()) {
								isAvai = true;
							}
						}
					}

					// -

					convertedD.push({
						_id: data[row]._id,
						isAvai: isAvai,
						subject: data[row].subject,
						description: data[row].description,
						datetime: data[row].datetime
					});
				}
			}

			// --

			res.json(convertedD);
		});
	});

	// --

	gc.get(prefix + '/student-meeting', function(req, res) {

		if (!req.user || req.user.userType != 'student') {
			res.send([]);
			return;
		}

		// -		

		var getTeachers = function(cb) {

			db.UserModel.find({
				userType: 'teacher'
			}, {
				_id: true,
				username: true
			}).exec(function(err, data) {

				var convertedD = [];

				if (data) {
					for (var row in data) {
						convertedD[data[row]._id] = data[row].username;
					}
				}

				cb(err, convertedD);
			});
		}

		// -

		var getMeeting = function(teachersD, cb) {

			db.meeting.find({}).sort({
				_id: 1
			}).exec(function(err, data) {

				if (err) {
					console.log(err);
				}

				var convertedD = [];
				var userId = req.user['_id'];

				if (data.length !== undefined) {

					for (var row in data) {

						var teacherGuy = data[row].teachers;
						var teacherNm = [];

						if (teacherGuy) {
							for (var i in teacherGuy) {
								if (teachersD[teacherGuy[i]]) {
									teacherNm.push(teachersD[teacherGuy[i]]);
								}
							}
						}

						// -

						convertedD.push({
							subject: data[row].subject,
							_id: data[row]._id,
							teachers: teacherNm,
							description: data[row].description,
							datetime: data[row].datetime
						});
					}
				}

				res.json(convertedD);
			});
		}

		// -

		getTeachers(function(err, data) {
			getMeeting(data, function(err, data) {
				res.json(data);
			});
		});

	});

	gc.get(prefix + '/live-teachers', function(req, res) {
		res.json(require(__dirname + '/site').getLiveTeachers() || []);
	});
};