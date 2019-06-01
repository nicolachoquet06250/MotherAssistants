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
	'children'
];

let setup_default = (after_init = null) =>
	$(document).ready(() => {
		$('.parallax').parallax();
		$('.sidenav').sidenav();
		$('.dropdown-trigger').dropdown();
		if(after_init !== null) {
			after_init();
		}
		$('.loader:first').fadeOut(3000, () =>  $('html').css('overflow-y', 'auto'));
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
});
let setup_children = () => setup_default(() => {
	$('.modal').modal();

	let generate_password = (nb_chars_in_password) => {
		let chars = 'abcdefghijklmnopqrstuvwxyz0123456789.!?$*&~#|';

		let password = '';
		for(let i = 0; i < nb_chars_in_password; i++) {
			password += chars.substr((Math.floor(Math.random() * chars.length - 1)), 1);
		}

		return password;
	};

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

	window.delete_child = () => {
		document.querySelector('#form_delete_child').submit();
		console.log(document.querySelector('#are_you_sure').getAttribute('data-id'));
	};

	window.add_id_to_modal = id => {
		document.querySelector('#are_you_sure').setAttribute('data-id', id);
		document.querySelector('#hidden_child_id').value = id;
	};
});
let setup = page_name => pages.includes(page_name) ? eval(`setup_${page_name}()`) : setup_default();
let change_label_approvals = new_value => document.querySelector('label[for=nb_approvals]').innerHTML = new_value;