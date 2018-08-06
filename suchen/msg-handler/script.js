var https = require("https");
new (require("eventsource"))("http://einbuchen-intern/events").addEventListener(
  "BuchEingebucht",
  e => {
    var book = JSON.parse(e.data);
    book.EventId = e.lastEventId;
    var bookAsString = JSON.stringify(book);
    let opts = {
      host: "elasticsearch-suchen",
      port: "9200",
      path: "/library/books/" + book.Isbn,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(bookAsString)
      }
    };
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let req = https.request(opts, res => {
      if (res.statusCode == 200) {
        console.log("inserted " + book.Isbn);
      } else {
        res.setEncoding("utf-8");
        res.on("data", console.error);
      }
    });
    req.write(bookAsString);
    req.end();
  }
);
