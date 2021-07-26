
var uid = new ShortUniqueId();
let TC = document.querySelector(".ticket-container");

displayTickets();
addQoute();

function displayTickets() {
    let allTasks = localStorage.getItem("allTasks");
    let list = ['pink', 'blue', 'green', 'yellow'];

    if (allTasks != null) {
        allTasks = JSON.parse(allTasks);
        for(let i = 0; i<list.length; i++){
            let prior = list[i];
            for (let task of allTasks) {
                if(task.priority == prior){
                    addTicketHelper(task.priority + "-color", task.priority, task.ticketId, task.task);
                }
                
            }
        }
    }

}

function addQoute() {
    let q = localStorage.getItem("qoute");
    if(q != null){
        q = JSON.parse(q);
        let qut = document.querySelector("#qut");
        qut.innerText = q;
    }
}

let filters = document.querySelectorAll(".filter-button");
for (let filter of filters) filter.addEventListener("click", addActiveclassToFilter);
function addActiveclassToFilter(e) {

    let target = e.currentTarget.classList;
    if (target.contains("active")) { target.remove("active"); }
    else {
        let prev = document.querySelector(".filter-button.active")
        if (prev != null)
            prev.classList.remove("active");
        target.add("active");
    }
    let tickets = document.querySelectorAll(".ticket");
    for (let t of tickets) t.remove();
    filterTickets();
}

function filterTickets() {
    let filter = document.querySelector(".filter-button.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));
    if (filter == null) { displayTickets(); return;}
    let priority = filter.classList[0].split("-")[0];
    allTasks = allTasks.filter(function (data, index) {
        return (data.priority == priority);
    })
    for (let task of allTasks) {
        addTicketHelper(task.priority + "-color", task.priority, task.ticketId, task.task);
    }
}

let deleteBttn = document.querySelector(".delete");
deleteBttn.addEventListener("click", function (e) {
    let tickets = document.querySelectorAll(".ticket.selected");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));
    for (let ticket of tickets) {
        let ticketId = ticket.children[1].innerText;
        allTasks = allTasks.filter(function (data, index) {
            return (ticketId != data.ticketId);
        })
        ticket.remove();
        localStorage.setItem("allTasks", JSON.stringify(allTasks));
    }
})
let modalPresent = false;
let addButton = document.querySelector(".add");
addButton.addEventListener("click", addModal);
function addModal(e) {
    if (!modalPresent) {
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" contenteditable="true" data-typed = "false">
        Enter task here. </div>
        <div class="task-filter-div">
            <span class="pink-color task-filter active"></span>
            <span class="blue-color task-filter"></span>
            <span class="green-color task-filter"></span>
            <span class="yellow-color task-filter"></span>
            <div class="close-button">x</div>
        </div>`;
        TC.appendChild(modal);
        modalPresent = true;
        let task = modal.children[0];
        task.addEventListener("click", removeText);
        let taskFilters = document.querySelectorAll(".task-filter");
        for (let value of taskFilters) {
            value.addEventListener("click", selectPriority.bind(this, modal.firstChild));
        }
        task.addEventListener("keypress", addTicket);
        document.querySelector(".close-button").addEventListener("click",function(e){
            document.querySelector(".modal").remove();
            modalPresent = false;
        })
    }
}
function selectPriority(task, e) {
    document.querySelector(".task-filter.active").classList.remove("active");
    e.currentTarget.classList.add("active");
    task.focus();
    task.click();
}
function removeText(e) {
    if (e.currentTarget.getAttribute("data-typed") == "false") {
        this.innerText = "";
        e.currentTarget.setAttribute("data-typed", "true");
    }
}
function addTicket(e) {
    let content = e.currentTarget.innerText.trim();
    let id = "#" + uid();
    let x = document.querySelector(".task-filter.active").classList[0];
    let color = x.split("-")[0];
    if (e.key == "Enter" && !e.shiftKey && content != "") {
        addTicketHelper(x, color, id, content);
        document.querySelector(".modal").remove();
        modalPresent = false;
        addDataToLocalStorage(id, content, color);
    } else if (e.key == "Enter" && !e.shiftKey && content == "") {
        e.preventDefault();
        alert("Error! Task is empty.");
    } else if (e.key == "~") {
        e.preventDefault();
        document.querySelector(".modal").remove();
        modalPresent = false;
    } else { return; }
    location.reload();
}
function addTicketselected(e) {
    let target = e.currentTarget.classList;
    if (target.contains("selected")) {
        target.remove("selected");
        target.remove(target[target.length - 1]);
    } else {
        target.add("selected");
        target.add(e.currentTarget.firstChild.classList[1].split("-")[0] + "-shadow");
    }
}
function addDataToLocalStorage(id, content, color) {
    let allTasks = localStorage.getItem("allTasks");
    if (allTasks == null) {
        let data = [{ "ticketId": id, "task": content, "priority": color }];
        localStorage.setItem("allTasks", JSON.stringify(data));
    } else {
        let data = JSON.parse(allTasks);
        data.push({ "ticketId": id, "task": content, "priority": color });
        localStorage.setItem("allTasks", JSON.stringify(data));
    }
}
function addTicketHelper(x, color, id, content) {
    let ticket = document.createElement("div");
    ticket.classList.add("ticket");
    ticket.innerHTML = `<div class="ticket-color"></div>
                            <div class="ticket-id">${id}</div>
                            <div class="ticket-content">${content}</div>
                            <div class="ticket-color-tag"></div>`;
    ticket.firstChild.classList.add(x);
    let borderClass = color + "-top-border";
    ticket.lastChild.classList.add(borderClass);
    TC.appendChild(ticket);
    ticket.addEventListener("click", addTicketselected);
}
let qut = document.querySelector("#qut");
qut.addEventListener("click",function(e){
    e.currentTarget.setAttribute("contenteditable","true");
    e.currentTarget.focus();
    e.currentTarget.innerText = "";
})


qut.addEventListener("keypress",function(e){
    if(e.key == "Enter"){
        e.currentTarget.setAttribute("contenteditable","false");
        e.currentTarget.blur();
        localStorage.setItem("qoute",JSON.stringify(e.currentTarget.innerText));
    }
})
    

