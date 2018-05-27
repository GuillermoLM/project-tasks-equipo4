let fs = require('fs');

let removeTask = (req, res) => {
    let listId = req.params.listID;
    let taskIdToRemove = req.params.id;


    // Read file from fs
    fs.readFile('backend/board.json', 'utf-8', (e, file) => {
        let found = false;
        let board = JSON.parse(file);
        let lists = board.lists;
        // find listID
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].listId === listId) {
                for (let j = 0; j < lists[i].tasks.length; j++) {
                    if (lists[i].tasks[j].taskId === taskIdToRemove) {
                        lists[i].tasks.splice(j,1);
                        found = true;
                        break;
                    }
                    
                }
            }
            
        }
        // if listId not found reply with 404
        if (!found) {
            res.sendStatus(404);
            return;
        }
        // write the file back
        fs.writeFile('backend/board.json', JSON.stringify(board), (e) => {
            if (e) {
                // if any error saving the file respond with 500
                res.sendStatus(500);
                return
            }
            // if all ok respond with 200 (OK)
            res.sendStatus(200);
        })


    })
}
module.exports = removeTask;