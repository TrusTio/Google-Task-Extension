function setButtonState(buttonId, disabled, text) {
  const button = document.querySelector(`#${buttonId}`);
  if (!button) {
    console.warn(`Button with id ${buttonId} not found`);
    return;
  }
  button.disabled = disabled;
  button.textContent = text;
}

function daysAgo(n) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date;
}

function yearsAgo(n) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - n);
  return date;
}

function groupTasksByName(tasks) {

  const taskMap = new Map();

  tasks.forEach((task) => {
    console.log("Grouping task:", task.title, task.id);
    const name = task.title;
    if (taskMap.has(name)) {
      taskMap.set(name, taskMap.get(name) + 1);
    } else {
      taskMap.set(name, 1);
    }
  });

  return taskMap;
}
