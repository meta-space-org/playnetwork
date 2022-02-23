<a name="PlayNetwork"></a>

## PlayNetwork ⇐ <code>pc.EventHandler</code>
Play Network

**Extends**: <code>pc.EventHandler</code>  
#### Properties:

| Name | Type |
| --- | --- |
| users | [<code>Users</code>](#Users) | 
| rooms | [<code>Rooms</code>](#Rooms) | 
| levels | [<code>Levels</code>](#Levels) | 
| players | [<code>Players</code>](#Players) | 


[PlayNetwork](#PlayNetwork) ⇐ <code>pc.EventHandler</code><br />
[.connect(callback)](#PlayNetwork+connect)<br />
[.send(name, data, callback)](#PlayNetwork+send)<br />

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

<a name="Player"></a>

## Player
TODO: Player is a representation of room connection

#### Properties:

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> |  |
| user | [<code>User</code>](#User) | that owns this player |
| room | [<code>Room</code>](#Room) | that this player is in |
| is | <code>boolean</code> | this player mine |


[Player](#Player)<br />
[.send(name, data, callback)](#Player+send)<br />
[destroy](#Player+event_destroy) (event)<br />

<a name="Player+send"></a>

### .send(name, data, callback)
TODO


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| data | <code>object</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Player+event_destroy"></a>

### (event) destroy
TODO

<a name="Players"></a>

## Players
TODO: Players collection


[Players](#Players)<br />
[.get(id)](#Players+get) ⇒ [<code>Player</code>](#Player) \| <code>null</code><br />
[.has(id)](#Players+has) ⇒ <code>boolean</code><br />

<a name="Players+get"></a>

### .get(id) ⇒ [<code>Player</code>](#Player) \| <code>null</code>
TODO: Get player by id


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Players+has"></a>

### .has(id) ⇒ <code>boolean</code>
TODO: Is player exist


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Room"></a>

## Room
TODO: Room

#### Properties:

| Name | Type | Description |
| --- | --- | --- |
| id | <code>number</code> | id |
| tickrate | <code>number</code> | tickrate |
| payload | <code>\*</code> | payload |
| players | [<code>Players</code>](#Players) | players |


[Room](#Room)<br />
[.send(name, data, callback)](#Room+send)<br />
[.leave(callback)](#Room+leave)<br />
[join](#Room+event_join) (event)<br />
[leave](#Room+event_leave) (event)<br />
[destroy](#Room+event_destroy) (event)<br />

<a name="Room+send"></a>

### .send(name, data, callback)
TODO: Send message to room


| Param | Type |
| --- | --- |
| name | <code>string</code> | 
| data | <code>\*</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Room+leave"></a>

### .leave(callback)
TODO: Leave room


| Param | Type |
| --- | --- |
| callback | [<code>callback</code>](#callback) | 

<a name="Room+event_join"></a>

### (event) join
TODO: Player join

#### Properties:

| Name | Type |
| --- | --- |
| player | [<code>Player</code>](#Player) | 

<a name="Room+event_leave"></a>

### (event) leave
TODO

#### Properties:

| Name | Type |
| --- | --- |
| player | [<code>Player</code>](#Player) | 

<a name="Room+event_destroy"></a>

### (event) destroy
TODO

<a name="Rooms"></a>

## Rooms
TODO: Rooms


[Rooms](#Rooms)<br />
[.create(levelId, tickrate, payload, callback)](#Rooms+create)<br />
[.join(roomId, callback)](#Rooms+join)<br />
[.leave(roomId, callback)](#Rooms+leave)<br />
[.get(id)](#Rooms+get) ⇒ [<code>Room</code>](#Room)<br />
[.has(id)](#Rooms+has) ⇒ <code>boolean</code><br />
[join](#Rooms+event_join) (event)<br />
[leave](#Rooms+event_leave) (event)<br />

<a name="Rooms+create"></a>

### .create(levelId, tickrate, payload, callback)
TODO: Create room


| Param | Type |
| --- | --- |
| levelId | <code>number</code> | 
| tickrate | <code>number</code> | 
| payload | <code>\*</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Rooms+join"></a>

### .join(roomId, callback)
TODO: Join room


| Param | Type |
| --- | --- |
| roomId | <code>number</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Rooms+leave"></a>

### .leave(roomId, callback)
TODO: Leave room


| Param | Type |
| --- | --- |
| roomId | <code>number</code> | 
| callback | [<code>callback</code>](#callback) | 

<a name="Rooms+get"></a>

### .get(id) ⇒ [<code>Room</code>](#Room)
TODO: Get room


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Rooms+has"></a>

### .has(id) ⇒ <code>boolean</code>
TODO: Has room


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

<a name="Rooms+event_join"></a>

### (event) join
TODO: Player join in room

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="Rooms+event_leave"></a>

### (event) leave
TODO: Player leave from room

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="User"></a>

## User
TODO: USER

#### Properties:

| Name | Type |
| --- | --- |
| id | <code>number</code> | 
| players | [<code>Players</code>](#Players) | 
| rooms | <code>Map</code> | 
| mine | <code>boolean</code> | 


[User](#User)<br />
[.getPlayerByRoom(roomId)](#User+getPlayerByRoom) ⇒ [<code>Player</code>](#Player)<br />
[join](#User+event_join) (event)<br />
[leave](#User+event_leave) (event)<br />
[destroy](#User+event_destroy) (event)<br />

<a name="User+getPlayerByRoom"></a>

### .getPlayerByRoom(roomId) ⇒ [<code>Player</code>](#Player)
TODO


| Param | Type |
| --- | --- |
| roomId | <code>number</code> | 

<a name="User+event_join"></a>

### (event) join
TODO

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="User+event_leave"></a>

### (event) leave
TODO

#### Properties:

| Name | Type |
| --- | --- |
| room | [<code>Room</code>](#Room) | 
| player | [<code>Player</code>](#Player) | 

<a name="User+event_destroy"></a>

### (event) destroy
TODO

<a name="Users"></a>

## Users
TODO

#### Properties:

| Name | Type |
| --- | --- |
| me | [<code>User</code>](#User) | 


[Users](#Users)<br />
[.get(id)](#Users+get) ⇒ [<code>User</code>](#User) \| <code>null</code><br />
[.has(id)](#Users+has) ⇒ <code>boolean</code><br />

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

