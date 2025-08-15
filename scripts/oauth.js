function getAuthToken() {
  try {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError || !token) {
          console.log("Token failed" + chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          console.log("Token fetched.");
          resolve(token);
        }
      });
    });
  } catch (err) {
    console.error("Error getting auth token: ", err);
    return null;
  }
}

// Test auth + API reqeusts + UI changes
/* 
window.onload = function () {
  document
    .querySelector("#getTasksButton")
    .addEventListener("click", function () {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        console.log(token);
        let init = {
          method: "GET",
          async: true,
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          contentType: "json",
        };
        fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", init)
          .then((response) => response.json())
          .then(function (data) {

            let nameDiv = document.querySelector("#listOfNames");

            //new
            let nameSelect = document.querySelector("#groupNames");

            let returnedGroupNames = data.items;
            console.log(returnedGroupNames);

            for (let i = 0; i < returnedGroupNames.length; i++) {
              let groupName = returnedGroupNames[i].title;
              let groupNameID = returnedGroupNames[i].id;
              console.log(groupName);

              //new
              let option = document.createElement("option");
              option.value = groupName;
              option.textContent = groupName;
              option.id = groupNameID;

              let button = document.createElement("button");

              button.id = groupNameID;
              button.textContent = groupName;

              button.addEventListener("click", function () {
                fetch(
                  `https://tasks.googleapis.com/tasks/v1/lists/${groupNameID}/tasks?showCompleted=true&showHidden=true&maxResults=100`,
                  init
                )
                  .then((response) => response.json())
                  .then(function (taskData) {
                    let returnedTasksList = taskData.items;
                    console.log(taskData);

                    let listOfTasksDiv = document.querySelector("#listOfTasks");
                    listOfTasksDiv.innerHTML = ""; // clear the container of previously selected tasks.

                    for (let i = 0; i < returnedTasksList.length; i++) {
                      let taskName = returnedTasksList[i].title;
                      let taskID = returnedTasksList[i].id;

                      let p = document.createElement("p");
                      p.textContent = taskName;
                      p.id = taskID;
                      p.classList.add("taskName");

                      listOfTasksDiv.appendChild(p);
                    }
                  });
              });

              nameDiv.appendChild(button);
              //new
              nameSelect.appendChild(option);
            }
          });
      });
    });
};
*/
