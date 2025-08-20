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

async function getTasksFromList(token, listId, options = {}) {
  const {
    nextPageToken = "",
    showCompleted = true,
    showHidden = true,
    maxResults = 100,
    completedMin, // optional ISO string
    completedMax, // optional ISO string
  } = options;

  const params = new URLSearchParams({
    showCompleted,
    showHidden,
    maxResults,
    pageToken: nextPageToken || "",
  });

  if (completedMin) params.append("completedMin", completedMin);
  if (completedMax) params.append("completedMax", completedMax);

  const init = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const res = await fetch(
    `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?${params.toString()}`,
    init
  );

  return res.json();
}
