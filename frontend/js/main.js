
let createId = (namespace) => `${namespace}-${Date.now()}-${Math.round(Math.random() * 100)}`

let createListTemplete = (text, id) =>
    `
	<div class="list" data-listId="${id}">
		<div class="listHeader">
		<h4>${text}
			<button class="buttonDL">X</button>
		</h4>
			
		</div>
		<div class="addTask">
			<input class="inputNewTask" type="text">
			<button class="buttonId">add Task</button>
		</div>
	</div>
	`
let createTaskItemTemplate = (text, id) =>
    `
	<div class="taskItem" data-taskId="${id}">
		<button class="buttonDT">X</button>
		<div class="taskText">
			${text}
		</div>
	</div>
	`


let callBackOnDomReady = () => 
{
    let config = {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    // fetch saved lists from the backend
    axios.get('http://127.0.0.1:3000/api/lists', config).then(paintListsOnStart).catch(console.error);

    document.querySelector('.addList').addEventListener("click", addList);
    document.querySelector('.addList').onkeyup = function (e) {
        if (e.keyCode == 13) {
            addList();
        }
    }
    
    document.addEventListener('click', (e) => {
         if(e.target.matches('.buttonDT')) {
             removeTask(e)
         }
    });
}

document.addEventListener('DOMContentLoaded', callBackOnDomReady);


let paintListsOnStart = (response) => 
{
    let lists = response.data.lists;
    for (const list of lists) {
        let listNode = paintList(list.name, list.listId);
        paintTasks(listNode, list.tasks);
    }
}

let paintList = (listName, id) => 
{
    //Crear el nodo
    let listNode = createElementFromString(createListTemplete(listName, id));
    //Inyectarlo
    getEl('lists')[0].appendChild(listNode);
    // add listener to remove it
    listNode.querySelector('.buttonDL').addEventListener('click', removeList)
    listNode.querySelector('.buttonId').addEventListener('click', addTask)
    return listNode;
}

let saveList = function (list) 
{
    return axios.post(`http://127.0.0.1:3000/api/lists`, list);
}

let addList = () => 
{
    let inputList = document.getElementsByClassName('inputNewList')[0];
    //Recoger el nombre de la lista
    let listName = inputList.value.trim();

    //Si no hay nombre no hagas nada
    if (listName === "") {
        console.error('no valid list name');
        return;
    }
   
    let newList = {
        "listId": createId('list'),
        "name": listName,
        "tasks": []
    }
    
    saveList(newList)
    .then((response)=>
    {
        console.log("list saved, response:", response);
        inputList.value = '';
        paintList(newList.name,newList.listId);

    })
    .catch((error) => 
    {
        console.error("list cant be saved, error:", error);
    });
}

function createElementFromString(htmlString) 
{
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

function getEl(cssSelector) 
{
    return document.getElementsByClassName(cssSelector);
}

let removeList = (e) => 
{
    let listNode = e.target.parentNode.parentNode.parentNode;
    let listId = listNode.dataset.listid;
    axios.delete(`http://127.0.0.1:3000/api/lists/${listId}/`).then(()=>{

      listNode.remove();
    }).catch();
};

let addTask = (evento) => 
{
    let inputTask = evento.target.parentNode.children[0];
    //Recoger el nombre de la lista
    let taskName = inputTask.value.trim();
    let listNode = evento.target.parentNode.parentNode;

    //Si no hay nombre no hagas nada
    if (taskName === "") {
        console.error('no valid list name');
        return;
    }
   
    let newTask = {
        "taskId": createId('task'),
        "text": taskName,
        "completed": false,
        "color": "tomato"
    }

    let listId = listNode.dataset.listid;

    // save task to the backend before injecting a new node
    saveTask(newTask, listId)
        .then((response) => {
            // crear un node html
            let newTaskNode = createElementFromString(createTaskItemTemplate(newTask.text, newTask.taskId));
            // inyectar el node creado
            listNode.append(newTaskNode);
            // borrar el value;
            inputTask.value = ''; 
        })
        .catch((e) => {
            // if the backend failed
            console.error('no se pudo guardar la tarea, inténtelo de nuevo:', e)
        })
    // add listener to remove it
    let removeTaskButtons = getEl('buttonDT')

    for (const element of removeTaskButtons) {
        element.addEventListener('click', removeTask)
    }
}

let paintTasks = (listNode, tasks) => {

    for (const task of tasks) {
        // crear un node html
        let newTaskNode = createElementFromString(createTaskItemTemplate(task.text, task.taskId));
        // inyectar el node creado
        listNode.appendChild(newTaskNode);
        newTaskNode.addEventListener('click', removeTask);
    }
}

let removeTask = (e) =>
{
    let listNode = e.target.parentNode.parentNode;
    let taskNode = e.target.parentNode;
   
    let listId = listNode.dataset.listid;
    let taskId = taskNode.dataset.taskid;

    axios.delete(`http://127.0.0.1:3000/api/lists/${listId}/${taskId}`).then(() => {  
        taskNode.remove();
    }).catch(function (error) 
    {
        console.error('nose ha podido guardar')
    }
    );
};

let saveTask = function (task, listId) {
    return axios.post(`http://127.0.0.1:3000/api/lists/${listId}`, task);
}
