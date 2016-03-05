
$(function(doc) {


	var updateOtherGlyphsOpacityByGlyphIndex;
	var onMove;
	var updateHighlightCharCount;
	var getSubForRefrence;
	var updateRefsPos;
	var setRefsSize;
	var onResize;
	var showSideBar;
	var hideSideBar;

	var sidebar = $('#sidebar');
	var figures = $('figure');
	var refs = $('.ref_wrapper');
	var contentWrapper = $('#content-wrapper');
	var header = $('header');
	var margin_between_panels = 12;
	var isSideBarHide;

	var highlightCharCount;
	var highlightGlyphs;

	onResize = function () {
		updateRefsPos()
	};

	setRefsSize = function () {
		figures.each(function () {
			var figWrapper = $(this);
			var img = figWrapper.find('img');

			var w = img.width();
			var r = img.attr('original_width') * 1 / img.attr('original_height') * 1;
			var h = (w / r) + figWrapper.height();

			figWrapper.css({height: h})
		})
	};
	updateRefsPos = function () {

		var lastY = 0;
		refs.each(function () {

			var ref = $(this);
			var sup = getSubForRefrence(this);

			var y = sup.position().top;

			if (y < lastY) {
				y = lastY + margin_between_panels;
				ref.addClass('is')
			}

			lastY = y + ref.outerHeight();
			ref.css({top: y});
		})

	};

	$('.highlight').each(function(){

		var glyphIndex = 0;

		$(this).find('*:not(sup)').each(function(){
			var txt = $(this).text().replace(/(.)/g, '<span class="glyph">$1</span>');
			$(this).html(txt).find('.glyph').each(function(){
				$(this).attr('index', glyphIndex);
				glyphIndex++;
			})
		});

	})


	updateOtherGlyphsOpacityByGlyphIndex = function (glyphIndex) {

		highlightGlyphs.each(function () {
			var this_idx = $(this).attr('index') * 1;
			var opacity = Math.abs(glyphIndex - this_idx).remap(1, highlightCharCount, 1, 0.1);
			$(this).css('opacity', opacity)
		})

	};

	onMove = function (e) {
		var glyphIndex = $(this).attr('index') * 1;
		updateOtherGlyphsOpacityByGlyphIndex(glyphIndex);
	};
	updateHighlightCharCount = function () {
		highlightGlyphs = $(this).find('.glyph');
		highlightCharCount = highlightGlyphs.size();
	};
	getSubForRefrence = function (ref) {
		return $('sup>span[ref="' + ref.id + '"]');
	};


	showSideBar = function(){

		if( window.innerWidth > 760 )
			return;

		contentWrapper.toggleClass('off');

	}

	hideSideBar = function(e){

		if( window.innerWidth > 760 )
			return;

		if( $(e.target).parents('.highlight').size() )
			return;

		contentWrapper.removeClass('off');
	}

	var highlightInRandomOrder = function(){
		updateHighlightCharCount.call(this)

		var randomIdx = randomInt(1,highlightCharCount-1);
		updateOtherGlyphsOpacityByGlyphIndex( randomIdx );

	}

	var highlightRefInText = function(){
		var sub = getSubForRefrence( this );
		sub.parents('.highlight').toggleClass('highlight_on');
	}

	var openNavBar = function(){
		var navlink = $(this);

		//header.animate({height: 1020}, 500,function(){
		//	//navlink.siblings('.tc-content').show();
		//})

	}

	var showNavLinks = function(){
		header.find('.navlink').each(function(){
			$(this).animate({opacity:1}, 500);
		})
	}

	var hideNavLinks = function(){
		header.find('.navlink').each(function(){
			$(this).animate({opacity:0}, 500);
		})
	}


	$('.highlight')
		.mouseenter( updateHighlightCharCount )
		.each(highlightInRandomOrder)
		.click( showSideBar );

	$('.glyph')
		.on('mousemove', onMove);


	$('.nav-link').click(openNavBar);

	contentWrapper
		.click( hideSideBar );

	refs
		.hover(highlightRefInText);

	header
		.mouseenter(showNavLinks)
		.mouseleave(hideNavLinks)


	setRefsSize();
	updateRefsPos();
	$(window).resize(onResize);

});

