(function(){
	//Variables
	var list = document.getElementById("list"),
		inputTask = document.getElementById("inputId"),
		buttonTask = document.getElementById("buttonAdd");
	
	//Functions	
	var addTask = function(){
		var task = inputTask.value,	
			newTask = document.createElement("div"),
			link = document.createElement("p"),
			content = document.createTextNode(task);
		
		if (task === "") {//When the input is empty and you click add task
			inputTask.setAttribute("placeholder", "Agrega una tarea valida");
			inputTask.className = "error";
			return false;
		}
		 
		link.appendChild(content);//Add content to p
		newTask.appendChild(link);//Add p to div
		list.appendChild(newTask);//Add the new task
		 
		inputTask.value = "";
		//Delete elements 
		for (var i = 0; i <= list.children.length -1; i++) {
			list.children[i].addEventListener("click", function(){
			this.parentNode.removeChild(this);
			});
		}
	};
	//Create check function		
	var checkTask = function(){
		inputTask.className = "";
		inputTask.setAttribute("placeholder", "Agrega tu tarea");
	};

	buttonTask.addEventListener("click", addTask);//Add task
	inputTask.addEventListener("click", checkTask);//Check task
})();