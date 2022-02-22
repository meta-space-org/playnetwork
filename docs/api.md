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

<a name="PlayNetwork"></a>

## PlayNetwork ⇐ <code>pc.EventHandler</code>
Play Network

**Extends**: <code>pc.EventHandler</code>  

[PlayNetwork](#PlayNetwork) ⇐ <code>pc.EventHandler</code><br />
[.users](#PlayNetwork+users) : [<code>Users</code>](#Users)<br />
[.rooms](#PlayNetwork+rooms) : [<code>Rooms</code>](#Rooms)<br />
[.levels](#PlayNetwork+levels) : [<code>Levels</code>](#Levels)<br />
[.players](#PlayNetwork+players) : [<code>Players</code>](#Players)<br />
[.connect(callback)](#PlayNetwork+connect)<br />
[.send(name, data, callback)](#PlayNetwork+send)<br />

<a name="PlayNetwork+users"></a>

### .users : [<code>Users</code>](#Users)
User

<a name="PlayNetwork+rooms"></a>

### .rooms : [<code>Rooms</code>](#Rooms)
Rooms

<a name="PlayNetwork+levels"></a>

### .levels : [<code>Levels</code>](#Levels)
Levels manager

<a name="PlayNetwork+players"></a>

### .players : [<code>Players</code>](#Players)
Acknowledged players

<a name="PlayNetwork+connect"></a>

### .connect(callback)
Create websocket connection


| Param | Type |
| --- | --- |
| callback | [<code>connectCallback</code>](#connectCallback) | 

<a name="PlayNetwork+send"></a>

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
[destroy](#Player+event_destroy) (event)<br />

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

<a name="Player+event_destroy"></a>

### (event) destroy
Destroyed

<a name="Players"></a>

## Players
Players collection


[Players](#Players)<br />
[.get(id)](#Players+get) ⇒ [<code>Player</code>](#Player) \| <code>null</code><br />
[.has(id)](#Players+has) ⇒ <code>boolean</code><br />

<a name="Players+get"></a>

### .get(id) ⇒ [<code>Player</code>](#Player) \| <code>null</code>
Get player by id


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Players+has"></a>

### .has(id) ⇒ <code>boolean</code>
Is player exist


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Room"></a>

## Room
Room


[Room](#Room)<br />
[.id](#Room+id) : <code>number</code><br />
[.tickrate](#Room+tickrate) : <code>number</code><br />
[.payload](#Room+payload) : <code>\*</code><br />
[.send(name, data, callback)](#Room+send)<br />
[.leave(callback)](#Room+leave)<br />
[join](#Room+event_join) (event)<br />
[leave](#Room+event_leave) (event)<br />
[destroy](#Room+event_destroy) (event)<br />

<a name="Room+id"></a>

### .id : <code>number</code>
<a name="Room+tickrate"></a>

### .tickrate : <code>number</code>
<a name="Room+payload"></a>

### .payload : <code>\*</code>
<a name="Room+send"></a>

### .send(name, data, callback)
Send message to room


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| data | <code>\*</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Room+leave"></a>

### .leave(callback)
Leave room


| Param | Type |
| --- | --- |
| callback | [<code>callback</code>](#callback) | 

<a name="Room+event_join"></a>

### (event) join
Player join

#### Properties:

| Name | Type |
| --- | --- |
| player | [<code>Player</code>](#Player) | 

<a name="Room+event_leave"></a>

### (event) leave
Player leave

#### Properties:

| Name | Type |
| --- | --- |
| player | [<code>Player</code>](#Player) | 

<a name="Room+event_destroy"></a>

### (event) destroy
Destroyed

<a name="Rooms"></a>

## Rooms
Rooms


[Rooms](#Rooms)<br />
[.create(levelId, tickrate, payload, callback)](#Rooms+create)<br />
[.join(roomId, callback)](#Rooms+join)<br />
[.leave(roomId, callback)](#Rooms+leave)<br />
[.get(id)](#Rooms+get)<br />
[.has(id)](#Rooms+has)<br />
[join](#Rooms+event_join) (event)<br />
[leave](#Rooms+event_leave) (event)<br />

<a name="Rooms+create"></a>

### .create(levelId, tickrate, payload, callback)
Create room


| Param | Type |
| --- | --- |
| levelId | <code>number</code> | 
| tickrate | <code>number</code> | 
| payload | <code>\*</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Rooms+join"></a>

### .join(roomId, callback)
Join room


| Param | Type |
| --- | --- |
| roomId | <code>number</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Rooms+leave"></a>

### .leave(roomId, callback)
Leave room


| Param | Type |
| --- | --- |
| roomId | <code>number</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Rooms+get"></a>

### .get(id)
Get room


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Rooms+has"></a>

### .has(id)
Has room


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Rooms+event_join"></a>

### (event) join
Player join in room

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="Rooms+event_leave"></a>

### (event) leave
Player leave from room

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="User"></a>

## User ⇐ <code>pc.EventHandler</code>
**Extends**: <code>pc.EventHandler</code>  

[User](#User) ⇐ <code>pc.EventHandler</code><br />
[.id](#User+id)<br />
[.players](#User+players)<br />
[.rooms](#User+rooms)<br />
[.getPlayerByRoom(roomId)](#User+getPlayerByRoom) ⇒<br />
[.setData(data)](#User+setData)<br />
[join](#User+event_join) (event)<br />
[leave](#User+event_leave) (event)<br />
[destroy](#User+event_destroy) (event)<br />

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

<a name="User+event_join"></a>

### (event) join
User join to room

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="User+event_leave"></a>

### (event) leave
User leave from room

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="User+event_destroy"></a>

### (event) destroy
Destroyed

<a name="Users"></a>

## Users
Users


[Users](#Users)<br />
[.me](#Users+me)<br />
[.get(id)](#Users+get) ⇒ [<code>User</code>](#User) \| <code>null</code><br />
[.has(id)](#Users+has) ⇒ <code>boolean</code><br />

<a name="Users+me"></a>

### .me
My user

#### Properties:

| Name | Type |
| --- | --- |
| me | [<code>User</code>](#User) | 

<a name="Users+get"></a>

### .get(id) ⇒ [<code>User</code>](#User) \| <code>null</code>
Get user by id


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Users+has"></a>

### .has(id) ⇒ <code>boolean</code>
Is user exist


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="callback"></a>

## callback : <code>function</code>

| Param | Type |
| --- | --- |
| error | <code>string</code> | 
| data | <code>object</code> | 

<a name="connectCallback"></a>

## connectCallback : <code>function</code>

| Param | Type |
| --- | --- |
| user | [<code>User</code>](#User) | 

