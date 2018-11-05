var count = 0, count_items_left = 0, isVisible = false; // footer
var tab = 'all' /*all, active, completed */, task = [];

window.onload = function (ev) {
    document.getElementById('footer').classList.add("v-hidden");
    document.getElementById("newtask").addEventListener("keypress", function(event) {
        if (event.keyCode == 13) {
            if(document.getElementById('newtask').value !== ''){
                setInfo();
                count_items_left++;
                checkItemsLeft();
            }
        }
    });

    document.getElementById('all').onclick = function (ev2) {
        reloadAllTask('content');
        changeBorder('all');
    };

    document.getElementById('active').onclick = function (ev2) {
        reloadAllDoingTask('content');
        changeBorder('active');
    };

    document.getElementById('completed').onclick = function (ev2) {
        reloadAllTaskIsDone('content');
        changeBorder('completed');
    };

    document.getElementById('changeall').onclick = function (ev2) {
        if(count_items_left === 0) {
            count_items_left = task.length;
            for(var i = 0 ; i < task.length; ++i){
                task[i].state = 'active'
            }
        } else {
            count_items_left = 0;
            for(var i = 0 ; i < task.length; ++i){
                task[i].state = 'completed'
            }
        }

        if(tab === 'all') reloadAllTask('content');
        else if(tab === 'active') reloadAllDoingTask('content');
        else if(tab === 'completed') reloadAllTaskIsDone('content');
    };
};

/**
 * this function sets info for new task is added
 */
function setInfo(){
    document.getElementById('content').appendChild(creatingNewElement());

    if(!isVisible) {
        isVisible = true;
        document.getElementById('footer').classList.remove('v-hidden');
    }

    count++;
    var new_task = {
        id: count,
        content: document.getElementById('newtask').value,
        state: 'active'
    };

    task.push(new_task);

    setNewIdForTask(count, new_task.content);

    document.getElementById('newtask').value = '';
}

/**
 * Get id of an task from id of div
 * @param id
 * @return {number}
 */
function getId(id){
    var a = id.split('_');
    return parseInt(a[0]);
}

/**
 * this function removes element in an specified array
 * @param id
 * @param array
 */
function removeAElement(array, id){
    for(var i = 0 ; i < array.length; ++i){
        if(array[i].id === id){
            array.splice(i, 1);
        }
    }
}

/**
 * This function removes a task with specified id
 * @param id
 */
function removeATask(id){
    var id_e = getId(id);

    removeAElement(task, id_e);
    // $('#' + id_e).remove();
    document.getElementById('#' + id_e).parentNode.removeChild(document.getElementById('#' + id_e));
}

/**
 * this function checks there are any items left or not
 */
function checkItemsLeft(){
    // if(count_items_left == 0){ $('.footer').hide(); }
    document.getElementById('count').innerText = count_items_left + ' items';
    // $('#count').text(count_items_left + ' items');
}

/**
 * this function returns a Task object contain { id, content, state }
 * @param id
 */
function getItem(id) { for(var i = 0 ; i < task.length; ++i) if(task[i].id === id) return task[i]; }

/**
 * this funtion will change the display of a task. if it is complete, the text will be seted line-through
 * @param id
 */
function changeStateOfTask(id){
    var item = getItem(id);
    if(item.state === 'active'){
        document.getElementById(id + '_doingtask').classList.add('f-s');
        document.getElementById(id + '_iconcheck_div').classList.remove('fc-gray');
        document.getElementById(id + '_iconcheck_div').classList.add('fc-green');
        item.state = 'completed';
        count_items_left--;
        checkItemsLeft();
    }
    else {
        document.getElementById(id + '_doingtask').classList.remove('f-s');
        document.getElementById(id + '_iconcheck_div').classList.remove('fc-green');
        document.getElementById(id + '_iconcheck_div').classList.add('fc-gray');
        item.state = 'active';
        count_items_left++;
        checkItemsLeft();
    }

    if(tab === 'all') reloadAllTask('content');
    else if(tab === 'active') reloadAllDoingTask('content');
    else if(tab === 'completed') reloadAllTaskIsDone('content');
}

/**
 * this function will set id for all the tag of new Task
 * @param new_id
 * @param contentOfTask
 */
function setNewIdForTask(new_id, contentOfTask){
    document.getElementById('newtask_div').id = new_id;
    document.getElementById('doingtaskcontent').id = new_id + '_doingtask';
    document.getElementById(new_id + '_doingtask').value = contentOfTask;
    document.getElementById('delete').id = new_id + '_deletedoingtask';
    document.getElementById('check').id = new_id + '_iconcheck';
    document.getElementById('inputcontent').id = new_id + '_inputcontent';
    document.getElementById('iconcheck').id = new_id + '_iconcheck_div';
    document.getElementById('hover').id = new_id + '_hover';

    document.getElementById(new_id).onmouseenter = function (ev) {
        document.getElementById(new_id + '_hover').classList.remove('v-hidden');
        document.getElementById(new_id + '_hover').classList.add('v-visible');
    }

    document.getElementById(new_id).onmouseleave = function (ev) {
        document.getElementById(new_id + '_hover').classList.remove('v-visible');
        document.getElementById(new_id + '_hover').classList.add('v-hidden');
    }

    document.getElementById(new_id + '_iconcheck').onclick = function (ev) {
        var id = getId(event.target.id);
        changeStateOfTask(id);
    };

    // double click input
    document.getElementById(new_id + '_doingtask').ondblclick = function (ev) {
        document.getElementById(event.target.id).removeAttribute('disabled');
    };

    document.getElementById(new_id + '_doingtask').addEventListener("keypress", function(event) {
        if (event.keyCode == 13) {
            document.getElementById(event.target.id).setAttribute('disabled', 'disabled');
        }
    });

    document.getElementById(new_id + '_deletedoingtask').onclick = function (ev) {
        var id = getId(event.target.id);

        if(getItem(id).state === 'active') count_items_left--;
        checkItemsLeft();

        removeATask(event.target.id);
    };
}

/**
 * this function reloads all the task
 * @param id tag of the div contain tasks
 */
function reloadAllTask(id){
    document.getElementById(id).innerHTML = '';

    for(var i = 0; i < task.length; ++i){
        document.getElementById(id).appendChild(creatingNewElement());
        setNewIdForTask(task[i].id, task[i].content);
        if(task[i].state === 'completed'){
            document.getElementById(task[i].id + '_doingtask').classList.add('f-s');
            document.getElementById(task[i].id + '_iconcheck_div').classList.remove('fc-gray');
            document.getElementById(task[i].id + '_iconcheck_div').classList.add('fc-green');
        }
    }
    checkItemsLeft();
}

/**
 * reload all task and display only doing tabs
 * @param id
 */
function reloadAllDoingTask(id){
    document.getElementById(id).innerHTML = '';

    for(var i = 0; i < task.length; ++i){
        if(task[i].state === 'active'){
            document.getElementById(id).appendChild(creatingNewElement());
            setNewIdForTask(task[i].id, task[i].content);
        }
    }

    checkItemsLeft();
}

/**
 * reload all task is done and display only tabs are done
 * @param id
 */
function reloadAllTaskIsDone(id){
    document.getElementById(id).innerHTML = '';

    for(var i = 0; i < task.length; ++i){
        if(task[i].state === 'completed'){
            document.getElementById(id).appendChild(creatingNewElement());
            setNewIdForTask(task[i].id, task[i].content);
            document.getElementById(task[i].id + '_doingtask').classList.add('f-s');
            document.getElementById(task[i].id + '_iconcheck_div').classList.remove('fc-gray');
            document.getElementById(task[i].id + '_iconcheck_div').classList.remove('fc-green');
        }
    }

    checkItemsLeft();
}

/**
 * this function changes border color of three tab : all, active, completed
 * @param desTab destination tab
 */
function changeBorder(desTab){
    if(tab !== desTab){
        if(tab === 'all'){
            document.getElementById('all').classList.remove('border-bottom');
            document.getElementById('all').classList.add('border-square-rad-light');
        }
        else if(tab === 'active') {
            document.getElementById('active').classList.remove('border-bottom');
            document.getElementById('active').classList.add('border-square-rad-light');
        }
        else if(tab === 'completed') {
            document.getElementById('completed').classList.remove('border-bottom');
            document.getElementById('completed').classList.add('border-square-rad-light');
        }
        tab = desTab;
        document.getElementById(desTab).classList.remove('border-square-rad-light');
        document.getElementById(desTab).classList.add('border-bottom');
    }
}

/**
 * this function creates new html task
 * @return {HTMLDivElement}
 */
function creatingNewElement(){
    var div1 = document.createElement('div');
    div1.setAttribute('class', 'flex-row-nowrap newtask mg-t-10 border-square-rad');
    div1.setAttribute('id', 'newtask_div');
    var div2 = document.createElement('div');
    div2.setAttribute('class', 'col1_sm ta-center fs-25 ver-a-50 fc-gray');
    div2.setAttribute('id',  'iconcheck');
    var i1 = document.createElement('i');
    i1.setAttribute('class', 'far fa-check-circle check');
    i1.setAttribute('id', 'check');
    var div3 = document.createElement('div');
    div3.setAttribute('class', 'col2 inputcontent');
    div3.setAttribute('id',  'inputcontent');
    var input1 = document.createElement('input');
    input1.setAttribute('class', 'w100 h90 fs-20 bgc-white border-w-0');
    input1.setAttribute('id', 'doingtaskcontent');
    input1.setAttribute('type', 'text');
    input1.setAttribute('disabled', 'disabled');
    var div4 = document.createElement('div');
    div4.setAttribute('class', 'ver-a-50 v-hidden');
    div4.setAttribute('id',  'hover');
    var i2 = document.createElement('i');
    i2.setAttribute('class','fas fa-times fs-20 delete');
    i2.setAttribute('id', 'delete');

    div4.appendChild(i2);
    div3.appendChild(input1);
    div2.appendChild(i1);
    div1.appendChild(div2);
    div1.appendChild(div3);
    div1.appendChild(div4);

    return div1;
}