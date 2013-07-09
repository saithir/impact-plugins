ig.module(
	'game.menus'
)
.requires(
	'plugins.impact-menu'
)
.defines(function(){

    MenuItemSoundVolume = MenuItem.extend({
    	getText: function() {
    		return 'Sound Volume: < ' + (ig.soundManager.volume*100).round() +'% >';
    	},
    	left: function() {
    		ig.soundManager.volume = (ig.soundManager.volume - 0.05).limit(0,1);
    	},
    	right: function() {
    		ig.soundManager.volume = (ig.soundManager.volume + 0.05).limit(0,1);
    	},
    	click: function() {
    		if( ig.input.mouse.x > 220 ) { this.right(); } else { this.left(); }
    	}
    });

    MenuItemMusicVolume = MenuItem.extend({
    	getText: function() {
    		return 'Music Volume: < ' + (ig.music.volume*100).round() +'% >';
    	},
    	left: function() {
    		ig.music.volume = (ig.music.volume - 0.05).limit(0,1);
    	},
    	right: function() {
    		ig.music.volume = (ig.music.volume + 0.05).limit(0,1);
    	},
    	click: function() {
    		if( ig.input.mouse.x > 220 ) { this.right(); } else { this.left(); }
    	}
    });

    MenuItemSaveConfig = MenuItem.extend({
        getText: function() { return "Save and Exit"; },
        ok: function() {
            ig.game.storage.set('soundVolume', ig.soundManager.volume);
            ig.game.storage.set('musicVolume', ig.music.volume);

            if (ig.game instanceof Splash) {
                ig.game.menu = new TitleMenu();
            } else {
                ig.game.menu = new PauseMenu();
            }
        }
    });

    ConfigMenu = Menu.extend({
        name: 'Config',
        clearColor: 'rgba(0,0,0,1)',
        itemClasses: [
            MenuItemSoundVolume,
            MenuItemMusicVolume,
            MenuItemSaveConfig
        ]
    });

    MenuItemPlayGame = MenuItem.extend({
        getText: function() { return 'Play Game'; },
        ok: function() {
            ig.game.menu = null;
            ig.system.setGame( RunnerGame );
        }
    });

    MenuItemHighscore = MenuItem.extend({
        getText: function() { return 'High Scores'; },
        ok: function() { ig.system.setGame( Highscore ); }
    })

    MenuItemConfig = MenuItem.extend({
    	getText: function() { return 'Config'; },
    	ok: function() { ig.game.menu = new ConfigMenu(); }
    });

    TitleMenu = Menu.extend({
        name: 'Runner',
    	itemClasses: [
    		MenuItemPlayGame,
            MenuItemHighscore,
    		MenuItemConfig,
    	]
    });

    MenuItemExit = MenuItem.extend({
        getText: function() { return 'Exit game'; },
        ok: function() {
            ig.game.menu = null;
            ig.system.setGame( Splash );
        }
    });

    MenuItemResume = MenuItem.extend({
        getText: function() { return 'Resume'; },
        ok: function() { ig.game.togglePause(); }
    });

    PauseMenu = Menu.extend({
        name: 'Paused',
        clearColor: 'rgba(0,0,0,0.6)',
        itemClasses: [
            MenuItemResume,
            MenuItemConfig,
            MenuItemExit
        ]
    });

});