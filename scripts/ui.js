let nextPageToken = null;

window.onload = async function () {
  const token = await getAuthToken();
  if (!token) {
    console.warn("No token, user might have denied permissions");
  }

  document
    .querySelector("#getTaskListsButton")
    .addEventListener("click", async () => {
      try {
        const taskListsData = await getTaskLists(token);

        renderTaskLists(taskListsData);
      } catch (err) {
        console.error("Error getting tasks: ", err);
      }
    });

  document.querySelector("#groupNames").addEventListener("change", async () => {
    console.log("Group changed");
    try {
      const listOfTasksDiv = document.querySelector("#listOfTasks");
      listOfTasksDiv.innerHTML = "";
      nextPageToken = null; // Reset pagination when changing groups

      let select = document.querySelector("#groupNames");
      let selectedListId = select.options[select.selectedIndex].id;

      const taskData = await getTasksFromList(token, selectedListId);
      if (taskData.nextPageToken) {
        nextPageToken = taskData.nextPageToken;
      }

      renderTasks(taskData);
    } catch (err) {
      console.error("Error getting tasks: ", err);
    }
  });

  document
    .querySelector("#loadMoreTasksButton")
    .addEventListener("click", async () => {
      try {
        let select = document.querySelector("#groupNames");
        let selectedListId = select.options[select.selectedIndex].id;

        const taskData = await getTasksFromList(token, selectedListId, nextPageToken);
        if (taskData.nextPageToken) {
          nextPageToken = taskData.nextPageToken;
        }

        renderTasks(taskData);
      } catch (err) {
        console.error("Error getting more tasks: ", err);
      }
    });
};

function renderTaskLists(taskLists) {
  const nameSelect = document.querySelector("#groupNames");
  nameSelect.innerHTML = "";

  taskLists.items.forEach((group) => {
    const option = document.createElement("option");
    option.value = group.title;
    option.textContent = group.title;
    option.id = group.id;
    nameSelect.append(option);
  });
  nameSelect.dispatchEvent(new Event("change"));
}

function renderTasks(tasks) {
  const listOfTasksDiv = document.querySelector("#listOfTasks");
  tasks.items.forEach((task) => {
    const p = document.createElement("p");
    p.textContent = task.title;
    p.id = task.id;
    p.classList.add("taskName");
    listOfTasksDiv.appendChild(p);
  });
}
