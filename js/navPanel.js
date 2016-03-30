var MODULES = (function(){

    function Nav(){
        var self = this;

        self.panel = $('#navbar');
        var links = self.panel.find('.link');
        var bar = self.panel.find('#bar');
        var content = self.panel.find('#tc-content');
        var mobileHandler = $('#mobile-handler');
        var markers;
        var margin = 12;
        var isFolded = false;
        var barPosLeft = 0;
        var itisInitilized = false;

        var markerPos = [];


        function newMarker(h,id,txt){
            var marker = $('<span class="marker">');

            marker
                .attr({
                    ref: id,
                    title: txt,
                })
                .css('height', h+"%")
                .append( $('<span class="marker-text">').text(txt) )
                .click(self.goTo)

            return marker;
        }

        self.onScroll = function(scrollTop, maxScrollTop){

            if(scrollTop<= window.innerHeight-200 && itisInitilized){

                self.show();
            }


            var navHandlerPos = ~~remapFloat(scrollTop, 0, maxScrollTop, 0, 100);

            var temp = markerPos.slice(0);
            var minDy = 30000;
            var currentMarkerId;

            for(var x in markerPos) {
                var dy = Math.abs(markerPos[x].top-scrollTop);

                if (dy<minDy){
                    minDy = dy;
                    currentMarkerId = markerPos[x].id;
                }
            }

            var currentMarker = markers
                .removeClass('highlight')
                .filter('[ref="'+ currentMarkerId +'"]')
                .addClass('highlight')


        }

        self.onResize = function(contentW){

            var top = ( window.innerHeight - self.panel.height() ) / 2;
            self.panel.css({top: top});

            if($(window).width() <= 760){
                self.panel.addClass('mobile');

            }else if( !isFolded ) {
                var left = contentW + margin;
                self.panel.removeClass('mobile');
                self.panel.css({left: left,background:"none"});
            }

            barPosLeft = contentW
            bar.css({
                height: window.innerHeight / 2,
                left: barPosLeft - bar.width()
            })

        }



        self.initBar = function(segmentPos, segmentHeights, totalHeight){

            markerPos = segmentPos

            function extractId(){
                var txt = $(this).text();

                if(txt.trim().length){
                    var id = txt.match(/\d/g).join('_');
                    return id;
                }

                return null;
            }

            var t=0;

            links.each(function(i,el){
                var id = extractId.call(this);
                var txt = $(this).text()

                if(id) {
                    var height = remapFloat(segmentHeights[i], 0, totalHeight,0,100 );
                    t+= height
                    bar.append(newMarker(height,id,txt));
                    $(this).attr('ref', id)
                }
            })

            markers = bar.find('.marker');
            mobileHandler.click( self.showMobile );

        }


        self.showMobile = function(){
            if( !self.panel.hasClass('mobile') )
                return;

            if(content.is(':visible'))
                content.hide();
            else
                content.show()

        }

        self.unFold = function(){
            self.panel.addClass('unfold');
            bar.show().animate({left: barPosLeft-bar.width()}, 1000)
            isFolded = false;
        }

        self.fold = function(){
            self.panel.removeClass('unfold');
            bar.hide().css({left: barPosLeft-margin})

            isFolded = true;
        }

        self.hide = function(){
            $('#content').show();
            $('#sidebar').show();

            self.unFold();
        }

        self.show = function(){
            $('#content').hide();
            $('#sidebar').hide();

            self.fold();
        }

        self.goTo = function(){

            self.hide();

            itisInitilized = true;

            var id = $(this).attr('ref');
            var scrollTop = $('#'+id).position().top - 100

            window.scroll(0, scrollTop);

        }


        self.init = (function(){
            links.click( self.goTo );
        })();




        return self;
    }


    return {nav:Nav}

})();
