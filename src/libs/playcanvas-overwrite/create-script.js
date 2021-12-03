import { EventHandler, ScriptAttributes, ScriptHandler, ScriptType } from 'playcanvas';
import AppHandler from '../../core/app-handler.js';

export default function() {
    pc.createScript = function(name) {
        var scriptType = function (args) {
            EventHandler.prototype.initEventHandler.call(this);
            ScriptType.prototype.initScriptType.call(this, args);
        };

        scriptType.prototype = Object.create(ScriptType.prototype);
        scriptType.prototype.constructor = scriptType;

        scriptType.extend = ScriptType.extend;
        scriptType.attributes = new ScriptAttributes(scriptType);

        pc.registerScript(scriptType, name);
        return scriptType;
    }

    pc.registerScript = function(script, name) {
        if (typeof script !== 'function')
            throw new Error('script class: \'' + script + '\' must be a constructor function (i.e. class).');

        if (!(script.prototype instanceof ScriptType))
            throw new Error('script class: \'' + ScriptType.__getScriptName(script) + '\' does not extend pc.ScriptType.');

        name = name || script.__name || ScriptType.__getScriptName(script);

        script.__name = name;

        AppHandler.scripts.add(script);

        ScriptHandler._push(script);
    }
};