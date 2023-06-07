$(document).ready(function () {

	$(".navbar__navMenu__open").click(function () {
		if (!$(this).hasClass("isMenuOpen")) {
			console.log("Abri el menu");
			$(this).toggleClass("isMenuOpen");
			$("body").toggleClass("navMenuOpen");
			$("nav.navbar").toggleClass("navbar--navMenuOpen");
		} else {
			console.log("Cerre el menu");
			$(this).toggleClass("isMenuOpen");
			$("body.android").toggleClass("navMenuOpen");
			$("nav.navbar").toggleClass("navbar--navMenuOpen");
		}

	});

	$(".navbar__navMenu__close").click(function () {
		if ($(".navbar__navMenu__open").hasClass("isMenuOpen")) {
			console.log("Cerre el menu");
			$(".navbar__navMenu__open").toggleClass("isMenuOpen");
			$("body").toggleClass("navMenuOpen");
			$("nav.navbar").toggleClass("navbar--navMenuOpen");
		}
	});

	$(".gblLeaderboard__trainer__battles__delete-player__button").click(function (e) {
		e.preventDefault();
		let accountID = $(this).attr('data-accountID');
		let characterID = $(this).attr('data-characterID');
		let characterName = $(this).attr('data-characterName');

		if(confirm(`Are you sure you want to delete ${characterName}?`)){
			//console.log("Endpoint: ", `/delete_character/${accountID}/${characterID}`);
			window.location.href = `/delete_character/${accountID}/${characterID}`;
		}
		
		
		
	});


	let ajax_form = document.querySelector(".ajax-form");
	ajax_form.onsubmit = event => {
		event.preventDefault();
		if (document.querySelector(".g-recaptcha")) {
			grecaptcha.ready(() => {
				console.log(document.querySelector(".g-recaptcha").dataset.sitekey);
				grecaptcha.execute(document.querySelector(".g-recaptcha").dataset.sitekey, { action: 'submit' }).then(captcha_token => {
					process_form(ajax_form, captcha_token);
				});
			});
		} else {
			process_form(ajax_form)
		}
	};

	const process_form = (ajax_form, captcha_token) => {
		fetch(ajax_form.action, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(new FormData(ajax_form)).toString() }).then(response => response.text()).then(result => {
			if (result.toLowerCase().includes("success")) {
				window.location.href = "home";
			} else if (result.includes("tfa:")) {
				window.location.href = result.replace("tfa: ", "");
			} else if (result.toLowerCase().includes("autologin")) {
				window.location.href = "home";
			} else {
				document.querySelector(".msg").innerHTML = result;
			}
		});
	};

	
});