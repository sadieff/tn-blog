$(document).ready(function(){

	$(document).on('click', '.js-menu-toggle', function(){
		$('.header-menu').toggleClass('active');
		$('body').toggleClass('menu-opened');
	});

	// Табы
	$(document).on('click', '.js-tab-open:not(.active)', function(){

		$(this).addClass('active');
		$(this).siblings().removeClass('active');

		let target = $('div[data-id='+$(this).data('target')+']');
		target.siblings().css('display', 'none');
		target.fadeIn(300);

	});

	// Список проектов на мобильных устройствах
	$(document).on('click', '.js-open-projects,.js-projects-close', function(){
		$('.js-projects').toggleClass('active');
	});


	// сортировка
	$(document).on('click', '.js-sort-select', function(){
		$(this).toggleClass('active');
	});

	$(document).on('click', function(e){
		if (!$(e.target).closest(".js-sort").length) {
			$('.js-sort-select.active').removeClass('active');
		}
	});

	$(document).on('click', '.js-sort a', function(){
		let value = $.trim($(this).text()),
			sortContainer = $(this).closest('.js-sort');

		$(this).closest('li').siblings().removeClass('active');
		$(this).closest('li').addClass('active');
		sortContainer.find('.js-sort-select').text(value).removeClass('active');
	});

	// Карусели
	$('.js-carousel-article').owlCarousel({
		loop: false,
		margin: 20,
		navText: [],
		nav: true,
		responsive: {
			0:{
				items:1,
				autoWidth: true,
				nav: false
			},
			768:{
				items: 2
			}
		}
	});
	$('.js-carousel-media').owlCarousel({
		loop: false,
		margin: 20,
		navText: [],
		nav: true,
		responsive: {
			0:{
				items: 1,
				autoWidth: true
			},
			768:{
				items: 2
			},
			992: {
				items: 3
			}
		}
	});

	// Голосование за рейтинг
	$('.js-rating label').hover(
		function(){
			$(this).add($(this).prevAll()).addClass('hover');
		},
		function(){
			$(this).add($(this).prevAll()).removeClass('hover');
		}
	);

	$(document).on('click', '.js-rating label', function(){
		$(this).siblings().removeClass('active');
		$(this).add($(this).prevAll()).addClass('active');
	});

	// Навигация по статье
	$(document).on('click', '.js-aricle-menu li', function(e){
		let anchor = $(this).data('target');
		$(this).siblings('li').removeClass('active');
		$(this).addClass('active');
		$('html, body').stop().animate({
			scrollTop: $(anchor).offset().top - 30
		}, 1000);
		e.preventDefault();
	});

	// Попап окна
	$(document).on('click', '.js-open-feedback', function(){
		openModal('.js-modal-feedback');
	});

	$(document).on('click', '.js-login', function(){
		openModal('.js-modal-login');
	});

	$(document).on('click', '.js-reg', function(){
		openModal('.js-modal-reg');
	});

	$(document).on('click', '.js-open-recovery', function(){
		$.fancybox.close(true);
		openModal('.js-modal-recovery');
	});


	$(document).on('click', '.js-exit', function(){
		$('.header-user-icon').css('display', 'none');
		$('.header-user-login').css('display', 'block');
	});


	function openModal (element){
		$.fancybox.open({
			src  : element,
			type : 'inline',
			attr: {
				scrolling: "none"
			},
			scrolling : 'visible',
			touch: false
		});
	}

	// Валидация форм
	$(document).on('click', '.js-submit', function(e){

		e.stopPropagation();
		e.preventDefault();

		let $form = $(this).closest('form'),
			data = $form.serialize(),
			action = $form.attr('action'),
			rules = Object(),
			inputs = $form.find('input').add('textarea', $form.get(0)),
			validate = true;

		inputs.each(function(){
			let r = $(this).data('rules');
			if (r && r.length != 0){
				rules[$(this).attr('name')] = r;
				r = r.split(',');
				for (i = 0; i < r.length; i++) {
					var rule = r[i];
					if (validator[rule]){
						if ( !validator[rule]($(this)) ){
							validate = false;
						}
					}
				}
			}
		});

		if (!validate) return;
		let btn = $(this).addClass('desabled').removeClass('.js-submit');

		$.ajax({
			url: action,
			data: '/local/ajax/'+data,
			type:'post',
			dataType: 'JSON',
			success:function(data){
				btn.addClass('desabled').removeClass('.js-submit');
			}
		});

		return false;
	});

	$('input').add('textarea').on('focus', function(){
		$(this).parent()
			.removeClass('wrong');
	}).each( function(){

		if ( $(this).data('rules') ){
			$(this).wrap('<div class="feild_wrapper"></div>');
			$(this).parent().append('<span class="error_label"></span>');
		}

	});

});


var validator = {
	required:function($i){
		if ($i.val() == '' || $i.val() == $i.attr('placeholder')){
			fieldError.call( $i, lang.requiredError );

			return false;
		}
		return true;
	},
	email:function($i){

		if ($i.val() == '') return true;

		var r = new RegExp(".+@.+\..+","i");
		if ( ! r.test($i.val()) ){
			fieldError.call( $i, lang.emailError );
			return false;
		}
		return true;
	},
	phone:function($i){
		console.log('phone');
		var r = new RegExp("^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$","i");
		if ( ! r.test($i.val()) ){
			fieldError.call( $i, lang.phoneError );
			return false;
		}
		return true;
	}
}

var fieldError = function(message){

	if ( !$(this).parent().hasClass('feild_wrapper') ){

		$(this).wrap('<div class="feild_wrapper"></div>');
		$(this).parent().append('<span class="error_label"></span>');

	}

	$(this).parent().addClass('wrong');
	$(this).siblings('.error_label').text( message );

	return false;
}

var lang = {
	success: 			'Ваша заявка успешно отправлена',
	error: 				'Произошла ошибка, попробуйте еще раз',
	name: 				'Имя',
	phone:				'Телефон',
	email: 				'Email',
	programs: 			'Программы',
	requiredError:		'Это поле не может быть пустым',
	emailError:			'Поле Email должно содержать корректный адрес',
	phoneError:			'Укажите корректный номер телефона'
};