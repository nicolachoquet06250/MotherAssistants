// function installApp() {
// 	// Show the prompt
// 	deferredPrompt.prompt();
// 	setupButton.disabled = true;
// 	// Wait for the user to respond to the prompt
// 	deferredPrompt.userChoice
// 		.then((choiceResult) => {
// 			if (choiceResult.outcome === 'accepted') {
// 				console.log('PWA setup accepted');
// 				// hide our user interface that shows our A2HS button
// 				setupButton.style.display = 'none';
// 			} else {
// 				console.log('PWA setup rejected');
// 			}
// 			deferredPrompt = null;
// 		});
// }
//
// window.onload = () => {
// 	let deferredPrompt; // Allows to show the install prompt
// 	let setupButton;
//
// 	window.addEventListener('beforeinstallprompt', e => {
// 		// Prevent Chrome 67 and earlier from automatically showing the prompt
// 		e.preventDefault();
// 		// Stash the event so it can be triggered later.
// 		deferredPrompt = e;
// 		console.log("beforeinstallprompt fired");
// 		if (setupButton === undefined) {
// 			setupButton = document.getElementById("setup_button");
// 		}
// 		// Show the setup button
// 		setupButton.style.display = "inline";
// 		setupButton.disabled = false;
// 	});
//
// 	window.addEventListener('appinstalled', e => {
// 		console.log("appinstalled fired", e);
// 	});
// };

if ('serviceWorker' in navigator) {
	navigator.serviceWorker
		.register('/sw.js')
		.then(serviceWorker => console.log('Service Worker registered: ' + serviceWorker))
		.catch(error => console.log('Error registering the Service Worker: ' + error));
}

let pages = [
	'home',
	'sign_in',
	'sign_on',
	'account',
	'children',
	'contacts'
];

let setup_default = (after_init = null) =>
	$(document).ready(() => {
		$('.parallax').parallax();
		$('.sidenav').sidenav();
		$('.dropdown-trigger').dropdown();
		if (after_init !== null) {
			after_init();
		}
		$('.loader:first').fadeOut(1000, () =>  $('html').css('overflow-y', 'auto'));
		fetch('/connected', {
			method: 'post'
		}).then(r => r.json())
			.then(json => {
				if(json.connected) {
					let socket = io.connect(`http://${main_domain()}:3001`);
					socket.on('connect', function(data) {
						socket.emit('join', {_id: json._id, message: 'Hello World from client'});
					});
				}
			});
	});
let setup_home = () => setup_default();
let setup_sign_in = () => setup_default(() => {
	$('.datepicker').datepicker({
		format: 'dd/mm/yyyy'
	});
});
let setup_sign_on = () => setup_default(() => {
	change_label_approvals(document.querySelector('#nb_approvals').value);
	$('.datepicker').datepicker({
		format: 'dd/mm/yyyy'
	});
});
let setup_account = () => setup_default(() => {
	let profile_pic_resize = () => document.querySelector('.profile-pic').style.height = document.querySelector('.profile-pic').offsetWidth + 'px';
	profile_pic_resize();
	change_label_approvals(document.querySelector('#nb_approvals').value);
	$('.datepicker').datepicker({
		format: 'dd/mm/yyyy'
	});
	window.onresize = () => {
		profile_pic_resize();
	};

	document.querySelectorAll('.profile-pic, .profile-pic-toolbar').forEach(elem => {
		let old_class = null;
		elem.addEventListener('mouseover', () => {
			if(elem.classList.contains('profile-pic') && old_class === null) {
				elem.querySelector('.profile-pic-toolbar').classList.add('animation-top');
				elem.querySelector('.profile-pic-toolbar').classList.remove('animation-bottom');
				old_class = 'profile-pic';
			}
			else if (elem.classList.contains('profile-pic-toolbar') && old_class === 'profile-pic') old_class = 'profile-pic-toolbar';
		});
		elem.addEventListener('mouseout', () => {
			if(elem.classList.contains('profile-pic') && old_class === 'profile-pic-toolbar') old_class = 'profile-pic';
			else {
				elem.querySelector('.profile-pic-toolbar').classList.remove('animation-top');
				elem.querySelector('.profile-pic-toolbar').classList.add('animation-bottom');
				old_class = null;
			}
		});
	});
	$('.modal').modal();

	$('#profile_pic_to_update').on('change', e => {
		fetch(`/account/pre_update/profile_pic`, {
			method: 'post',
			body: new FormData(document.querySelector('#form_update_profile_pic'))
		}).then(response => response.json())
			.then(json => {
				if(json.success) {
					document.querySelector('#profile_pic_into_to_change').style.backgroundImage = `url("${json.url}")`;
				}
			})
			.catch(console.error);
	});

	$('#cancel_update_profile_pic').on('click', e => fetch(`/account/pre_update/profile_pic`, { method: 'post' }).then(() => {}));
});
let setup_children = () => setup_default(() => {
	$('.modal').modal();

	let generate_password = (nb_chars_in_password) => {
		let chars = 'abcdefghijklmnopqrstuvwxyz0123456789.!?$*&~#|';

		let password = '';
		for (let i = 0; i < nb_chars_in_password; i++) {
			password += chars.substr((Math.floor(Math.random() * chars.length - 1)), 1);
		}

		return password;
	};

	let init_generate_password_buttons = () => {
		$('.modal .generate-password').each((key, btn) => {
			$(btn).on('click', () => {
				let btn_container = $(btn).parent();
				let For = $(btn).attr('id').split('_')[2];
				$(btn).remove();
				btn_container.append(
					'<input type="text" value="' + generate_password(10) + '" name="generated_password_for_' + For + '" class="validate valid" id="generated_password_for_' + For + '" readonly>' +
					'<label for="generated_password_for_' + For + '" class="active">Mot de passe généré</label>'
				);
			});
		});
	};
	init_generate_password_buttons();


	window.delete_child = () => {
		document.querySelector('#form_delete_child').submit();
		console.log(document.querySelector('#are_you_sure').getAttribute('data-id'));
	};
	window.add_id_to_modal = id => {
		document.querySelector('#are_you_sure').setAttribute('data-id', id);
		document.querySelector('#hidden_child_id').value = id;
	};
	window.open_child_modal = id => {
		fetch(`/children/get?id=${id}`)
			.then(response => response.json())
			.then(json => {
				let reset_elem = elem => elem.innerHTML = '';
				let calculate_age = birth_day => {
					function ecart_mois(date_max, date_min) {
						let explode_date_min;
						let explode_date_max;
						let mois_min;
						let annee_min;
						let mois_max;
						let annee_max;
						let ecart;
						explode_date_min = date_min.split('/');
						explode_date_max = date_max.split('/');
						mois_min = parseInt(explode_date_min[0]);
						annee_min = parseInt(explode_date_min[1]);
						mois_max = parseInt(explode_date_max[0]);
						annee_max = parseInt(explode_date_max[1]);
						ecart = ((annee_max - annee_min) * 12) - (mois_min) + (mois_max);
						return ecart;
					}

					let _birth_day = birth_day.split('-');
					let year = parseInt(_birth_day[0]);
					let current_year = new Date().getFullYear();
					let age = current_year - year;
					if (parseInt(_birth_day[1]) > new Date().getMonth()) age--;
					return age > 0 ?
						{
							age: age,
							type: 'y'
						} :
						{
							age: ecart_mois(new Date().getMonth() + '/' + new Date().getFullYear(), new Date(birth_day).getMonth() + '/' + new Date(birth_day).getFullYear()),
							type: 'm'
						};
				};
				let space_tpl = (elem, height) => {
					elem.innerHTML += `<div class="row" style="width: ${height}px;"></div>`;
				};
				let tpl_btn = (elem, href, icon, style, _class = '') => elem.innerHTML += `<a href="${href}" class="btn-floating btn-large waves-effect waves-light red ${_class}" 
style="${style}">
	<i class="material-icons">${icon}</i>
</a>`;
				let tpl_btn_parent = (href, icon, text, style = '', _class = '') => `<a href="${href}" class="waves-effect waves-light btn ${_class}" style="${style}">
	<i class="material-icons left">${icon}</i> ${text}
</a>`;
				let tpl_first_and_last_name = (elem, first_name, last_name) => {
					elem.innerHTML += `<div class="row">
	<div class="col s12">
		<h4>${last_name.toUpperCase()} ${first_name}</h4>
	</div>
</div>`;
				};
				let tpl_birthday = (elem, birth_day) => {
					let age_calculated = calculate_age(birth_day);
					let type_age = age_calculated.type;
					let age = age_calculated.age;
					elem.innerHTML += `<div class="row">
	<div class="input-field col s12">
		<input id="birth_day" name="birth_day" type="date" class="validate" value="${birth_day}">
		<label for="birth_day" class="active">Date de naissance ( ${age} ${type_age === 'y' ? (age < 1 ? 'an' : 'ans') : 'mois'} )</label>
	</div>
</div>`;
				};
				let tabs_tpl = (elem, family) => {
					let tab_tpl = (title, anchor, active = false) => `<li class="tab col s3"><a href="#${anchor}" class="${active ? 'active' : ''}">${title}</a></li>`;
					let tab_tpl_list = (...tabs) => {
						if (tabs.length === 1 && tabs[0] instanceof Array) tabs = tabs[0];
						let tpl = `<ul class="tabs">`;
						tabs.forEach(tab => tpl += tab);
						tpl += `</ul>`;
						return tpl;
					};
					let tab_page = (id, content) => `<div id="${id}" class="col s12">${content}</div>`;
					let tab_page_list = (...tab_pages) => {
						if (tab_pages.length === 1 && tab_pages[0] instanceof Array) tab_pages = tab_pages[0];
						let tpl = '';
						tab_pages.forEach(tab_page => tpl += tab_page);
						return tpl;
					};
					let tpl_parent_tab = (id, parent) => {
						let parent_exists = true;
						if(parent === null) {
							parent = {
								first_name: '',
								last_name: '',
								phone: '',
								password: '',
								messages: []
							};
							parent_exists = false;
						}
						return `<div class="row">
	<div class="input-field col s12 m6">
		<input id="${id}_last_name" name="${id}_last_name" value="${parent.last_name}" type="text" class="validate">
		<label for="${id}_last_name" class="${parent.last_name !== '' ? 'active' : ''}">Nom</label>
	</div>
	<div class="input-field col s12 m6">
		<input id="${id}_first_name" name="${id}_first_name" value="${parent.first_name}" type="text" class="validate">
		<label for="${id}_first_name" class="${parent.first_name !== '' ? 'active' : ''}">Prénom</label>
	</div>
	<div class="input-field col s12 m6">
		<input id="${id}_phone" name="${id}_phone" value="${parent.phone}" type="tel" class="validate">
		<label for="${id}_phone" class="${parent.phone !== '' ? 'active' : ''}">Téléphone</label>
	</div>
	<div class="input-field col s12 m6">
		<button id="pw_for_mother" class="generate-password btn btn-flat">Générer un mot de passe</button>
	</div>
</div>
<div class="row">
	<div class="col s12 m4 center-align" style="margin-top: 5px;">
		${tpl_btn_parent('#!', 'send', (parent_exists ? 'Modifier' : 'Créer'), '', 'red modal-trigger')}
	</div>
	<div class="col s12 m4 center-align message-modal-button-container" parent-role="${id}" style="margin-top: 5px;">
		${tpl_btn_parent('#messages', 'messages', 'Messages', '', 'red modal-trigger')}
	</div>
	<div class="col s12 m4 center-align message-modal-button-container" parent-role="${id}" style="margin-top: 5px;">
		${tpl_btn_parent('#photos_in_messages', 'mms', 'Médias', '', 'red modal-trigger')}
	</div>
</div>`;
					};
					elem.innerHTML += tab_tpl_list(
						tab_tpl('Mère', 'mother'),
						tab_tpl('Père', 'father'),
						tab_tpl('Grand Mère', 'grand_mother'),
						tab_tpl('Grand Père', 'grand_father'),
						tab_tpl('Belle Mère', 'step_mother'),
						tab_tpl('Beau Père', 'step_father'),
						tab_tpl('Tente', 'tent'),
						tab_tpl('Oncle', 'uncle')
					) + tab_page_list(
						tab_page('mother', tpl_parent_tab('mother', family.mother)),
						tab_page('father', tpl_parent_tab('father', family.father)),
						tab_page('grand_mother', tpl_parent_tab('grand_mother', family.grand_mother)),
						tab_page('grand_father', tpl_parent_tab('grand_father', family.grand_father)),
						tab_page('step_mother', tpl_parent_tab('step_mother', family.step_mother)),
						tab_page('step_father', tpl_parent_tab('step_father', family.step_father)),
						tab_page('tent', tpl_parent_tab('tent', family.tent)),
						tab_page('uncle', tpl_parent_tab('uncle', family.uncle))
					);
					$('.tabs').tabs();
					init_generate_password_buttons();
					document.querySelectorAll('.message-modal-button-container').forEach(container => {
						let role = container.getAttribute('parent-role');
						container = container.querySelector('a');
						container.addEventListener('click', () => {
							if(container.getAttribute('href') === '#messages') {
								open_specific_parent_messages(role);
							}
							else if (container.getAttribute('href') === '#photos_in_messages') {
								open_specific_parent_medias(role);
							}
						});
					})
				};

				let elem = document.querySelector('#more_about_child .container');
				reset_elem(elem);
				space_tpl(elem, 20);
				tpl_first_and_last_name(elem, json.first_name, json.last_name);
				tpl_birthday(elem, json.birth_day);
				tpl_btn(elem, '#messages', 'messages', 'margin-right: 15px; padding-left: 10px; margin-bottom: 20px;', 'modal-trigger message-modal-button');
				tpl_btn(elem, '#photos_in_messages', 'mms', 'margin-right: 15px; padding-left: 0; margin-bottom: 20px;', 'modal-trigger message-modal-button');
				tpl_btn(elem, '#life_diary', 'event_note', 'margin-right: 15px; padding-left: 0; margin-bottom: 20px;', 'modal-trigger');
				tabs_tpl(elem, json.family);

				document.querySelectorAll('.message-modal-button').forEach(button => {
					button.addEventListener('click', () => {
						if(button.getAttribute('href') === '#messages') {
							open_global_child_messages();
						}
						else if (button.getAttribute('href') === '#photos_in_messages') {
							open_global_child_medias();
						}
					})
				})
			}).catch(err => M.toast({html: `I am a toast! ${err}`}))
	};
	window.open_life_diary = id => {};
	window.open_specific_parent_messages = role => {
		let container = document.querySelector('#messages');
		container.setAttribute('parent-role', role);
	};
	window.open_specific_parent_medias = role => {
		let container = document.querySelector('#photos_in_messages');
		container.setAttribute('parent-role', role);
	};
	window.open_global_child_medias = () => {
		let container = document.querySelector('#photos_in_messages');
		container.setAttribute('parent-role', 'family');
	};
	window.open_global_child_messages = () => {
		let container = document.querySelector('#messages');
		container.setAttribute('parent-role', 'family');
	};
});
let setup_contacts = () => setup_default(() => {
	document.querySelector('#contact_form').addEventListener('submit', e => {
		e.preventDefault();
		let options = {
			first_name: document.querySelector('#first_name').value,
			last_name: document.querySelector('#last_name').value,
			email: document.querySelector('#email').value,
			message: document.querySelector('#message').value
		};

		fetch('/contacts', {
			method: 'post',
			body: options
		}).then(r => r.json())
			.then(json => {
				console.log(json);
				let elem = document.querySelector('#return_message');
				json.success ? (() => {
					elem.classList.remove('red-text');
					elem.classList.add('green-text');
				})() : (() => {
					elem.classList.remove('green-text');
					elem.classList.add('red-text');
				})();
				elem.innerHTML = json.message;
			});
	});
});
let setup = page_name => pages.includes(page_name) ? eval(`setup_${page_name}()`) : setup_default();
let change_label_approvals = new_value => document.querySelector('label[for=nb_approvals]').innerHTML = new_value;