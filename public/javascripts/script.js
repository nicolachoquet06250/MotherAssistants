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
	'account'
];

let setup_default = (after_init = null) =>
	$(document).ready(() => {
		$('.parallax').parallax();
		$('.sidenav').sidenav();
		$('.datepicker').datepicker({
			format: 'dd/mm/yyyy'
		});
		$('.dropdown-trigger').dropdown();
		if(after_init !== null) {
			after_init();
		}
	});

let setup_home = () => setup_default();
let setup_sign_in = () => setup_default();

let setup_sign_on = () => setup_default(() => {
	change_label_approvals(document.querySelector('#nb_approvals').value);
});

let setup_account = () => setup_default(() => {
	let profile_pic_resize = () => document.querySelector('.profile-pic').style.height = document.querySelector('.profile-pic').offsetWidth + 'px';
	profile_pic_resize();
	window.onresize = () => {
		profile_pic_resize();
	}
});

let setup = page_name => pages.includes(page_name) ? eval(`setup_${page_name}()`) : setup_default();

let change_label_approvals = new_value => document.querySelector('label[for=nb_approvals]').innerHTML = new_value;