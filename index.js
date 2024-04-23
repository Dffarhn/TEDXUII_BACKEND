const express = require('express');
const { route } = require('./src/routes/route.js');
const { AccessApi } = require('./src/middleware/access_api.js');
const app = express();
const PORT = 3000;

app.use(express.json())

app.use(AccessApi)

app.use(route)



app.listen(PORT,() => {
    console.log('listening on port ' + PORT);
});

