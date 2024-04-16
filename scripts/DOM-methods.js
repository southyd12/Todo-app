export const createTodoHTML = ({ _id, title, duration, done } = {}) => {
  // Make the <li class="list-group-item">Title (duration)</li>
  const li = document.createElement("li");
  li.className = "todo list-group-item";
  if (done) {
    li.classList.add("done", "bg-success", "text-light");
  }

  // Make <span class="todo-title">Title</span>
  const titleSpan = document.createElement("span");
  titleSpan.className = "todo-title";
  titleSpan.textContent = title;
  li.append(titleSpan);

  // Make <span class="todo-title">Title</span>
  const durationSpan = document.createElement("span");
  durationSpan.className = "todo-duration";
  durationSpan.textContent = `(${duration})`;
  li.append(durationSpan);

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "controls";

  // Add a 'done' button <button class="done-btn" data-id="b5yfghg">Mark as done<button>
  const doneButton = document.createElement("button");
  doneButton.dataset.id = _id;
  doneButton.className = "done-btn btn btn-secondary";
  doneButton.textContent = `Mark as ${done ? "not" : ""}done`;
  controlsDiv.append(doneButton);

  li.append(controlsDiv);

  const updateButton = document.createElement("button");
  updateButton.dataset.id = _id;
  updateButton.className = "update-btn btn btn-warning";
  updateButton.ariaLabel = `Update ${title} todo`;
  // updateButton.textContent = `Update`;
  updateButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
  controlsDiv.append(updateButton);

  li.append(controlsDiv);

  const deleteButton = document.createElement("button");
  deleteButton.dataset.id = _id;
  deleteButton.className = "delete-btn btn btn-danger";
  // deleteButton.textContent = `Delete`;
  deleteButton.ariaLabel = `Delete ${title} todo`;
  deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
  controlsDiv.append(deleteButton);

  li.append(controlsDiv);

  return li;
};

const noItemsWarning = document.createElement("p");
noItemsWarning.textContent = `You don't have any todos left/yet`;

export const renderList = (
  listNode = document.body,
  data = [],
  htmlFn = createTodoHTML
) => {
  if (!data.length) {
    listNode.before(noItemsWarning);
    return listNode.replaceChildren();
  } else {
    noItemsWarning.remove();
  }

  // create docFrag
  const frag = document.createDocumentFragment();
  for (const item of data) {
    // 1. Create an <li>
    const li = htmlFn(item);
    // 2. Append it to the listNode
    frag.append(li);
  }
  listNode.replaceChildren(frag);
};

/* FORMS */
export function serialize(form) {
  // get most things
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // If you have checkboxes or selects in multiple mode
  const multis = Array.from(
    form.querySelectorAll(`select[multiple], [type="checkbox"]`)
  );
  const multiNames = Array.from(new Set(multis.map((input) => input.name)));
  // console.log("multis", multis);

  if (multis.length) {
    // Get full values for checkboxes & multi-selects
    for (const key in data) {
      if (data.hasOwnProperty(key) && multiNames.includes(key)) {
        const fullData = formData.getAll(key);
        if (fullData.length > 1) {
          data[key] = fullData;
        }
      }
    }
  }

  return data;
}

export function populate(form, data) {
  // { name: 'james' }
  // walk the object
  for (let [inputName, value] of Object.entries(data)) {
    // Make any bad values an empty string
    value ??= "";

    // try to find element in the form
    const element = form[inputName];

    // If we can't then bail
    if (!element || !element instanceof Element) {
      console.warn(`Could not find element ${inputName}: bailing...`);
      continue;
    }

    // see what type an element is to handle the process differently
    const type = element.type || element[0].type;

    switch (type) {
      case "checkbox": {
        // Here, value is an array of values to be spread across the checkboxes that make up this input. It's the value of the input as a whole, NOT the value of one checkbox.
        const values = Array.isArray(value) ? value : [value];

        for (const checkbox of element) {
          if (values.includes(checkbox.value)) {
            checkbox.checked = true;
          }
        }
        break;
      }
      case "select-multiple": {
        const values = Array.isArray(value) ? value : [value];

        for (const option of element) {
          if (values.includes(option.value)) {
            option.selected = true;
          }
        }
        break;
      }

      case "select":
      case "select-one":
        element.value = value.toString() || value;
        break;

      // case "time":
      // case "week":
      // case "datetime-local":
      case "date":
        element.value = new Date(value).toISOString().split("T")[0];
        break;

      default:
        element.value = value;
        break;
    }
  }
}
