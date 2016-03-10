
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
    var onScroll;

	var sidebar = $('#sidebar');
	var figures = $('figure');
	var refs = $('.ref_wrapper');
	var contentWrapper = $('#content-wrapper');
	var header = $('header');
    var title =  $('#title');
    var intro = $('#intro');
    var nav = $('nav');
    var navHandlers = $('#navHandlers');

	var margin_between_panels = 12;
	var isSideBarHide;

	var highlightCharCount;
	var highlightGlyphs;



	onResize = function () {
		updateRefsPos();

        intro.css('width', $('#content').width())
        contentWrapper.css('margin-top', window.innerHeight)
        updateNavPos();

    };


    var contentMaxHeight = contentWrapper.height();
    var rootsPosition = {}
    var lastHeight = 0;
    var totalHeight = 0;


    function showChapter(){


        $('.tagwrapper').remove();

        var tags = ['Technology', 'web 2.0', 'semantic', 'interaction', 'Walter Benjamin'];
        var tagWrapper = $('<div class="tagwrapper">');

        $.each(tags, function(i, tag){
            var tagelem = $('<span class="tag">').text(tag);
            tagWrapper.append( tagelem );
        })


        var hand = this;

        tagWrapper.css( {
            left: $(hand).position().left + 36,
            top: $(hand).position().top
        } )


        tagWrapper.insertAfter( hand );
    }

    function calNavHeight(){
        var z = 0.3;
        return window.innerHeight * z
    }

    function updateNavHeight(){
        var h = calNavHeight();
        nav.css('height', h );
        return h;
    }

    function closeNav(){

        nav.show();

        if( nav.hasClass('close') )
            return;

        var content = nav.find('#tc-content')
        var bars = nav.find('.bar');

        nav.addClass('close');
        content.addClass('off');

        adjustNavSize();
    }

    function hideNav(){
        nav.hide();
    }


    function updateNavPos(){

        nav.css({
            left: contentWrapper.width() - 12,
            top: ( window.innerHeight-nav.height()) / 2
        })

    }

    function updateTitlePosition(){
        rootsPosition = [];
        totalHeight = 0;
        var lastTop= 0;


        $('.title:not(#title)').each(function(){
            var idx = $(this).text().split( ' ' )[0];

            if( idx.trim().length ) {
                var idx = $(this).text().split( ' ' )[0].trim();

                if( idx[idx.length-1] == "." )
                    idx = idx.substr(0,idx.length-1)

                var rootNumber = idx[0];
                var thisTop = $(this).position().top;

                var lastHeight = thisTop - lastTop;

                if(rootsPosition[ rootsPosition.length -1 ]) {
                    rootsPosition[rootsPosition.length - 1].height = lastHeight;
                    totalHeight += lastHeight;
                }

                rootsPosition.push({idx: idx, height: null, root: rootNumber})

                lastTop = thisTop;
            }

        })

        console.log( rootsPosition )
    }
    function adjustNavSize(){
        updateTitlePosition();
        var navHeight = updateNavHeight();


        for(var x in rootsPosition ){
            var subroot = rootsPosition[x];

            var id = subroot.idx.replace(/\./g,'_')

            var subRootWrapper = nav.find( '.ts-text#id' + id ).parent();

            console.log(id, subroot.idx, subRootWrapper[0])

            if( subroot.height ) {
                var h = subroot.height.remap(0, totalHeight, 0, 100)
                subRootWrapper.css('height', h + "%")
            }

        }


        //nav.find('#tc-content>div').each(function(){
        //    var rootContainer = $(this);
        //    var thisRoot = rootContainer.index()+1;
        //    var thisRoot_Height = 0;
        //
        //    var subRootPositions = rootsPosition.filter(function(subroot){
        //
        //        var isSameRoot =  subroot.root == thisRoot;
        //        if(isSameRoot)
        //            thisRoot_Height+=subroot.height;
        //
        //        return isSameRoot;
        //    })
        //
        //
        //    for(var x in subRootPositions ){
        //        var subroot = subRootPositions[x];
        //
        //        var subRootWrapper = $(this).find( '.ts-text#' + subroot.idx).parent();
        //
        //        subRootWrapper.css('height', this)
        //
        //    }
        //
        //
        //    $(this).height('height', thisRoot_Height);
        //
        //})




        //$('.ts-text').each(function(){
        //    var root = $(this).parents('div');
        //    var idx_root = $(this).parents('div').index() + 1;
        //
        //
        //})


    }

    function openNav(){
        nav.show();
        var content = nav.find('#tc-content')

        nav.removeClass('close');
        content.removeClass('off');

    }


    var maxScrollTop = $(document).height();

    onScroll = function(){
        var currentTop = $(this).scrollTop();
        var winTop =  currentTop - 150;

        var navHandlerPos = winTop.remap(0, maxScrollTop, 0, 100);





        navHandlers.css('top', navHandlerPos+"%");

        if( winTop >= 0 && !nav.hasClass('close') ){
            hideNav();
        }

        if(  winTop >= window.innerHeight ){
            header.show();
            closeNav();
        }
        else {
            header.hide()
            openNav();
        }

    }

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

    navHandlers.click(showChapter);

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


    var glyphIndex = 0;
    var txt = title.text().replace(/(.)/g, '<span class="glyph">$1</span>');
    title.html(txt).find('.glyph').each(function(){
        $(this).attr('index', glyphIndex);
        if( glyphIndex == 8 ){
            $('<span class="whitespace">').insertAfter( this )
        }
        glyphIndex++;
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
		.click( showSideBar );

	$('.highlight, #title')
		.each(highlightInRandomOrder)

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


    onResize();
	setRefsSize();
	updateRefsPos();
	$(window)
        .resize(onResize)
        .scroll(onScroll);
});

