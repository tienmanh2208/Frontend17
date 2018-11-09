var count = 0, count_items_left = 0, isVisible = false, lastEdit = 0, usingLCS = false;// footer
var tab = 'all' /*all, active, completed */, numberoftask = 0;

var task_html = '<div class="flex-row-nowrap newtask mg-t-10 border-square-rad">\n' +
    '               <div class="col1_sm ta-center fs-25 ver-a-50 fc-gray iconcheck"><i class="far fa-check-circle check"></i></div>\n' +
    '               <div class="col2 inputcontent input pd-l-20">\n' +
    '                    <div class="w90 h90 fs-20 doingtaskcontent bgc-white border-w-0"></div>\n' +
    '               </div>\n' +
    '               <div class="ver-a-50 hover_d v-hidden">\n' +
    '                    <i class="fas fa-times fs-20 delete icon_delete"></i>\n' +
    '               </div>' +
    '           </div>';

$(document).ready(function () {
    checkLocalData();
    // removeAllTask();

    $('#newtask').keyup(function(e){
        if(e.keyCode === 13) { $(this).trigger("enterKey"); }
    }).bind('enterKey', function () {
        if($('#newtask').val() !== ''){
            setInfo();
            count_items_left++;
            checkItemsLeft();
            if(tab === 'active') $('#changeall').removeClass('v-hidden');
            if(JSON.parse(localStorage.Task).length !== 0) $('.footer').show();
        }
    });
    
    $('#all').click(function () {
        reloadAllTask('content');
        changeBorder('all');
        $('#changeall').removeClass('v-hidden');
    });

    $('#active').click(function () {
        reloadAllDoingTask('content');
        changeBorder('active');

        if(count_items_left === 0) $('#changeall').addClass('v-hidden');
        else $('#changeall').removeClass('v-hidden');
    });

    $('#completed').click(function () {
        reloadAllTaskIsDone('content');
        changeBorder('completed');

        if(count_items_left === JSON.parse(localStorage.Task).length) $('#changeall').addClass('v-hidden');
        else $('#changeall').removeClass('v-hidden');
    });

    $('#changeall').click(function () {
        if(count_items_left === 0 || tab === 'completed') {
            var arr = JSON.parse(localStorage.Task);
            count_items_left = arr.length;

            arr.map(function (value, i) { arr[i].state = 'active'; })

            localStorage.Task = JSON.stringify(arr);

            if(tab === 'completed') $('#changeall').addClass('v-hidden');
        } else if(tab !== 'completed') {
            var arr = JSON.parse(localStorage.Task);
            count_items_left = 0;
            arr.map(function (value, i) { arr[i].state = 'completed'; })

            localStorage.Task = JSON.stringify(arr);
            if(tab === 'active') $('#changeall').addClass('v-hidden');
        }

        if(tab === 'all') reloadAllTask('content');
        else if(tab === 'active') reloadAllDoingTask('content');
        else if(tab === 'completed') reloadAllTaskIsDone('content');
    });
    
    $('#clear').click(function () {
        var task = JSON.parse(localStorage.Task);
        task.map(function (value, i) { if(task[i].state === 'completed') removeATask(task[i].id + '_abc') })

        if(task.length === 0) { $('.footer').hide(); isVisible = false; }
    });
});

/**
 * this function sets info for new task is added
 */
function setInfo(){
    count++;
    var new_task = {
        id: count,
        content: $('#newtask').val(),
        state: 'active'
    };

    addNewTask(new_task);

    if(tab != 'completed'){
        $('#content').append(task_html);

        if(!isVisible) {
            isVisible = true;
            $('.footer').show();
        }

        setNewIdForTask(count, $('#newtask').val());
    }

    $('#newtask').val('');
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
 * This function removes a task with specified id
 * @param id id contains '_'
 */
function removeATask(id){
    var id_e = getId(id);
    removeItemOnObject(id_e);
    removeDivElement(id_e);
    if(JSON.parse(localStorage.Task).length === 0){ $('.footer').hide(); isVisible = false; }
}

/**
 * this function checks there are any items left or not
 */
function checkItemsLeft(){ $('#count').text(count_items_left + ' items');}

/**
 * this funtion will change the display of a task. if it is complete, the text will be seted line-through
 * @param id {number}
 */
function changeStateOfTask(id){
    var item = findingItemFromObject(id);
    if(item.state === 'active'){
        $('#' + id + '_doingtask').addClass('f-s');
        $('#' + id + '_iconcheck_div').removeClass('fc-gray').addClass('fc-green');
        item.state = 'completed';
        count_items_left--;
        checkItemsLeft();
    }
    else {
        $('#' + id + '_doingtask').removeClass('f-s');
        $('#' + id + '_iconcheck_div').removeClass('fc-green').addClass('fc-gray');
        item.state = 'active';
        count_items_left++;
        checkItemsLeft();
    }

    changeItemOnObject(id,item);
    if(tab === 'active') removeDivElement(id);
    else if(tab === 'completed') removeDivElement(id);
}

/**
 * this function will set id for all the tag of new Task
 * @param new_id
 * @param contentOfTask
 * @param callback
 */
function setNewIdForTask(new_id, contentOfTask, callback){
    $('.newtask').attr('id', new_id).removeClass('newtask');
    $('.doingtaskcontent').attr('id',new_id + '_doingtask');
    $('#' + new_id + '_doingtask').removeClass('doingtaskcontent').text(contentOfTask);
    $('.delete').attr('id', new_id + '_deletedoingtask').removeClass('delete');
    $('.check').attr('id', new_id + '_iconcheck').removeClass('check');
    $('.inputcontent').attr('id', new_id + '_inputcontent').removeClass('inputcontent');
    $('.iconcheck').attr('id', new_id + '_iconcheck_div').removeClass('iconcheck');

    $('#' + new_id).mouseenter(function () {
        $('#' + new_id + '_deletedoingtask').removeClass('v-hidden').addClass('v-visible');
    }).mouseleave(function () {
        $('#' + new_id + '_deletedoingtask').removeClass('v-visible').addClass('v-hidden');
    });


    $('#' + new_id + '_iconcheck').click(function () {
        var id = getId(event.target.id);
        changeStateOfTask(id);
    })

    // double click input
    $('.input').dblclick(function () {
        if(lastEdit != 0) {
            // $('#' + lastEdit + '_doingtask').attr('contenteditable', 'contenteditable');
            updateTask(lastEdit + '_doingtask');
        }
        lastEdit = getId(event.target.id);
        $('#' + event.target.id).attr('contenteditable','');
    });

    $('.input').keyup(function(e){ if(e.keyCode === 13) { $(this).trigger("enterKey"); }
    }).bind('enterKey', function(){updateTask(event.target.id); $('br').remove();});

    $('#' + new_id + '_deletedoingtask').click(function () {
        var id = getId(event.target.id);
        if(findingItemFromObject(id).state === 'active') count_items_left--;
        checkItemsLeft();

        removeATask(event.target.id);

        if(JSON.parse(localStorage.Task).length === 0) { $('.footer').hide(); isVisible = false; }
    });

    if(callback) { callback; }
}

function updateTask(fullid){
    if($('#' + fullid).text() == ''){
        var id = getId(fullid);
        if(findingItemFromObject(id).state === 'active') count_items_left--;
        lastEdit = 0;
        checkItemsLeft();

        removeATask(fullid);
    } else {
        $('#' + fullid).removeAttr('contenteditable');
        lastEdit = 0;
    }
}

/**
 * this function reloads all the task
 * @param id tag of the div contain tasks
 */
function reloadAllTask(id){
    $('#' + id).slideUp(500, 'swing', function(){
        $('#' + id).empty();
        var task = JSON.parse(localStorage.Task);

        task.map(function (currentValue, i) {
            $('#' + id).append(task_html);
            setNewIdForTask(task[i].id, task[i].content);
            if(task[i].state === 'completed'){
                $('#' + task[i].id + '_doingtask').addClass('f-s');
                $('#' + task[i].id + '_iconcheck_div').removeClass('fc-gray').addClass('fc-green');
            }
        });

        checkItemsLeft();
        $('#' + id).slideDown();
    });
}

/**
 * reload all task and display only doing tabs
 * @param id
 */
function reloadAllDoingTask(id){
    $('#' + id).slideUp(500, 'swing', function() {
        $('#' + id).empty();
        var task = JSON.parse(localStorage.Task);

        task.map(function (value, i) {
            if(task[i].state === 'active'){
                $('#' + id).append(task_html);
                setNewIdForTask(task[i].id, task[i].content);
            }
        })

        checkItemsLeft();
        $('#' + id).slideDown();
    });
}

/**
 * reload all task is done and display only tabs are done
 * @param id
 */
function reloadAllTaskIsDone(id){
    $('#' + id).slideUp(500, 'swing', function(){
        $('#' + id).empty();
        var task = JSON.parse(localStorage.Task);

        task.map(function (value, i) {
            if(task[i].state === 'completed'){
                $('#' + id).append(task_html);
                setNewIdForTask(task[i].id, task[i].content);
                $('#' + task[i].id + '_doingtask').addClass('f-s');
                $('#' + task[i].id + '_iconcheck_div').removeClass('fc-gray').addClass('fc-green');
            }
        })

        checkItemsLeft();
        $('#' + id).slideDown();
    });
}

/**
 * this function changes border color of three tab : all, active, completed
 * @param desTab destination tab
 */
function changeBorder(desTab){
    if(tab !== desTab){
        if(tab === 'all') $('#all').removeClass('border-bottom').addClass('border-square-rad-light');
        else if(tab === 'active') $('#active').removeClass('border-bottom').addClass('border-square-rad-light');
        else if(tab === 'completed') $('#completed').removeClass('border-bottom').addClass('border-square-rad-light');
        tab = desTab;
        $('#' + desTab).removeClass('border-square-rad-light').addClass('border-bottom');
    }
}

/**
 * this function removes the div has specified id
 * @param id
 */
function removeDivElement(id) { $('#' + id).slideUp('fast', 'swing', function(){ $('#' + id).remove(); }); }

/**
 * this function removes an item from localStorage.Task
 * @param id {number}
 */
function removeItemOnObject(id) {
    var task = JSON.parse(localStorage.Task);
    task.map(function (value, i) { if(task[i].id === id) { task.splice(i, 1); } });

    localStorage.Task = JSON.stringify(task);
}

/**
 * This funtion will find an item with specified id in localStorage.Task.
 * @param id {number}
 * @return {object} contain { id, content, state }
 */
function findingItemFromObject(id){
    var task = JSON.parse(localStorage.Task);
    var returnValue;
    task.map(function (value, i) { if(task[i].id === id) returnValue = task[i]; })
    return returnValue;
}

/**
 * this function will change the properties of an specified item in localStorage.Task
 * @param id {number}
 * @param obj contain id, content, state
 */
function changeItemOnObject(id, obj){
    var task = JSON.parse(localStorage.Task);

    task.map(function (value, i) { if(task[i].id === id) { task[i] = obj; } })
    localStorage.Task = JSON.stringify(task);
};

/**
 * this function is going to check if a specified id forms a form
 * @param id
 * @return {boolean}
 */
function checkIdItem(id){ if(id.indexOf('_obj') !== -1) return true; return false; }

/**
 * this function checks whether this webTodoList are using the local storage
 */
function checkLocalData(){
    if( localStorage.Task === undefined) {
        $('.footer').hide();
        localStorage.Task = JSON.stringify([]);
    } else {
        var task = JSON.parse(localStorage.Task);
        if(task.length === 0) $('.footer').hide();
        reloadAllTask('content');
        $('#changeall').removeClass('v-hidden');
        countItemsLeft(task);
        if(task.length !== 0) count = task[task.length - 1].id;
        else count = 0;
    }
}

/**
 * coungting all the items have its state is active
 * @param array
 */
function countItemsLeft(array){
    array.map(function (value, i) { if(array[i].state === 'active') count_items_left++; })
}

/**
 * adding a new task
 * @param obj contain id, content, state
 */
function addNewTask(obj){
    var task = JSON.parse(localStorage.Task);
    task.push(obj);
    localStorage.Task = JSON.stringify(task);
}

/**
 * this function removes Task property of localStorage Object
 */
function removeAllTask() { delete localStorage['Task']; };
