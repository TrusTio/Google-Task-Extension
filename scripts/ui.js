let nextPageToken = null;

window.onload = async function () {
  const token = await getAuthToken();
  if (!token) {
    console.warn("No token, user might have denied permissions");
  }

  // Fetch task lists when the button is clicked
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

  // Event listener for group selection change, update tasks display when group changes
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
        setButtonState("loadMoreTasksButton", false, "Load More Tasks");
        setButtonState("loadAllTasksButton", false, "No more tasks");
      } else {
        nextPageToken = null; // No more pages
        setButtonState("loadMoreTasksButton", true, "No more tasks");
        setButtonState("loadAllTasksButton", true, "No more tasks");
      }

      renderTasks(taskData);
    } catch (err) {
      console.error("Error getting tasks: ", err);
    }
  });

  // Load more tasks when button is clicked
  document
    .querySelector("#loadMoreTasksButton")
    .addEventListener("click", async () => {
      try {
        let select = document.querySelector("#groupNames");
        let selectedListId = select.options[select.selectedIndex].id;

        const taskData = await getTasksFromList(
          token,
          selectedListId,
          nextPageToken
        );

        if (taskData.nextPageToken) {
          nextPageToken = taskData.nextPageToken;
        } else {
          nextPageToken = null;
          setButtonState("loadMoreTasksButton", true, "No more tasks");
        }

        renderTasks(taskData);
      } catch (err) {
        console.error("Error getting more tasks: ", err);
      }
    });

  // Load all tasks when button is clicked
  document
    .querySelector("#loadAllTasksButton")
    .addEventListener("click", async () => {
      loadAllTasks(token).catch((err) => {
        console.error("Error loading all tasks: ", err);
      });
    });

  document
    .querySelector("#groupedTaskFilter")
    .addEventListener("change", async () => {
      console.log("Grouped task filter changed");
      try {
        const listOfTasksDiv = document.querySelector("#groupedTasksList");
        listOfTasksDiv.innerHTML = "";
        nextPageToken = null; // Reset pagination when changing groups

        let select = document.querySelector("#groupNames");
        let selectedListId = select.options[select.selectedIndex].id;

        let selectedFilter = document.querySelector("#groupedTaskFilter");
        let selectedFilterId =
          selectedFilter.options[selectedFilter.selectedIndex].id;

        const today = new Date();
        const todayISOString = today.toISOString();

        //TODO: needs to be fixed, the parameters are not being passed correctly
        switch (selectedFilterId) {
          case "groupedtaskFilter7d":
            loadTasksForTimeRange(
              token,
              selectedListId,
              daysAgo(7).toISOString(),
              todayISOString
            );
            break;
          case "groupedtaskFilter30d":
            loadTasksForTimeRange(
              token,
              selectedListId,
              daysAgo(30).toISOString(),
              todayISOString
            );
            break;
          case "groupedtaskFilter90d":
            loadTasksForTimeRange(
              token,
              selectedListId,
              daysAgo(90).toISOString(),
              todayISOString
            );
            break;
          case "groupedtaskFilter7d":
            loadTasksForTimeRange(
              token,
              selectedListId,
              yearsAgo(1).toISOString(),
              todayISOString
            );
            break;
        }
      } catch (err) {
        console.error("Error getting tasks: ", err);
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
  updateTaskCount();
}

function renderGroupedTasks(tasks) {
  const listofGroupedTasksDiv = document.querySelector("#groupedTasksList");
  const groupedTasks = groupTasksByName(tasks);
  groupedTasks.forEach((count, name) => {
    const p = document.createElement("p");
    p.textContent = name + " (" + count + ")";
    p.classList.add("taskName");
    listofGroupedTasksDiv.appendChild(p);
  });
}

// Loads and renders all tasks from the selected list, handling pagination
async function loadAllTasks(token) {
  let select = document.querySelector("#groupNames");
  let selectedListId = select.options[select.selectedIndex].id;
  do {
    const data = await await getTasksFromList(token, selectedListId, {
      nextPageToken,
    });
    renderTasks(data || []);
    await new Promise(requestAnimationFrame);

    nextPageToken = data.nextPageToken || null;
  } while (nextPageToken);
}

async function loadTasksForTimeRange(
  token,
  selectedListId,
  completedMin,
  completedMax
) {
  let allTasks = [];
  let nextPageToken = null; // Reset pagination for new time range
  do {
    const data = await getTasksFromList(token, selectedListId, {
      nextPageToken: nextPageToken,
      completedMin: completedMin,
      completedMax: completedMax,
    });

    if (data.items && data.items.length > 0) {
      allTasks.push(...data.items);
    }

    console.log(data);
    nextPageToken = data.nextPageToken || null;
  } while (nextPageToken);

  console.log(
    "All task titles:",
    allTasks.map((t) => t.title)
  );
  renderGroupedTasks(allTasks);
}

function updateTaskCount() {
  const taskCount = document.querySelector("#taskCount");
  const listOfTasksDiv = document.querySelector("#listOfTasks");
  taskCount.textContent = `(${listOfTasksDiv.children.length})`;
}
