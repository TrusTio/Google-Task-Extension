async function getTaskLists(token) {
  const init = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(
    "https://tasks.googleapis.com/tasks/v1/users/@me/lists",
    init
  );
  return res.json();
}

async function getTasksFromList(token, listId, nextPageToken) {
  const init = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };
  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true&maxResults=100&pageToken=${
      nextPageToken || ""
    }`,
    init
  );
  return res.json();
}
