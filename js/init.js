
$(function(doc) {

	var sidebar = $('#sidebar');
    var sideBarPrint = sidebar.clone().attr('id', 'siderbar-print');

    var figures = $('figure');
	var refs = $('#sidebar .ref_wrapper');
	var contentWrapper = $('#content-wrapper');
	var header = $('header');
    var title =  $('#title');
    var intro = $('#intro');
    var content = $('#content')
    var navbar = $('#navbar')

	var margin_between_panels = 12;
	var isSideBarHide;

	var highlightCharCount;
	var highlightGlyphs;


    var contentMaxHeight = contentWrapper.height();
    var rootsPosition = {}
    var lastHeight = 0;
    var totalHeight = 0;
    var maxScrollTop = $(document).height();

    var nav = MODULES.nav();

    var lastSegmentH = 0;

    function onResize() {
		updateRefsPos();
        nav.onResize( contentWrapper.width() )

    };
    function onMove(e) {
        var glyphIndex = $(this).attr('index') * 1;
        updateOtherGlyphsOpacityByGlyphIndex(glyphIndex);
    };
    function onScroll(){
        var currentTop = $(this).scrollTop();
        var winTop =  currentTop;

        console.log(lastSegmentH);
        nav.onScroll(winTop, contentWrapper.height() - lastSegmentH +100)
    };

    function setRefsSize() {
		figures.each(function () {
			var figWrapper = $(this);
			var img = figWrapper.find('img');

			var w = img.width();
			var r = img.attr('original_width') * 1 / img.attr('original_height') * 1;
			var h = (w / r) + figWrapper.height();

			figWrapper.css({height: h})
		})
	};
    function updateRefsPos() {

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


    function updateOtherGlyphsOpacityByGlyphIndex(glyphIndex) {
		highlightGlyphs.each(function () {
			var this_idx = $(this).attr('index') * 1;
			var opacity = remapFloat(Math.abs(glyphIndex - this_idx), 1, highlightCharCount, 1, 0.1);
			$(this).css('opacity', opacity)
		})

	};
    function updateHighlightCharCount() {
		highlightGlyphs = $(this).find('.glyph');
		highlightCharCount = highlightGlyphs.size();
	};
    function getSubForRefrence(ref) {
		return $('sup>span[ref="' + ref.id + '"]');
	};

    function showSideBar(){

		if( window.innerWidth > 760 )
			return;

		contentWrapper.toggleClass('off');

	}
    function hideSideBar(e){

		if( window.innerWidth > 760 )
			return;

		if( $(e.target).parents('.highlight').size() )
			return;

		contentWrapper.removeClass('off');
	}

	function highlightInRandomOrder(){
		updateHighlightCharCount.call(this)
		var randomIdx = randomInt(1,highlightCharCount-1);
		updateOtherGlyphsOpacityByGlyphIndex( randomIdx );
	}
	function highlightRefInText(){
		var sub = getSubForRefrence( this );
		sub.parents('.highlight').toggleClass('highlight_on');
	}


    function splitHighlightsIntoGlyphs(){

        var glyphIndex = 0;


        $(this).find('*:not(sup)').each(function(){
            var txt = $(this).text().replace(/(.)/g, '<span class="glyph">$1</span>');

            $(this).html(txt).find('.glyph').each(function(){
                $(this).attr('index', glyphIndex);
                glyphIndex++;
            })

        });

    }


    function splitTitleIntoGlyphs(){
        var glyphIndex = 0;
        var txt = title.text().replace(/(.)/g, '<span class="glyph">$1</span>');
        title.html(txt).find('.glyph').each(function(){
            $(this).attr('index', glyphIndex);
            if( glyphIndex == 8 ){
                $('<span class="whitespace">').insertAfter( this )
            }
            glyphIndex++;
        })
    }

    function hideContent(){
        content.hide();
        sidebar.hide();
    }


    function markSegments(){

        var segments = $('.title:not(#title)');

        var totalHeight = 0;
        var segmentHeights = [];
        var segmentPos = []
        var lastSegmentTop = 0


        function extractId(){
            var txt = $(this).text();

            if(txt.trim().length){
                var id = txt.match(/\d/g).join('_');
                return id;
            }

            return null;
        }


        $(segments).each(function(i,el){
            var id = extractId.call(this);

            if(id) {
                var thisTop = $(this).position().top  - window.innerHeight - 100;
                var lastSegmentHeight = thisTop - lastSegmentTop
                totalHeight+=lastSegmentHeight

                segmentHeights.push(lastSegmentHeight);
                segmentPos.push({top: thisTop, id: id})
                $(this).attr({'id': id, index: segmentHeights.length});

                lastSegmentTop  = thisTop;
            }

        })

        segmentHeights.shift();
        var lastSegment = segments.eq(segments.size()-1)
        lastSegmentH = contentWrapper.height() - lastSegment.position().top;
        //segmentHeights.push( lastSegmentH );
        segmentHeights.push( 0 );

        nav.initBar( segmentPos, segmentHeights, totalHeight );
    }


    function parseSpacialTags(){


        var regex_href = /(http|ftp|https:\/\/[\w\-_]+\.{1}[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/gi;
        var regex_capitalChain = /([A-Z][\w-]*(\s+[A-Z][\w-]*)+)/;

        function wrapAnchorTag(text) {

            return text.replace(regex_href,function(href){
                var a = document.createElement("a");
                a.href = href;
                a.className = "link"
                a.text = a.hostname;
                a.title = href;
                return a.outerHTML;
            });

        }


        function wrapCapitals(text){

            return text.replace(regex_capitalChain,'<a style="color: black !important;" target="_blank" class="capital" href="https://en.wikipedia.org/w/index.php?search=$1">$1</a>');

        }

        refs.each(function(){

            $(this).find('*').each(function(){

                for(var x=0; x<this.childNodes.length;x++){
                    if( this.childNodes[x].nodeType == 3 ){
                        var _parentNode = this.childNodes[x].parentNode;
                        var txt = this.childNodes[x].nodeValue;
                        _parentNode.innerHTML =  wrapAnchorTag( txt )
                        _parentNode.innerHTML = wrapCapitals( _parentNode.innerHTML );

                    }
                }



            })

        });


        $('span.c4').each(function(){
            this.innerHTML = wrapCapitals( this.innerHTML )
        })


    }

    parseSpacialTags();

    function attachEvents(){


        sideBarPrint.attr('id', 'sidebar-print');

        splitTitleIntoGlyphs();

        $('.highlight')
            .each( splitHighlightsIntoGlyphs )
            .each(highlightInRandomOrder)
            .mouseenter( updateHighlightCharCount )
            .click( showSideBar );


        title
            .each(highlightInRandomOrder )

        contentWrapper
            .click( hideSideBar );

        refs
            .hover(highlightRefInText);

        $('.glyph')
            .mousemove(onMove);

        $(window)
            .resize(onResize)
            .scroll(onScroll);

    }


    (function init(){

        sideBarPrint.hide().appendTo($('body'))

        attachEvents();
        markSegments();
        onResize();
        setRefsSize();
        updateRefsPos();
        hideContent();

    })();


});

