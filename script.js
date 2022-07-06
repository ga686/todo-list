//   localStorage
const todos = JSON.parse(localStorage.getItem("todos"));
let ta = $(".add-input");
// get textarea font-size
let taLineHeight = parseInt(ta.css("font-size").slice(0, 2));
// textarea rows
let totalRows = 3;
// textarea maxlength
let maxWidth = ta.attr("cols");
let maxLength = parseInt(ta.attr("cols") * totalRows);
ta.attr("maxlength", maxLength);
let checkbtn = `<label>
      <input type="checkbox" value="first_checkbox" class="check-hide"></input>
      <span class="add-check">
        <svg viewBox="0 0 512 512">
          <path d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z" />
        </svg>
      </span>
    </label>`;

ta.on("input keyup change", function (e) {
    let textareaLength = ta.val().length;
    let numberOfLines = Math.floor(textareaLength / maxWidth);
    let textareaVal = ta.val();
    let nodeSelectVal = $(".node-select").html();
    //   append item
    let addVal = `<li><div class="burger"><span></span><span></span><span></span></div>${checkbtn}<p>${textareaVal}</p><div class="node-select-item">${nodeSelectVal}</div></li>`;
    expandheight(numberOfLines);

    if (e.key == "Enter") {
        //     empty textarea
        ta.val("");
        //     add item
        $(".unfinished-list").append(addVal);
        //     remove lineheight class
        ta.removeClass("row-2 row-3");
        // check todos numbers
        if ($(".unfinished-list li").length > 0) {
            $(".edit-btn").addClass("active");
        }
        //   update localstorage
        updateLs();
    }
});

// check todos numbers
$(document).ready(function () {
    if ($(".unfinished-list li").length > 0) {
        $(".edit-btn").addClass("active");
    }
});

// expand textarea height
function expandheight(numberOfLines) {
    if (numberOfLines == 1) {
        ta.removeClass("row-2 row-3").addClass("row-2");
    } else if (numberOfLines >= 2) {
        ta.removeClass("row-2 row-3").addClass("row-3");
    } else {
        ta.removeClass("row-2 row-3");
    }
}
// dropdown button
$(".node-select").on("click", function (e) {
    e.preventDefault();
    $(".node-select-scroll").slideToggle();
});
$(".node-select-scroll li").on("click", function (e) {
    let newVal = $(e.target).html();
    $(".node-select").html(newVal);
    $(".node-select-scroll").slideUp();
    $(".node-select").removeClass("work busy home");
    if (newVal == "work") {
        $(".node-select").addClass("work");
    } else if (newVal == "busy") {
        $(".node-select").addClass("busy");
    } else if (newVal == "home") {
        $(".node-select").addClass("home");
    }
});

// input focus(checkbox confrim)

$(".unfinished-list").on("click", function (e) {
    if (e.target.type == "checkbox") {
        var target = e.target.closest("label");
        target.nextElementSibling.classList.toggle("slash");
        target.parentNode.classList.toggle("completed");
        updateLs();
    }
});

// edit
$(".edit-btn").on("click", function () {
    if ($(this).hasClass("active")) {
        $(".unfinished-list").toggleClass("edit");
        $(".unfinished-list li").find(".burger").toggleClass("active");

        $(".trash-box").toggleClass("active");

        if ($(".unfinished-list").hasClass("edit")) {
            $(".unfinished-list li").addClass("draggable").attr("draggable", "true");
            $(".add-input").attr("disabled", "disabled");
        } else {
            $(".unfinished-list li")
                .removeClass("draggable")
                .attr("draggable", "false");
            $(".add-input").removeAttr("disabled");
        }
    }

    // drag and drop
    let removeBtn = $(".remove-btn");

    function dragStart(e) {
        this.style.opacity = "0.4";
        dragSrcEl = this;
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", this.innerHTML);
    }

    function dragEnter(e) {
        this.classList.add("over");
    }

    function dragLeave(e) {
        e.stopPropagation();
        this.classList.remove("over");
    }

    function dragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        return false;
    }

    function dragDrop(e) {
        if (dragSrcEl != this && !this.classList.contains("trash-box")) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData("text/html");
        } else if (this.classList.contains("trash-box")) {
            dragSrcEl.remove();
            console.log($(".unfinished-list li").length);
            if ($(".unfinished-list li").length == 0) {
                $(".edit-btn").removeClass("active");
                $(".trash-box").removeClass("active");
                $(".add-input").removeAttr("disabled");
            }
        }
        return false;
    }

    function dragEnd(e) {
        var listItens = document.querySelectorAll(".draggable");
        [].forEach.call(listItens, function (item) {
            item.classList.remove("over");
        });

        this.style.opacity = "1";
    }

    function addEventsDragAndDrop(el) {
        el.addEventListener("dragstart", dragStart);
        el.addEventListener("dragenter", dragEnter);
        el.addEventListener("dragover", dragOver);
        el.addEventListener("dragleave", dragLeave);
        el.addEventListener("drop", dragDrop);
        el.addEventListener("dragend", dragEnd);
        updateLs();
    }
    var listItens = document.querySelectorAll(".draggable");
    [].forEach.call(listItens, function (item) {
        addEventsDragAndDrop(item);
    });
});

//   update localstorage

function updateLs() {
    const todosArr = [];
    let todoEl = document.querySelectorAll(".unfinished-list li");
    todoEl.forEach((todoEl) => {
        todosArr.push({
            content: todoEl.innerHTML,
            completed: todoEl.classList.contains("completed")
        });
    });
    localStorage.setItem("todos", JSON.stringify(todosArr));
    return todos;
}

if (todos) {
    for (let i = 0; i < todos.length; i++) {
        let element = document.createElement("li");
        element.innerHTML = todos[i]["content"];
        $(".unfinished-list").append(element);
    }
}
