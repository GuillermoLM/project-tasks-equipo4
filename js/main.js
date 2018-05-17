(function () {
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
})();