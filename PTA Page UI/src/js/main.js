/**
 * [[Archivo global del proyecto]]
 * @private
 * @author Luis Gerardo <gerrydesarrolla@gmail.com>
 */

(function ($) {
	let init = () => {
		if($('img.lazy').length) lazyLoadAssets();
		if($('img.imgResp').length) changeImageResp();
		if($('.js-menu-mobile').length) handleMenuMobile();
	};
	/**
	 * @description Carga diferida de imagenes
	 * */
	var lazyLoadAssets = () => {
		document.addEventListener("DOMContentLoaded", function() {
			var lazyloadImages;
			if ("IntersectionObserver" in window) {
				lazyloadImages = document.querySelectorAll(".lazy");
				var imageObserver = new IntersectionObserver(function(entries, observer) {
					entries.forEach(function(entry) {
						if (entry.isIntersecting) {
							var image = entry.target;
							image.src = image.dataset.src;
							image.classList.remove("lazy");
							imageObserver.unobserve(image);
						}
					});
				});
				lazyloadImages.forEach(function(image) {
					imageObserver.observe(image);
				});
			} else {
				console.info('no soportado');
				notSupportedLazy();
				$(document).on('scroll', function() {
					notSupportedLazy();
				})
			}
		})
	};
	
	/**
	 * @description Si no es soportada la carga diferida de imagenes
	 * */
	var notSupportedLazy = () => {
		var imgLazy = $('.lazy'),
			timeLazy,
			scrollTop;
		scrollTop = $(window).scrollTop();
		for (var i = 0; i < imgLazy.length; i++) {
			if ($(imgLazy[i]).offset().top < ($(window).height() + scrollTop)) {
				$(imgLazy[i]).attr('src', $(imgLazy[i]).attr('data-src'));
				$(imgLazy[i]).removeClass('lazy');
			}
		}
	}
	
	/**
	 * @description Manejo de images responsive
	 * */
	var changeImageResp = () => {
		var image = $('.imgResp'),
			imgDesk,
			imgMob;
		
		for (var i = 0; i < image.length; i++) {
			imgDesk = $(image[i]).attr('data-desktop');
			imgMob = $(image[i]).attr('data-mobile');
			
			if ($(window).width() <= 768) {
				$(image[i]).attr('src', imgMob);
			} else {
				$(image[i]).attr('src', imgDesk);
			}
		}
	};

	var handleMenuMobile = () => {
		$('.js-menu-mobile').on('click', () => {
			console.log("Testing click");
			$('.js-menu-mobile').toggleClass('isActive');
			$('.c-header__links').toggleClass('isActive');
		});
	}
	
	init();
})(jQuery);

