
# <a href="#Users">Users</a>

Global interface of all [User]s. It provides events when users are connected and disconnected.
## Functions
<a href="#get">get(id)</a> <code>User</code> | <code>null</code>

## Events
[connect](#Users+event_connect) (event)<br />
[disconnect](#Users+event_disconnect) (event)<br />

<a name="Users+event_connect"></a>
### (event) connect
Fired when new user has been connected.

## Properties

| Name | Type |
| --- | --- |
| user | <code>User</code> | 

<a name="Users+event_disconnect"></a>
### (event) disconnect
Fired when a user has been disconnected.

## Properties

| Name | Type |
| --- | --- |
| user | <code>User</code> | 

<a name="get"></a>
## get(id) ⇒ <code>User</code> \| <code>null</code>
Get user by ID


| Param | Type |
| --- | --- |
| id | <code>number</code> | 

[PlayNetwork]: ./PlayNetwork.md
[Player]: ./Player.md
[Room]: ./Room.md
[Rooms]: ./Rooms.md
[User]: ./User.md
[Users]: ./Users.md
