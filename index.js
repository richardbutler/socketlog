var os      = require( "os" ),
    fs      = require( "fs" ),
    tim     = require( "tinytim" ).tim;

var HOST    = getHost(),
    PORT    = 8088,
    CHANNEL = "log";

var app     = require( "http" ).createServer( handler ),
    io      = require( "socket.io" ).listen( app ),
    log     = [];

function post( req, res ) {
    if ( req.method === "POST" ) {
        var body = "", data;

        req.on( "data", function( raw ) {
            body += raw;
        });

        req.on( "end", function() {
            data = body ? JSON.parse( body ) : null;

            logMessage( data );
        });
    }

    res.writeHead( 200 );
    res.end();
}

function handler( req, res ) {
    var url = req.url;

    if ( url === "/" ) {
        url = "/index.html";
    }

    res.setHeader( "Access-Control-Allow-Origin", "*" );
    res.setHeader( "Access-Control-Allow-Credentials", true );
    res.setHeader( "Access-Control-Allow-Headers", "Content-Type, Accept, Origin, X-XSRF-Token, X-Requested-With" );
    res.setHeader( "Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, HEAD, OPTIONS" );

    if ( url === "/post" ) {
        return post( req, res );
    }

    fs.readFile( __dirname + url,
        function ( err, data ) {
            data = tim( String( data ), {
                host: HOST,
                port: PORT,
                channel: CHANNEL
            });

            res.writeHead( 200 );
            res.end( data );
        });
}

io.sockets.on( "connection", function ( socket ) {
    log.forEach( function( log ) {
        socket.emit( CHANNEL, log );
    });

    socket.on( "log", function ( data ) {
        logMessage( data );
    });
});

function logMessage( data ) {
    var now = new Date();
    data.time = [ [ now.getHours(), now.getMinutes(), now.getSeconds() ].join( ":" ), now.getMilliseconds() ].join( "." );

    console.log( "RECV:", data );
    log.push( data );
    io.sockets.emit( CHANNEL, data );
}

function getHost() {
    var ifaces  = os.networkInterfaces(),
        host    = "localhost";

    for ( var dev in ifaces ) {
        var alias = 0;

        ifaces[ dev ].forEach( function ( details ) {
            if ( details.family == "IPv4" && dev === "en0" ) {
                host = details.address;
                alias++;
            }
        });
    }

    return host;
}

app.listen( PORT );
console.log( "Log server listening on " + HOST + " on port " + PORT );