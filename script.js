const input = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const todayTab = document.getElementById("todayTab");
const tomorrowTab = document.getElementById("tomorrowTab");


// Datum von heute bestimmen
function getToday() {
    const today = new Date();

    return today.getFullYear() + "-" +
           String(today.getMonth() + 1).padStart(2, "0") + "-" +
           String(today.getDate()).padStart(2, "0");
}


// Datum von morgen bestimmen
function getTomorrow() {
    const tomorrow = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);

    return tomorrow.getFullYear() + "-" +
           String(tomorrow.getMonth() + 1).padStart(2, "0") + "-" +
           String(tomorrow.getDate()).padStart(2, "0");
}


// Welchen Tag schauen wir gerade an?
let currentDay = getToday();


// Unsere Aufgaben
let tasks = [];


// Gespeicherte Aufgaben laden
const savedTasks = localStorage.getItem("tasks");

if (savedTasks !== null) {
    tasks = JSON.parse(savedTasks);
}


// Aufgabe hinzufügen
addButton.addEventListener("click", function() {

    const taskText = input.value;

    if (taskText === "") {
        return;
    }

    const task = {
        text: taskText,
        date: currentDay,
        completed: false
    };

    tasks.push(task);

    saveTasks();

    input.value = "";

    showTasks();
});

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addButton.click();
    }

});

// Zwischen Heute und Morgen wechseln
todayTab.addEventListener("click", function() {

    currentDay = getToday();

    todayTab.classList.add("active");
    tomorrowTab.classList.remove("active");

    showTasks();
});


tomorrowTab.addEventListener("click", function() {

    currentDay = getTomorrow();

    tomorrowTab.classList.add("active");
    todayTab.classList.remove("active");

    showTasks();
});

function deleteOldTasks() {

    const today = getToday();

    tasks = tasks.filter(function(task) {
        return task.date >= today;
    });

    saveTasks();
}

// Aufgaben anzeigen
function showTasks() {

    taskList.innerHTML = "";

    for (const task of tasks) {

        if (task.date !== currentDay) {
            continue;
        }

        const newTask = document.createElement("li");

     const checkbox = document.createElement("div");
     checkbox.classList.add("customCheckbox");

     if (task.completed) {
        checkbox.classList.add("checked");
    }

const text = document.createElement("span");
        text.textContent = task.text;

       if (task.completed) {
        newTask.classList.add("completed");
        }

        newTask.addEventListener("click", function() {

         task.completed = !task.completed;

         saveTasks();

         showTasks();
    });

        newTask.appendChild(checkbox);
        newTask.appendChild(text);

        taskList.appendChild(newTask);
    }
}

// Aufgaben speichern
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Alte Aufgaben löschen
deleteOldTasks();

// Aufgaben beim Start anzeigen
showTasks();

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("./service-worker.js");

}