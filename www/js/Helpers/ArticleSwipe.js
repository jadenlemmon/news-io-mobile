var Swipe = (function() {

    var options = {
        distance: 0,
        resistance: 1.5,
        ele: null,
        bar: null
    };

    function init(opts) {
        options.callback = opts.finish;
        options.ele = document.getElementById('read-article');
        options.bar = document.getElementsByClassName('back-bar')[0];
        var hammertime = new Hammer(options.ele);
        hammertime.get('pan').set({ direction: Hammer.DIRECTION_RIGHT });
        hammertime.on( 'panright panend panstart', _pan );

        var vertical = new Hammer(options.ele);
        vertical.get('pan').set({ direction: Hammer.DIRECTION_VERTICAL });

        // only recognize the inner pan when the outer is failing.
        // they both have a threshold of some px
        hammertime.get('pan').requireFailure(vertical.get('pan'));
    }

    function _pan(ev) {
        options.distance = ev.distance / options.resistance;

        var threshhold = window.innerWidth * .70;

        if(Hammer.DIRECTION_HORIZONTAL) {
            if (ev.type == 'panend' || ev.type == 'pancancel') {
                options.ele.className += ' animate';
                options.ele.className = options.ele.className.replace('swiping', '').trim();

                options.bar.className += ' animate';
                options.bar.className = options.bar.className.replace('swiping', '').trim();
                if(ev.distance > (threshhold)) {

                    options.ele.style.transform = options.ele.style.transform = 'translate3d( ' + window.innerWidth + 'px,0 ,0 )';
                    options.ele.style.transform = options.ele.style.webkitTransform = 'translate3d( ' + window.innerWidth + 'px,0 ,0 )';

                    options.bar.style.transform = options.ele.style.transform = 'translate3d( ' + window.innerWidth + 'px,0 ,0 )';
                    options.bar.style.transform = options.ele.style.webkitTransform = 'translate3d( ' + window.innerWidth + 'px,0 ,0 )';

                    options.callback();
                    setTimeout(function() {
                        options.ele.style.transform = options.ele.style.transform = '';
                        options.ele.style.transform = options.ele.style.webkitTransform = '';

                        options.bar.style.transform = options.ele.style.transform = '';
                        options.bar.style.transform = options.ele.style.webkitTransform = '';
                    },600);
                }
                else {
                    options.ele.style.transform = options.ele.style.transform = '';
                    options.ele.style.transform = options.ele.style.webkitTransform = '';

                    options.bar.style.transform = options.ele.style.transform = '';
                    options.bar.style.transform = options.ele.style.webkitTransform = '';
                }

            }
            else if(ev.type == 'panright') {
                options.ele.className = options.ele.className.replace('animate', 'swiping').trim();
                options.bar.className = options.bar.className.replace('animate', 'swiping').trim();
                options.ele.style.transform = options.ele.style.transform = 'translate3d( ' + options.distance + 'px,0' +
                    ' ,0 )';
                options.ele.style.transform = options.ele.style.webkitTransform = 'translate3d( ' + options.distance + 'px,0 ,0 )';
                options.bar.style.transform = options.ele.style.transform = 'translate3d( ' + options.distance + 'px,0' +
                    ' ,0 )';

                options.bar.style.transform = options.ele.style.webkitTransform = 'translate3d( ' + options.distance + 'px,0 ,0 )';
            }
        }

    }

    return {
        init: init
    }
})();