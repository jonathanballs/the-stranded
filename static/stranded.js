//
// The Stranded - A zombie game...
//

//Variable declarations

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
var starArray = new Array();
var stars;
var velocity = 250;
var fireRate = 1000;
var nextFire = 0;
var gamestate = [];
var user_id;
var ggCounter = 0;
var ggLimit = 100;
var state = 
{
    x:300,
    y:300,
    rotation:0,
    skin:0
}
var player;
var cursors;
//Preloads(Sprites)
function preload() {
    game.load.spritesheet('pl1', '/static/assets/vector_characters.png',100,101,60);
    game.load.image('star', '/static/assets/star.png');
    game.load.image('floor', '/static/assets/grassBG.jpg');
    game.load.image('dessert', '/static/assets/PNG/tile_06.png');
    game.load.image('grass', '/static/assets/PNG/tile_03.png');
    game.load.image('bullet', '/static/assets/bullet.png');
}
//Creating
function create() {
    //CREATING FLOOR
    //game.add.sprite(0,0,'floor');
    var j = 0;
    while(j < 80)
    {
        var k = 0;
        while(k < 80)
        {
            game.add.sprite(30*k,30*j,matrixFloor(k,j));
            k++;
        }
        j++;
    }

    //creating player
    player = game.add.sprite(state.x, state.y, 'pl1');
    costume = Math.floor((Math.random() * 9) + 1);
    player.frame = (costume * 6) - 1;
    game.physics.arcade.enable(player);
    cursors = game.input.keyboard.createCursorKeys();
    player.anchor.setTo(0.5,0.5);
    state.skin = costume;

    //creating groups
    stars = game.add.group(); 
    Oplayer = game.add.group();
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    //adding WASD support
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);

    //Camera follow
    game.camera.follow(player);
    game.world.setBounds(0, 0, 1920, 1920);

    //creating objects
}

function update() {
    //makeStar(0,0);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    state.x = player.x;
    state.y = player.y;
    state.rotation = player.rotation;

    rotatePlayer();
    if (this.leftKey.isDown || cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -velocity;

        player.animations.play('left');
    }
    if (this.rightKey.isDown|| cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = velocity;

        player.animations.play('right');
    }
    if (this.upKey.isDown || cursors.up.isDown)
    {
        player.body.velocity.y = -velocity;
    }
    if (this.downKey.isDown || cursors.down.isDown)
    {
        player.body.velocity.y = velocity;
    }
    if (game.input.activePointer.isDown)
    {
       fire();
    } 

    //generate local instances of all players
    for(i=0; i <  gamestate.length; i++)
    {
        generate(i);
    }
    game.physics.arcade.overlap(bullets, Oplayer, killerino, this, this);
}
function killerino(killed)
{
    killed.kill();
    console.log('ez kill');
}
function matrixFloor(x,y)
{
    floor = [2,2,1,1,1,1,1,1,1,
             1,2,1,1,2,2,2,2,1,
             1,1,2,2,2,2,1,1,1,
             1,2,2,2,2,2,1,1,1];
    if (floor[(9*y+x)%floor.length] == 1)
    {
        return 'grass';
    }
    else
    {
        return 'dessert';
    }
}
function generate(localID)
{
    if(opExists(localID))
    {
        Oplayer.children[localID].x = gamestate[localID].x;
        Oplayer.children[localID].y = gamestate[localID].y;
        Oplayer.children[localID].rotation = gamestate[localID].rotation;
    }else{
        Oplayer.children[localID] =  createOPlayer(gamestate[localID].x,gamestate[localID],gamestate[localID].rotation,gamestate[localID].id,gamestate[localID].skin);
    }
}
function opExists(localID)
{
    if (Oplayer.children.length >  gamestate.length)
    {
        return true;
    }else{
        return false;
    }
}

function fire()
{
    if(game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;
        var bullet = bullets.getFirstDead();
        bullet.reset(player.x - 8, player.y - 8);
        game.physics.arcade.moveToPointer(bullet, 800); 
    }   
}

function killAllS()
{
    //console.log(stars.length);
    for (i = 0; i < stars.length; i++) {
        var tempStar = stars.getFirstAlive();

        if(tempStar)
        {
            tempStar.kill();
        }
    }
    
}

function makeStar(xCord, yCord)
{
    stars.create(xCord,yCord, 'star');
}

function rotatePlayer()
{
        var x2 , x1, y2, y1;
        x2 = game.input.worldX;
        x1 = state.x;
        y2 = game.input.worldY;
        y1 = state.y;

        player.rotation = Math.atan2((y2-y1),(x2-x1));
        //state.rotation = player.rotation;
}
//creates a new Oplayer
function createOPlayer(x,y,rot,id,skin)
{
    var temp = Oplayer.create(x,y,'pl1');
    temp.rotation = rot;
    temp.name = id;
    temp.anchor.setTo(0.5,0.5);
    if(skin == 11)
    {
        temp.frame = 25;
    }else
    {
    temp.frame = (skin*6)-1;
    }   
    return temp;
}
//create a new Oplayer by id on gamestate

function render() {
        //camera follow function debugging info
        //game.debug.cameraInfo(game.camera, 32, 32);
        //game.debug.spriteCoords(player, 32, 500); 
}
// Socket.io stuff
var socket = io();

socket.on('userid', function(data) {
    user_id = data.id;
});

socket.on('gamestate', function(data) {
    gamestate = data;
    for (var i = 0; i<gamestate.length; i++) {
        if (gamestate[i].id == user_id) {
            gamestate.splice(i, 1);
        }
    }
});

setInterval(function() {
    socket.emit('state', state);
}, 100);
