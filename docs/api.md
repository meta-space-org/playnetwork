## Classes
<dl>
<dt><a href="#Room">Room</a></dt>
<dt><a href="#User">User</a> extends <code>pc.EventHandler</code></dt>
</dl>
## Members
<dl>
<dt><a href="#Levels">Levels</a></dt>
<dt><a href="#PlayCanvasNetwork">PlayCanvasNetwork</a> <code>pc.EventHandler</code></dt>
<dt><a href="#Player">Player</a></dt>
<dt><a href="#Rooms">Rooms</a></dt>
</dl>
## Typedefs
<dl>
<dt><a href="#callback">callback</a> <code>function</code></dt>
</dl>
<a name="Room"></a>

## Room
Room

<a name="User"></a>

## User *extends* <code>pc.EventHandler</code>
**Extends**: <code>pc.EventHandler</code>  

[.id](#User+id)<br />
[.players](#User+players)<br />
[.rooms](#User+rooms)<br />
[.getPlayerByRoom(roomId)](#User+getPlayerByRoom) ⇒<br />
[.setData(data)](#User+setData)<br />

<a name="User+id"></a>

### .id
Unique identifier

<a name="User+players"></a>

### .players
Players related to this user[Player](#Player)

<a name="User+rooms"></a>

### .rooms
Rooms where this user is connected

<a name="User+getPlayerByRoom"></a>

### .getPlayerByRoom(roomId) ⇒
Get the player by room id

**Returns**: [Player](#Player)  

| Param | Type |
| --- | --- |
| roomId | <code>Number</code> | 

<a name="User+setData"></a>

### .setData(data)
Set user's data


| Param | Type |
| --- | --- |
| data | <code>Object</code> | 

<a name="Levels"></a>

## Levels
Levels manager

<a name="Levels+save"></a>

### .save(sceneId, callback)
Save the scene to the server


| Param | Type |
| --- | --- |
| sceneId | <code>Number</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="PlayCanvasNetwork"></a>

## PlayCanvasNetwork ⇐ <code>pc.EventHandler</code>
PlayCanvas Network

**Extends**: <code>pc.EventHandler</code>  

[PlayCanvasNetwork](#PlayCanvasNetwork) ⇐ <code>pc.EventHandler</code><br />
[.user](#PlayCanvasNetwork+user) : [<code>User</code>](#User)<br />
[.rooms](#PlayCanvasNetwork+rooms) : [<code>Rooms</code>](#Rooms)<br />
[.levels](#PlayCanvasNetwork+levels) : [<code>Levels</code>](#Levels)<br />
[.players](#PlayCanvasNetwork+players) : <code>Map.&lt;number, Player&gt;</code><br />
[.templates](#PlayCanvasNetwork+templates) : <code>Templates</code><br />
[.connect()](#PlayCanvasNetwork+connect)<br />
[.send(name, data, callback)](#PlayCanvasNetwork+send)<br />

<a name="PlayCanvasNetwork+user"></a>

### .user : [<code>User</code>](#User)
User

<a name="PlayCanvasNetwork+rooms"></a>

### .rooms : [<code>Rooms</code>](#Rooms)
Rooms

<a name="PlayCanvasNetwork+levels"></a>

### .levels : [<code>Levels</code>](#Levels)
Levels manager

<a name="PlayCanvasNetwork+players"></a>

### .players : <code>Map.&lt;number, Player&gt;</code>
Acknowledged players

<a name="PlayCanvasNetwork+templates"></a>

### .templates : <code>Templates</code>
Templates

<a name="PlayCanvasNetwork+connect"></a>

### .connect()
Create websocket connection

<a name="PlayCanvasNetwork+send"></a>

### .send(name, data, callback)
Send message to server


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| data | <code>object</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Player"></a>

## Player
Player is a representation of room connection


[Player](#Player)<br />
[.id](#Player+id) : <code>number</code><br />
[.user](#Player+user) : [<code>User</code>](#User)<br />
[.room](#Player+room) : [<code>Room</code>](#Room)<br />
[.mine](#Player+mine) : <code>boolean</code><br />
[.send(name, data, callback)](#Player+send)<br />

<a name="Player+id"></a>

### .id : <code>number</code>
Id

<a name="Player+user"></a>

### .user : [<code>User</code>](#User)
User that owns this player

<a name="Player+room"></a>

### .room : [<code>Room</code>](#Room)
Room that this player is in

<a name="Player+mine"></a>

### .mine : <code>boolean</code>
Is this player mine

<a name="Player+send"></a>

### .send(name, data, callback)

| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| data | <code>object</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Rooms"></a>

## Rooms
Rooms

<a name="Rooms+create"></a>

### .create(levelId, tickrate, payload, callback)

| Param | Type |
| --- | --- |
| levelId | <code>number</code> | 
| tickrate | <code>number</code> | 
| payload | <code>object</code> \| <code>string</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="callback"></a>

## callback : <code>function</code>

| Param | Type |
| --- | --- |
| error | <code>string</code> | 
| data | <code>object</code> | 

