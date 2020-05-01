//set to false to hide all console log messages on live environment
var debugMode = true;

var auth = { nc: 0, uri: '', method: 'POST', status: 0, scheme: 'Digest', secret: 'wcmServiceUser', headers: {} };
var _h;

function initiateService(ncValue, serviceUrl, methodType, statusValue, schemeValue, secretValue) {
    resetHeaders();
    auth.status = 0;
    auth.nc = ncValue;
    auth.uri = serviceUrl;
    auth.method = methodType;
    auth.status = statusValue;
    auth.scheme = schemeValue;
    auth.secret = secretValue;
}


function resetHeaders() {
    if (typeof (auth.headers) != "undefined") {
        delete auth.headers;
    }

    var ncx = '00000000' + ((++auth.nc) - 0).toString(16);
    ncx = ncx.substring(ncx.length - 8);

    auth.headers = {
        'uri': auth.uri,
        'nc': ncx,
        'cnonce': Math.random(),
        'username': 'wcmServiceUser',
        'algorithm': 'MD5'
    };
}

function digest(s) {
    var algorithm = eval(auth.headers.algorithm);
    if (typeof (algorithm) != 'function') {
        respond('Digest algorithm unavailable: ' + auth.headers.algorithm);
        return false;
    }
    return algorithm(s);
}

function buildResponseHash() {
    if(debugMode){
        console.log("build response hash", auth);
    }
    if (auth.headers.salt) {
        auth.secret = auth.secret + ':' + auth.headers.salt;
    }
    if (auth.headers.migrate) {
        auth.secret = digest(auth.secret);
    }

    auth.secret = 'wcmServiceUser';
    //auth.headers.cnonce = digest(auth.headers.cnonce);
    //var A1 = digest(auth.headers.username + ':' + auth.headers.realm + ':' + auth.secret);
    var A1 = '12d3de30983b3021637d4206bd0ab113';
    var A2 = digest(auth.method + ':' + auth.headers.uri);
    var R = digest(A1 + ':'
        + auth.headers.nonce + ':'
        + auth.headers.nc + ':'
        + auth.headers.cnonce + ':'
        + auth.headers.qop + ':'
        + A2);

    if(debugMode){
        console.log("hash: ", 'REQUEST: ('
            + '( ' + auth.headers.username + ':'
            + auth.headers.realm + ':' + auth.secret
            + ') = A1:' + A1 + ':'
            + auth.headers.nonce + ':'
            + auth.headers.nc + ':'
            + auth.headers.cnonce + ':'
            + auth.headers.qop + ':'
            + A2 + ' =(' + auth.method + ' : ' + auth.headers.uri + ')'
            + ' = R:' + R);
    }



    delete auth.secret;
    delete auth.headers.salt;

    return R;
}

function buildAuthenticationRequest() {

    var request = auth.scheme;
    delete auth.scheme;

    var comma = ' ';
    for (name in auth.headers) {

        //  var escaped = escape(auth.headers[name]);
        var escaped = auth.headers[name];
        request += comma + name + '="' + escaped + '"';
        comma = ',';
    }

    // don't continue further if there is no algorithm yet.
    if (typeof (auth.headers.algorithm) == 'undefined') {
        console.log("algorithm is not there");
        return request;
    }

    var r = buildResponseHash();
    if (r) {
        request += comma + 'response="' + escape(r) + '"';
        return request;
    }

    return false;
}


function parseAuthenticationResponse(h) {
    var scre = /^\w+/;
    var scheme = scre.exec(h);
    auth.scheme = scheme[0];
    auth.headers.uri = auth.uri;
    var nvre = /(\w+)=['"]([^'"]+)['"]/g;
    var pairs = h.match(nvre);

    var vre = /(\w+)=['"]([^'"]+)['"]/;
    var i = 0;
    for (; i < pairs.length; i++) {
        var v = vre.exec(pairs[i]);

        if (v) {
            // global headers object
            auth.headers[v[1]] = v[2];

        }
    }
}

function callJsonService(jsonData, callbackfunctionname) {
    if(debugMode){
        if (auth.uri == null) { console.log("auth.uri is null : " + auth.uri); }
    }
    $.ajax({
        url: auth.uri,
        cache: false,
        type: auth.method,
        dataType: 'json',
        contentType: "application/json",
        data: jsonData,
        beforeSend: function (client) {
            if(debugMode){
                console.log("beforeSend callback");
            }

            //Digest Only
            if(auth.scheme == 'Digest'){
                if (_h != null) { parseAuthenticationResponse(_h); }
                var h = buildAuthenticationRequest();

                if (h) {
                    client.setRequestHeader('Authorization', h);
                    return true;
                } else {
                    return false;
                }
            } else if( auth.scheme == 'Basic'){
                client.setRequestHeader('Authorization', "Basic ZXB1Ymxpc2h1c2VyOmVwdWJsaXNocGFzc3dvcmQ=");
                return true;
            }
        },

        success: function (result) {
            if(debugMode){
                console.log("success callback", result);
            }
            auth.status = 0;
            resetHeaders();
            if (callbackfunctionname != null) callbackfunctionname(result);
        },

        complete: function (result) {
            if(debugMode){
                console.log("complete callback", result.status);
            }
            switch (result.status) {
                case 401: //to avoid browser login pop up
                    if (auth.status != 401) {
                        var h = result.getResponseHeader('ePublish-Authenticate');
                        parseAuthenticationResponse(h);
                        _h = h;
                        if(debugMode){
                            console.log("after parsing", auth.headers);
                        }
                        auth.status = 401;
                        callJsonService(jsonData, callbackfunctionname);
                    }
                    break;
            }
        }
    });
}

function callSynchronousJsonService(jsonData, callbackfunctionname) {
    $.ajax({
        url: auth.uri,
        cache: false,
        type: auth.method,
        dataType: 'json',
        contentType: "application/json",
        data: jsonData,
        async: false,

        beforeSend: function (client) {
            if(debugMode){
                console.log("beforeSend synchronous callback");
            }

            //Only for Digest
            if(auth.scheme == 'Digest'){
                if (_h != null) { parseAuthenticationResponse(_h); }
                var h = buildAuthenticationRequest();

                if (h) {
                    client.setRequestHeader('Authorization', h);
                    return true;
                } else {
                    return false;
                }
            } else if( auth.scheme == 'Basic'){
                client.setRequestHeader('Authorization', "Basic ZXB1Ymxpc2h1c2VyOmVwdWJsaXNocGFzc3dvcmQ=");
                return true;
            }
        },

        success: function (result) {
            if(debugMode){
                console.log("success synchronous callback", result);
            }
            auth.status = 0;
            resetHeaders();
            if (callbackfunctionname != null)
                callbackfunctionname(result);
        },

        complete: function (result) {
            if(debugMode){
                console.log("complete synchronous callback", result.status);
            }
            switch (result.status) {
                case 401: //to avoid browser login pop up
                    if (auth.status != 401) {
                        var h = result.getResponseHeader('ePublish-Authenticate');
                        parseAuthenticationResponse(h);
                        _h = h;
                        if(debugMode){
                            console.log("after parsing", auth.headers);
                        }
                        auth.status = 401;
                        callSynchronousJsonService(jsonData, callbackfunctionname);
                    }
                    break;
            }
        }
    });
}