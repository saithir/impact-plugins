ig.module(
    'plugins.impact-menu'
)
.requires(
    'impact.font'
)
.defines(function() {
    MenuItem = ig.Class.extend({
        getText: function(){ return 'none' },
        left: function(){},
        right: function(){},
        ok: function(){},
        click: function(){
            this.ok();
            ig.system.canvas.style.cursor = 'auto';
        }
    });

    MenuManager = ig.Class.extend({
        mouse: false,

        font: null,
        fontSelected: null,
        fontTitle: null,

        sound: null,

        init: function(settings) {
            this.mouse = settings.mouse;

            this.font = new ig.Font( settings.font, ["FFFFFF"] );
            this.fontSelected = new ig.Font( settings.fontSelected, ["5780f9"] );
            this.fontTitle = new ig.Font( settings.fontTitle, ["FFFFFF"] );

            if (settings.sound) {
                this.sound = new ig.Sound( settings.sound );
            }
        }

    });

    Menu = ig.Class.extend({
        clearColor: null,
        name: null,
        current: 0,
        itemClasses: [],
        items: [],

        init: function() {
            this.y = ig.system.height/4 + 160;
            for( var i = 0; i < this.itemClasses.length; i++ ) {
                this.items.push( new this.itemClasses[i]() );
            }
        },

        update: function() {
            if( ig.input.pressed('up') ) {
                this.current--;
                if (ig.game.menuManager.sound) {
                    ig.game.menuManager.sound.play();
                }
            }
            if( ig.input.pressed('down') ) {
                this.current++;
                if (ig.game.menuManager.sound) {
                    ig.game.menuManager.sound.play();
                }
            }
            this.current = this.current.limit(0, this.items.length-1);

            if( ig.input.pressed('left') ) {
                this.items[this.current].left();
                if (ig.game.menuManager.sound) {
                    ig.game.menuManager.sound.play();
                }
            }
            if( ig.input.pressed('right') ) {
                this.items[this.current].right();
                if (ig.game.menuManager.sound) {
                    ig.game.menuManager.sound.play();
                }
            }
            if( ig.input.pressed('ok') ) {
                if (ig.game.menuManager.sound) {
                    ig.game.menuManager.sound.play();
                }
                this.items[this.current].ok();
            }

            if (ig.game.menuManager.mouse) {
                // HACKCKCKCKCK
                var ys = this.y;
                var xs = ig.system.width/2;
                var hoverItem = null;
                for( var i = 0; i < this.items.length; i++ ) {
                    var item = this.items[i];
                    var w = this.font.widthForString( item.getText() )/2;

                    if(
                       ig.input.mouse.x > xs - w && ig.input.mouse.x < xs + w &&
                       ig.input.mouse.y > ys && ig.input.mouse.y < ys + 24
                    ) {
                        if (ig.game.menuManager.sound) {
                            ig.game.menuManager.sound.play();
                        }
                        hoverItem = item;
                        this.current = i;
                    }
                    ys += 30;
                }

                if( hoverItem ) {
                    ig.system.canvas.style.cursor = 'pointer';
                    if( ig.input.pressed('click') ) {
                        if (ig.game.menuManager.sound) {
                            ig.game.menuManager.sound.play();
                        }
                        hoverItem.click();
                    }
                }
                else {
                    ig.system.canvas.style.cursor = 'auto';
                }
            }
        },

        draw: function() {
            if( this.clearColor ) {
                ig.system.context.fillStyle = this.clearColor;
                ig.system.context.fillRect(0, 0, ig.system.width, ig.system.height);
            }
            var xs = ig.system.width/2;
            var ys = this.y;
            if( this.name ) {
                ig.game.menuManager.fontTitle.draw( this.name, xs, ys - 160, ig.Font.ALIGN.CENTER );
            }

            for( var i = 0; i < this.items.length; i++ ) {
                var t = this.items[i].getText();
                if( i == this.current ) {
                    ig.game.menuManager.fontSelected.draw( t, xs, ys, ig.Font.ALIGN.CENTER, "5780f9" );
                }
                else {
                    ig.game.menuManager.font.draw( t, xs, ys, ig.Font.ALIGN.CENTER );
                }
                ys += 30;
            }
        }
    });

});