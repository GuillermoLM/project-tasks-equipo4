/*(function () {
	//Variables
	var list = document.getElementById("list"),
		inputTask = document.getElementById("inputId"),
		buttonTask = document.getElementById("buttonAdd");

	//Functions	
	var addTask = function () {
		var task = inputTask.value.trim(),
			newTask = document.createElement("div"),
			link = document.createElement("span"),
			btnX = document.createElement("button");
			content = document.createTextNode(task);
			txt = document.createTextNode("\u00D7");

		if (task === "") { //When the input is empty and you click add task
			inputTask.setAttribute("placeholder", "Agrega una tarea valida");
			inputTask.className = "error";
			return false;
		}

		link.className += "removeItem";

		btnX.appendChild(txt);
		link.appendChild(btnX);

		link.appendChild(content); //Add content to p
		newTask.appendChild(link); //Add p to div
		list.appendChild(newTask); //Add the new task


		//Call Delete element
		newTask.onclick = deleteItem;

		btnX.addEventListener("click", deleteItem);

		inputTask.value = "";
	};

	function deleteItem(e) {
		e.target.parentElement.removeChild(e.target.parent());
	}


	//Create check function		
	var checkTask = function () {
		inputTask.className = "";
		inputTask.setAttribute("placeholder", "Agrega tu tarea");
	};

	buttonTask.addEventListener("click", addTask); //Add task
	inputTask.addEventListener("click", checkTask); //Check task

	document.body.onkeyup = function (e) {
		if (e.keyCode == 13) {
			addTask();
		}
	}
})();*/


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

let addList = () => {
    let inputList = document.getElementsByClassName('inputNewList')[0];
    //Recoger el nombre de la lista
    let listName = inputList.value.trim();

    //Si no hay nombre no hagas nada
    if (listName === "") {
        console.error('no valid list name');
        return;
    }
    //Borrar el input
    inputList.value = '';
    paintList(listName);

}

let removeList = (e) => {
    e.target.parentNode.parentNode.parentNode.remove();
};

let addTask = (evento) => {
    let inputTask = evento.target.parentNode.children[0];
    //Recoger el nombre de la lista
    let taskName = inputTask.value.trim();

    let listNode = evento.target.parentNode.parentNode;

    //Si no hay nombre no hagas nada
    if (taskName === "") {
        console.error('no valid list name');
        return;
    }
    //Borrar el input
    inputTask.value = '';

    let newTask = {
        "taskId": createId('task'),
        "text": taskName,
        "completed": false,
        "color": "tomato"
    }

    let listId = listNode.dataset.listId;
    // save task to the backend before injecting a new node
    saveTask(newTask, listId)
        .then((response) => {
            // if the backend succeeds 

            // crear un node html
            let newTaskNode = createElementFromString(createTaskItemTemplate(taskText, newTask.taskId));

            // inyectar el node creado
            listNode.append(newTaskNode);
            // borrar el value;
            input.value = ''; // vanilla Js
        })
        .catch((e) => {
            // if the backend failed
            console.error('no se pudo guardar la tarea, inténtelo de nuevo:', e)
        })

    //Crear el nodo
    //let newTaskCreate = createElementFromString(createTaskItemTemplate(taskName));
    //Inyectarlo
    //let actualList = evento.target.parentNode.parentNode;
    //actualList.append(newTaskCreate);
    // add listener to remove it
    let removeTaskButtons = getEl('buttonDT')

    for (const element of removeTaskButtons) {
        element.addEventListener('click', removeTask)
    }
}

let removeTask = (a) => {
    a.target.parentNode.remove();
};

let paintTasks = (listNode, tasks) => {
    for (const task of tasks) {
        // crear un node html
        let newTaskNode = createElementFromString(createTaskItemTemplate(task.text, task.taskId));

        // inyectar el node creado
        listNode.appendChild(newTaskNode);
        newTaskNode.addEventListener('click', removeTask);
    }
}

let paintList = (listName) => {
    //Crear el nodo
    let listNode = createElementFromString(createListTemplete(listName));
    //Inyectarlo
    getEl('lists')[0].appendChild(listNode);
    // add listener to remove it
    listNode.querySelector('.buttonDL').addEventListener('click', removeList)
    listNode.querySelector('.buttonId').addEventListener('click', addTask)


    return listNode
}

let paintListsOnStart = (response) => {
    let lists = response.data.lists;
    for (const list of lists) {
        let listNode = paintList(list.name);
        paintTasks(listNode, list.tasks);
    }
}

let saveTask = function (task, listId) {
    // post new task the backend
    return axios.post(`http://127.0.0.1:3000/api/list/${listId}/${task.taskId}`, task)
}

let callBackOnDomReady = () => {
    let config = {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    // fetch saved lists from the backend
    axios.get('http://127.0.0.1:3000/api/lists', config).then(paintListsOnStart).catch(console.error);

    document.getElementsByClassName('addList')[0].addEventListener("click", addList);
    document.body.onkeyup = function (e) {
        if (e.keyCode == 13) {
            addList();
        }
    }
}

document.addEventListener('DOMContentLoaded', callBackOnDomReady);

function createElementFromString(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

function getEl(cssSelector) {
    return document.getElementsByClassName(cssSelector);
}



/*
let createId = (namespace) => `${namespace}-${Date.now()}-${Math.round(Math.random() * 100)}`
const SERVER_URI = `http://127.0.0.1:3000`;

let createListTemplate = (text, id) =>
    `
<div class="list" data-listId="${id}">
    <div class="listHeader">
    <h4>${text}
        <button>X</button>
    </h4>
        
    </div>
    <div class="addTask">
        <input type="text">
        <button>add task</button>
    </div>
</div>
`
let createTaskItemTemplate = (text, id) =>
    `
<div class="taskItem" data-taskId="${id}">
    <button>X</button>
    <div class="taskText">
        ${text}
    </div>
</div>
`
let addTask = function (evento) {
    let node = $(evento.target).parent()
    let listNode = node.parent();
    let input = node[0].children[0]; // vanilla Js
    let taskText = input.value.trim(); // vanilla Js
    // si no hay nombre no hagas nada
    if (taskText === '') {
        console.error('no valid task name');
        return;
    }
    let newTask = {
        "taskId": createId('task'),
        "text": taskText,
        "completed": false,
        "color": "tomato"
    }

    let listId = listNode[0].dataset.listid
    // save task to the backend before injecting a new node
    saveTask(newTask, listId)
        .then((response) => {
            // if the backend succeeds 

            // crear un node html
            let newTaskNode = $(createTaskItemTemplate(taskText, newTask.taskId));

            // inyectar el node creado
            listNode.append(newTaskNode);
            // borrar el value;
            input.value = ''; // vanilla Js
        })
        .catch((e) => {
            // if the backend failed
            console.error('no se pudo guardar la tarea, inténtelo de nuevo:', e)
        })



};
let removeTask = function () {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent();
    node.remove();

};


let saveList = (list) => 
{
    return axios.post(`${SERVER_URI}/api/lists`, newList);
}



let addList = (evento, listName, listID) => {
    if (!listName) {
        // recoger el nombre de la lista
        listName = $('.addList input').val().trim();

    }
    // si no hay nombre no hagas nada
    if (listName === '') {
        console.error('no valid list name')
        return;
    }

    let newList = {
        "listId": createId("list"),
        "name": listName,
        "tasks": []
    }

    saveList(newList).then((response)=>
    {
        console.log("list saved, response:", response);
        
        $('.addList input').val('')
        // crear el nodo
        let newList = $(createListTemplate(listName, listID));

        // inyectarlo
        $('.lists').append(newList);
        return newList;
    })
    .catch(() => 
    {
        console.error("list cant be saved, error:", error);
    });
};
let removeList = function (event) {
    // borra el nodo desde el que se haya llamado
    let node = $(this).parent().parent().parent();
    node.remove();

};
let paintTasks = (listNode, tasks) => {
    for (const task of tasks) {
        // crear un node html
        let newTaskNode = $(createTaskItemTemplate(task.text, task.taskId));

        // inyectar el node creado
        listNode.append(newTaskNode);
    }
}
let paintListsOnStart = (response) => {
    let lists = response.data.lists;
    for (const list of lists) {
        let listNode = addList({}, list.name, list.listId);
        paintTasks(listNode, list.tasks);
    }
}
let saveTask = function (task, listId) {
    // post new task the backend
    return axios.post(`${SERVER_URI}/api/list/${listId}/${task.taskId}`, newTask)
}

let callbackOnReady = () => {
    let config = {
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    // fetch saved lists from the backend
    axios.get('http://127.0.0.1:3000/api/lists', config).then(paintListsOnStart).catch(console.error)



    $('.addList button').on('click', addList);
    $('.lists').on('click', '.listHeader button', removeList);
    $('.lists').on('click', '.addTask button', addTask);
    $('.lists').on('click', '.taskItem button', removeTask);
}

$(document).ready(callbackOnReady);*/