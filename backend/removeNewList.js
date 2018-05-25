let fs = require('fs');

let removeList = (req, res) => {
    let listIdToDelete = req.params.id; //list-1527258663746-50

    // Read file from fs
    fs.readFile('backend/board.json', 'utf-8', (e, file) => {
        let board = JSON.parse(file);
        let lists = board.lists;
        let found = false;
        for (let i = 0; i < lists.length; i++) {
            if (lists[i].listId === listIdToDelete) {
                lists.splice(i,1);
                found = true;
                break;
            }        
        }
        if (!found) {
             res.sendStatus(404);
             return;  
        }

        // write the file back
        fs.writeFile('backend/board.json', JSON.stringify(board), (e) => {
            if (e) {
                // if any error saving the file respond with 500
                res.sendStatus(500);
                return;
            }
            // if all ok respond with 200 (OK)
            res.sendStatus(200);
        })
    })
}
module.exports = removeList;