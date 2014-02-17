Ext.override(Ext.data.JsonP, {
    request: function(options){
        options = Ext.apply({}, options);

        //<debug>
        if (!options.url) {
            Ext.Logger.error('A url must be specified for a JSONP request.');
        }
        //</debug>

        var me = this,
            disableCaching = Ext.isDefined(options.disableCaching) ? options.disableCaching : me.disableCaching,
            cacheParam = options.disableCachingParam || me.disableCachingParam,
            id = ++me.requestCount,
            callbackName = options.callbackName || 'callback' + id,
            callbackKey = options.callbackKey || me.callbackKey,
            timeout = Ext.isDefined(options.timeout) ? options.timeout : me.timeout,
            params = Ext.apply({}, options.params),
            url = options.url,
            name = Ext.isSandboxed ? Ext.getUniqueGlobalNamespace() : 'Ext',
            request,
            script;

        params[callbackKey] = name + '.data.JsonP.' + callbackName;
        if (disableCaching) {
            params[cacheParam] = new Date().getTime();
        }

        script = me.createScript(url, params, options);

        me.requests[id] = request = {
            url: url,
            params: params,
            script: script,
            id: id,
            scope: options.scope,
            success: options.success,
            failure: options.failure,
            callback: options.callback,
            callbackKey: callbackKey,
            callbackName: callbackName
        };

        if (timeout > 0) {
            request.timeout = setTimeout(Ext.bind(me.handleTimeout, me, [request]), timeout);
        }

        me.setupErrorHandling(request);
        me[callbackName] = Ext.bind(me.handleResponse, me, [request], true);
        me.loadScript(request);
        return request;
    }    
});