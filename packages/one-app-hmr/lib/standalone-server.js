const express = require('express');

const app = express();

app.use('/', express.static(`${process.cwd()}/dist`));
app.use('/dist', express.static(`${process.cwd()}/dist`));

app.listen(3002);
