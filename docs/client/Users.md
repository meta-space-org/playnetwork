# Users

Interface to access all known [User]s as well as own user (`me`).

---

# Index

### Properties

<a href='#property_me'>.me</a> : [User]  


### Functions

<a href='#function_get'>get(id)</a> => [User] &#124; `null`  
<a href='#function_has'>has(id)</a> => `boolean`  


---


# Properties

<a name='property_me'></a>
### <a href='#property_me'>.me</a> : [User]  
[User] object that belongs to our current session.


# Functions

<a name='function_get'></a>
### <a href='#function_get'>get(id)</a>  
  
**Returns:** [User] | `null`  
Get [User] by ID.

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [User]. |  


<a name='function_has'></a>
### <a href='#function_has'>has(id)</a>  
  
**Returns:** `boolean`  
Check if [User] is known.

| Param | Type | Description |
| --- | --- | --- |
| id | `number` | ID of a [User]. |  



[User]: ./User.md  
