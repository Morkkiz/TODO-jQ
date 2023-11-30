$(document).ready(function () {
    const taskInput = $("#task");
    const addTaskButton = $("#add-task");
    const errorMessage = $("#error-message");
    const taskList = $(".task-list");
    const showAllButton = $("#show-all");
    const showActiveButton = $("#show-active");
    const showCompletedButton = $("#show-completed");

    let tasks = []; // Tyhjä lista

    // Piilota mahdollinen virheellinen syöte
    errorMessage.hide();

    // Lisää uusi tehtävä
    addTaskButton.on("click", () => {
        const taskText = taskInput.val().trim();

        if (taskText) {
            tasks.push({ text: taskText, completed: false });
            taskInput.val("");
            errorMessage.hide();
            updateTaskList();
            // Lisätään fadeIn-tehoste
            $(".task-item:last-child").hide().fadeIn();
        } else {
            errorMessage.show();
        }
    });

    // Poista tehtävä
    taskList.on("click", ".delete", (e) => {
        const index = $(e.target).data("index");
        tasks.splice(index, 1);
        updateTaskList();
        // Lisätään fadeOut-tehoste
        $(e.target).closest('.task-item').fadeOut();
    });

    // Merkitse tehtävä
    taskList.on("click", ".task-item span", function() {
        const index = $(this).parent().index();
        tasks[index].completed = !tasks[index].completed;
        updateTaskList();
    });

    // Hae tehtävät
    fetch('tasks.json')
        .then(response => response.json())
        .then(data => {
            tasks = data.tasks || [];
            updateTaskList();
        })
        .catch(error => console.error('Tehtävien haku epäonnistui', error));

    // Päivitä tehtävälista
    function updateTaskList() {
        taskList.html("");

        tasks.forEach((task, index) => {
            const taskItem = $("<div>").addClass("task-item");
            const taskText = $("<span>").text(task.text);
            const deleteButton = $("<button>").addClass("delete btn btn-danger").attr("data-index", index).text("Poista");

            taskItem.append(taskText);
            taskItem.append(deleteButton);

            if (task.completed) {
                taskText.css("text-decoration", "line-through");
            }

            taskList.append(taskItem);
        });

        updateTaskCount();
    }

    // Päivitä lukumäärä
    function updateTaskCount() {
        const activeTasks = tasks.filter((task) => !task.completed).length;
        const taskCount = tasks.length;

        showAllButton.text(`Näytä kaikki (${taskCount})`);
        showActiveButton.text(`Näytä aktiiviset (${activeTasks})`);
        showCompletedButton.text(`Näytä tehdyt (${taskCount - activeTasks})`);
    }
});
