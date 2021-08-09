const express = require("express");
const app = express();
const shopping_routes = require("./routes/shopping-list");
const helperClass = require("./routes/helper");


app.use(express.json());

app.use("/items", shopping_routes);


app.use(function(req, res, next) {

  return next(new helperClass.erroClass("Not Found", 404));

});
  
  
  app.use((err, req, res, next) => {

    res.status(err.status || 500);

    return res.json({

      error: err.message,
      status: err.status,

    });

  });


module.exports = app;
