ig.module(
  	'plugins.impact-endless-level'
)
.requires(
  	'impact.game'
)
.defines(function() {
  	ig.Game.inject({
  		levelchunks: [],

  		createLevelChunks: function(data) {
			var layer = data.layer[0];

			var chunks_count = layer.data[0].length / 20;
			for (var i = 0; i < chunks_count; i++ ) {
				this.levelchunks[i] = {
					data: [],
					collision: [],
					tilesetName: layer.tilesetName,
					tilesize: layer.tilesize
				}

				for (var j = 0; j < layer.data.length; j++ ) {
					this.levelchunks[i].data[j] = [];
				}
			}
			for (var i = 0; i < layer.data.length; i++) {
				for (var k = 0; k < chunks_count; k++) {
					var chunk_line = layer.data[i].slice(k*20, k*20+20);
					this.levelchunks[k].data[i] = chunk_line;

					var collision_line = [];
					for (var j = 0; j < chunk_line.length; j++ ) {
						collision_line[j] = (chunk_line[j] > 0) ? 1 : 0;
					}
					this.levelchunks[k].collision[i] = collision_line;
				}
			}
  		},

  		loadNextChunk: function() {
	        if (this.player.pos.x >= (this.backgroundMaps[0].width * this.backgroundMaps[0].tilesize) - ig.system.width) {
	            console.log('end of level '+ this.player.pos.x + ' ' + ((this.backgroundMaps[0].width * this.backgroundMaps[0].tilesize) - ig.system.width));

	            var next_chunk = this.levelchunks[Math.floor(Math.random()*this.levelchunks.length)];

	            for(var i = 0; i < this.backgroundMaps[0].data.length; i++) {
	                var tmp = next_chunk.data[i];
	                this.backgroundMaps[0].data[i] = this.backgroundMaps[0].data[i].concat(tmp);
	            }
	            this.backgroundMaps[0].width = this.backgroundMaps[0].data[0].length;

	            for(var i = 0; i < this.collisionMap.data.length; i++) {
	                var tmp = next_chunk.collision[i];
	                this.collisionMap.data[i]= this.collisionMap.data[i].concat(tmp);
	            }
	            this.collisionMap.width = this.collisionMap.data[0].length;

	            this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
	            this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;
	        }
  		}

		loadLevel: function( data ) {
			this.screen = {x: 0, y: 0};

			this.createLevelChunks(data);

			// Entities
			this.entities = [];
			this.namedEntities = {};
			for( var i = 0; i < data.entities.length; i++ ) {
				var ent = data.entities[i];
				this.spawnEntity( ent.type, ent.x, ent.y, ent.settings );
			}
			this.sortEntities();
			
			// Map Layer
			this.collisionMap = [];
			this.backgroundMaps = [];

			var firstchunk = this.levelchunks[0];
			var newMap = new ig.BackgroundMap(firstchunk.tilesize, firstchunk.data, firstchunk.tilesetName);
			newMap.name = 'level';
			newMap.repeat = 0;
			newMap.distance = 1;
			newMap.foreground = true;
			newMap.repeat = false;
			newMap.preRender = false;
			newMap.anims = {};
			this.backgroundMaps.push( newMap );

			this.collisionMap = new ig.CollisionMap(firstchunk.tilesize, firstchunk.collision )
			
			// Call post-init ready function on all entities
			for( var i = 0; i < this.entities.length; i++ ) {
				this.entities[i].ready();
			}
		},

		draw: function(){
			if( this.clearColor ) {
				ig.system.clear( this.clearColor );
			}
			if (this.backgroundImg) {
				this.backgroundImg.draw(0, 0);
			}
			
			// This is a bit of a circle jerk. Entities reference game._rscreen 
			// instead of game.screen when drawing themselfs in order to be 
			// "synchronized" to the rounded(?) screen position
			this._rscreen.x = ig.system.getDrawPos(this.screen.x)/ig.system.scale;
			this._rscreen.y = ig.system.getDrawPos(this.screen.y)/ig.system.scale;
			
			
			var mapIndex;
			for( mapIndex = 0; mapIndex < this.backgroundMaps.length; mapIndex++ ) {
				var map = this.backgroundMaps[mapIndex];
				if( map.foreground ) {
					// All foreground layers are drawn after the entities
					break;
				}
				map.setScreenPos( this.screen.x, this.screen.y );
				map.draw();
			}
			
			
			this.drawEntities();
			
			
			for( mapIndex; mapIndex < this.backgroundMaps.length; mapIndex++ ) {
				var map = this.backgroundMaps[mapIndex];
				map.setScreenPos( this.screen.x, this.screen.y );
				map.draw();
			}
		},		
  	});
});