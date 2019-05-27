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

function setup_home() {
	setup_default();
}

function setup_signon() {
	$(document).ready(() => {
		$('.parallax').parallax();
		$('.sidenav').sidenav();
		$('.datepicker').datepicker({
			format: 'dd/mm/yyyy'
		});
		$('.dropdown-trigger').dropdown();
		change_label_agreaments(document.querySelector('#nb_agreaments').value);
	});
}

function setup_default() {
	$(document).ready(() => {
		$('.parallax').parallax();
		$('.sidenav').sidenav();
		$('.datepicker').datepicker({
			format: 'dd/mm/yyyy'
		});
		$('.dropdown-trigger').dropdown();
	});
}

function setup(page_name) {
	switch (page_name) {
		case 'home':
			setup_home();
			break;
		case 'signon':
			setup_signon();
			break;
		default:
			setup_default();
			break;
	}
}

function change_label_agreaments(new_value) {
	document.querySelector('label[for=nb_agreaments]').innerHTML = new_value;
}