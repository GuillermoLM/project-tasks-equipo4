let express = require('express');
let app = express();
var cors = require('cors');
let getAllBoard = require('./getAllBoard.js');
let saveNewTask = require('./saveNewTask.js');
let saveNewList = require('./saveNewList.js');
let bodyParser = require('body-parser')
// allow cross origin domain
app.use(cors());

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// setup endpoint for getting all the lists from the board 
app.get('/api/lists', getAllBoard);

// Endpoint for saving new tasks
app.post('/api/lists/:listID', saveNewTask)
// Endpoint for saving new lists
app.post('/api/lists', saveNewList)

// start server listening at port 3000
app.listen(3000, '127.0.0.1', () => {
    console.log('servidor levantado en el puerto 3000');
})