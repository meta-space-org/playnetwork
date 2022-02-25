
<dl>
<dt><a href="#PlayNetwork">PlayNetwork</a></dt>
</dl>

Main interface of PlayNetwork, which provides access.
## Functions
<dl>
<dt><a href="#initialize">initialize(settings, server)</a></dt>
</dl>


## Properties

| Name | Type | Description |
| --- | --- | --- |
| users | <code>Users</code> | Interface with list of all [User](User)s. |
| rooms | <code>Rooms</code> |  |

<a name="initialize"></a>
## (async) initialize(settings, server)
Initialize PlayNetwork, by providing configuration parameters,Level Provider (to save/load hierarchy data) and HTTP(s) server handle.


| Param | Type | Description |
| --- | --- | --- |
| settings | <code>object</code> | Object with settings for initialization. |
| settings.levelProvider | <code>object</code> | Instance of level provider. |
| settings.scriptsPath | <code>string</code> | Relative path to script components. |
| settings.templatesPath | <code>string</code> | Relative path to templates. |
| server | <code>object</code> | instance of http server. |

[PlayNetwork]: ./PlayNetwork.md

[Player]: ./Player.md

[Room]: ./Room.md

[Rooms]: ./Rooms.md

[User]: ./User.md

[Users]: ./Users.md

