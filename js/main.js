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

let createListTemplete = (text) =>
	`
	<div class="list">
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
let createTaskItemTemplate = (text) =>
	`
	<div class="taskItem">
		<button class="buttonDT">X</button>
		<div class="taskText">
			${text}
		</div>
	</div>
	`

let addList = () => 
{
	let inputList = document.getElementsByClassName('inputNewList')[0];
	//Recoger el nombre de la lista
	let listName = inputList.value.trim();

	//Si no hay nombre no hagas nada
	if (listName === "") 
	{
		console.error('no valid list name');
		return;
	}
	//Borrar el input
	inputList.value = '';
	//Crear el nodo
	let newList = createElementFromString(createListTemplete(listName));
	//Inyectarlo
	getEl('lists')[0].appendChild(newList);
	// add listener to remove it
	let removeListButtons = getEl('buttonDL')
	
	for (const el of removeListButtons) 
	{
		el.addEventListener('click', removeList)
	}
	let addTaskButtons = getEl('buttonId')
	
	for (const el of addTaskButtons) 
	{
		el.addEventListener('click', addTask)
	}
}

let removeList = (e) => 
{
	e.target.parentNode.parentNode.parentNode.remove();
};

let addTask = (evento) => 
{
	let inputTask = evento.target.parentNode.children[0];
	console.log(inputTask);
	//Recoger el nombre de la lista
	let taskName = inputTask.value.trim();

	//Si no hay nombre no hagas nada
	if (taskName === "") 
	{
		console.error('no valid list name');
		return;
	}
	//Borrar el input
	inputTask.value = '';
	//Crear el nodo
	let newTask = createElementFromString(createTaskItemTemplate(taskName));
	//Inyectarlo
	let actualList = evento.target.parentNode.parentNode;
	console.log(actualList);
	actualList.appendChild(newTask);
	// add listener to remove it
	let removeTaskButtons = getEl('buttonDT')
	
	for (const element of removeTaskButtons) 
	{
		element.addEventListener('click', removeTask)
	}
}

let removeTask = (a) =>
{
	a.target.parentNode.remove();
};

let callBackOn = () => 
{
	document.getElementsByClassName('addList')[0].addEventListener("click", addList);
}

document.addEventListener('DOMContentLoaded', callBackOn);

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

document.body.onkeyup = function (e) {
	if (e.keyCode == 13) {
		addList();
	}
}

let $ = document.querySelectorAll;
