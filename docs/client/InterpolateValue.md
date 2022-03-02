# InterpolateValue

Helper class to interpolate values between states. It has mechanics to smoothen unreliable intervals of state and can interpolate simple values such as `number`, as well as complex: [pc.Vec2], [pc.Vec3], [pc.Vec4], [pc.Quat], [pc.Color].

---

# Index

### Properties

<a href='#property_value'>.value</a> : `number` &#124; [pc.Vec2] &#124; [pc.Vec3] &#124; [pc.Vec4] &#124; [pc.Quat] &#124; [pc.Color]  

### Constructor
<a href='#function_InterpolateValue'>new InterpolateValue(value)</a>  

### Functions

<a href='#function_set'>set(value)</a>  
<a href='#function_add'>add(value)</a>  
<a href='#function_update'>update(dt)</a>  


---


# Properties

<a name='property_value'></a>
### <a href='#property_value'>.value</a> : `number` &#124; [pc.Vec2] &#124; [pc.Vec3] &#124; [pc.Vec4] &#124; [pc.Quat] &#124; [pc.Color]  
Current Value, that it interpolated between states on every update.


# Constructor

<a name='function_InterpolateValue'></a>
### <a href='#function_InterpolateValue'>new InterpolateValue(value)</a>  


| Param | Type | Description |
| --- | --- | --- |
| value | `number` &#124; [pc.Vec2] &#124; [pc.Vec3] &#124; [pc.Vec4] &#124; [pc.Quat] &#124; [pc.Color] | Value to interpolate. Can be a simple `number`, as well as complex: [pc.Vec2], [pc.Vec3], [pc.Vec4], [pc.Quat], [pc.Color] object with `lerp` or `slerp`, `copy` and `clone` method. |  



# Functions

<a name='function_set'></a>
### <a href='#function_set'>set(value)</a>  

Force a value set, ignoring an interpolation.

| Param | Type |
| --- | --- |
| value | `number` &#124; [pc.Vec2] &#124; [pc.Vec3] &#124; [pc.Vec4] &#124; [pc.Quat] &#124; [pc.Color] |  


<a name='function_add'></a>
### <a href='#function_add'>add(value)</a>  

Add a value to list of interpolation states.

| Param | Type |
| --- | --- |
| value | `number` &#124; [pc.Vec2] &#124; [pc.Vec3] &#124; [pc.Vec4] &#124; [pc.Quat] &#124; [pc.Color] |  


<a name='function_update'></a>
### <a href='#function_update'>update(dt)</a>  

Call an update, with should be called at the application update interval. This will progress interpolation through states based on Delta Time.

| Param | Type | Description |
| --- | --- | --- |
| dt | `number` | Delta Time of an application update frequency. |  



[pc.Vec2]: https://developer.playcanvas.com/en/api/pc.Vec2.html  
[pc.Vec3]: https://developer.playcanvas.com/en/api/pc.Vec3.html  
[pc.Vec4]: https://developer.playcanvas.com/en/api/pc.Vec4.html  
[pc.Quat]: https://developer.playcanvas.com/en/api/pc.Quat.html  
[pc.Color]: https://developer.playcanvas.com/en/api/pc.Color.html  

