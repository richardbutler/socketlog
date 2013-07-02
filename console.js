(function() {
    "use strict";

    var CHANNEL             = "{{ channel }}",
        URL                 = "http://{{ host }}:{{ port }}",
        SUPPORTS_WEBSOCKETS = typeof WebSocket !== "undefined" && !/Android/.test( navigator.userAgent );

    window.console = (function() {
        var emit;

        if ( SUPPORTS_WEBSOCKETS ) {
            var socket;

            loadScript( URL + "/socket.io/socket.io.js", function() {
                socket = io.connect( URL );
                socket.on( "connect", connected );
            });

            emit = function( args, level ) {
                args = args.length > 1 ? args : args[ 0 ];

                socket.emit( CHANNEL, toPacket( args, level ) );
            };
        } else {
            emit = function( args, level ) {
                var xhr = new XMLHttpRequest();
                xhr.open( "POST", URL + "/post", true );
                xhr.setRequestHeader( "Content-Type", "application/json" );
                xhr.send( JSON.stringify( toPacket( args, level ) ) );
            };

            connected();
        }

        function connected() {
            emit([ "Client connected", navigator.userAgent ], "log" );
        }

        function toPacket( args, level ) {
            return {
                level: level || "log",
                message: args
            };
        }

        function log( level ) {
            return function() {
                emit( Array.prototype.slice.apply( arguments ), level );
            };
        }

        return {
            log: log( "log" ),
            error: log( "error" ),
            debug: log( "debug" )
        };
    })();

    function loadScript( url, callback ) {
        var script = document.createElement( "script" );
        script.onload = function() {
            if ( typeof callback === "function" ) {
                callback();
            }
        };
        script.type = "text/javascript";
        script.async = true;
        script.src = url;
        document.head.appendChild( script );
    }

})();