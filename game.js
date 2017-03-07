var game = new Phaser.Game(400,600,Phaser.AUTO);
var rocket;
var background;
var move;
var astroids;
var astroidrnd;
var timer;
var touch;
var bullets;
var bulletTime = 0;
var bullet;
var bulletDelay = true;
var nextShot;

var Preload =
{
	preload: function() {
        game.load.image('background','assets/test_background.png');
        game.load.image('rocket','assets/rocket.png');
        game.load.image('bullet','assets/bullet.png');
        game.load.image('astroid','assets/astroid.png');
        },
	create: function() {
		this.game.state.start("PlayGame");
	}
};

var PlayGame =
{
	create: function()
	{
        game.physics.startSystem(Phaser.Physics.ARCADE);
        background = game.add.tileSprite(0,0,400,600,'background');
        rocket = game.add.sprite(171,520,'rocket');
        rocket.anchor.setTo(0,0);
        
        astroids = game.add.group();
        game.time.events.loop(Phaser.Timer.SECOND*3, this.RandomAstroid, this);
        game.time.events.loop(Phaser.Timer.SECOND*2, this.RandomAstroid, this);
        
        game.physics.arcade.enable(rocket);
        
        game.input.onDown.add(moveIsTrue, this);
        
        game.input.onUp.add(moveIsFalse);
        
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;

        bullets.createMultiple(20, 'bullet');

        bullets.callAll('anchor.setTo','anchor',0.5,1.0);
        bullets.setAll('checkWorldBounds',true);
	},
	update: function()
	{
        if(move && game.input.activePointer.positionDown.y > 500)
        {
            console.log();
            Movement(touch);
        }
        else
        {
            move = false;
        }
		/*background.tilePosition.y += 4;*/
        if(!move && rocket.body.velocity.x != 0)
        {
            if(rocket.body.velocity.x < 0)
                {
                rocket.body.velocity.x += 10;
                }
            else if(rocket.body.velocity.x > 0)
                {
                    rocket.body.velocity.x -= 10;
                }
        }
        if(rocket.position.x == 0)
        {
            rocket.body.velocity.x = 0;    
        }
        if(rocket.position.x == 343)
        {
            rocket.body.velocity.x = 0;    
        }
        if(touch != null)
            {
        if(rocket.position.x+28 < touch.x+15 && rocket.position.x+28 > touch.x-15)
            {
                rocket.body.velocity.x = 0;
            }
            }
        if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && bulletDelay == true)
    	{
    		shootBullet();
        }
		},
      
	RandomAstroid: function(){
		/*TODO astroid out of bounds = dead*/
		randomX = game.rnd.integerInRange(-80,400);
		astroidrnd = astroids.create(randomX,-80,'astroid');
		astroidrnd.scale.setTo(game.rnd.realInRange(0.4,1.2))
		game.physics.arcade.enable(astroidrnd);
		astroidrnd.body.velocity.setTo(0,300);
	}
};

function shootBullet(){

		if(game.time.now >nextShot){
		bullet = game.add.sprite(rocket.position.x,rocket.position.y,'bullet');
		game.physics.arcade.enable(bullet);
		bullet.body.velocity.setTo(0,-300);
		}

		nextShot = game.time.now + 100;
	}

function moveIsTrue(pointer)
{
    move = true;
    touch = pointer;
}

function moveIsFalse()
{
    move = false;
}

function Movement(pointer)
{
            if(pointer.x > rocket.position.x+28)
                {
                    rocket.body.velocity.x = 250; 
                }
            else if(pointer.x < rocket.position.x+28)
                {
                    rocket.body.velocity.x = -250;
                }
}

game.state.add('Preload', Preload);
game.state.add('PlayGame',PlayGame);
game.state.start('Preload');