module.exports = class Children {

	static get routes() {
		return {
			get: {
				'/': Children.Home,
				'/son': Children.Son,
				'/daughter': Children.Daughter,
				'/diary': Children.Diary
			},
			post: {
				'/son': Children.Son,
				'/daughter': Children.Daughter,
			}
		}
	}

	static get module() {
		return 'children';
	}

	static Home(req, res) {
		res.render('children/index', { title: 'Children Home' });
	}

	static Son(req, res) {
		res.render('children/son', { title: 'Children Son' });
	}

	static Daughter(req, res) {
		res.render('children/daughter', { title: 'Children Daughter' });
	}

	static Diary(req, res) {
		res.render('children/diary', { title: 'Children Diary', current_page: 'diary', logged: false })
	}
};