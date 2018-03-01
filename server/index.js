const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'),
      PATH_DIST_DASHBOARD = path.join(__dirname, '../dist/dashboard'),
      PATH_DIST_PUBLIC = path.join(__dirname, '../dist/public'),
      PORT = process.env.PORT || 3000,
      app = express()
      apiRouter = require('./apiRouter');


app.use(bodyParser.json()); // for parsing application/json
app.use('/admin', express.static(PATH_DIST_DASHBOARD));
app.use('/', express.static(PATH_DIST_PUBLIC));

app.use('/api', apiRouter);
// app.get('/admin/*', (req, res) => {
//   res.sendFile(path.join(PATH_DIST_DASHBOARD, 'index.html'));
// });

app.listen(PORT);
console.log('Express server running on port ' + PORT);