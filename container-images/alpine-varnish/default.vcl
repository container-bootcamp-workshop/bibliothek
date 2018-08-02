vcl 4.0;

backend default {
    .host = "localhost";
    .port = "80";
}

backend assets {
    .host = "assets";
    .port = "8080";
}

sub vcl_backend_response {
    set beresp.do_esi = true; // Do ESI processing
}

sub vcl_recv {
    if (req.http.host == "assets") {
        set req.backend_hint = assets;
    } else {
        set req.backend_hint = default;
    }
}