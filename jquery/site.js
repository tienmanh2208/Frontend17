var count = 0, count_items_left = 0, isVisible = false, lastEdit = 0; // footer
var tab = 'all' /*all, active, completed */, task = [];

var task_html = '<div class="flex-row-nowrap newtask mg-t-10 border-square-rad">\n' +
    '               <div class="col1_sm ta-center fs-25 ver-a-50 fc-gray iconcheck"><i class="far fa-check-circle check"></i></div>\n' +
    '               <div class="col2 inputcontent input">\n' +
    '                    <input class="w100 h90 fs-20 doingtaskcontent bgc-white border-w-0" type="text" disabled>\n' +
    '               </div>\n' +
    '               <div class="ver-a-50 hover_d v-hidden">\n' +
    '                    <i class="fas fa-times fs-20 delete icon_delete"></i>\n' +
    '               </div>' +
    '           </div>';

$(document).ready(function () {
    $('.footer').hide();
    $('#newtask').keyup(function(e){
        if(e.keyCode === 13) { $(this).trigger("enterKey"); }
    }).bind('enterKey', function () {
        if($('#newtask').val() !== ''){
            setInfo();
            count_items_left++;
            checkItemsLeft();
            if(tab === 'active') $('#changeall').removeClass('v-hidden');
            if(task.length !== 0) $('.footer').show();
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

        if(count_items_left === task.length) $('#changeall').addClass('v-hidden');
        else $('#changeall').removeClass('v-hidden');
    });

    $('#changeall').click(function () {
        if(count_items_left === 0) {
            count_items_left = task.length;
            for(var i = 0 ; i < task.length; ++i){
                task[i].state = 'active'
            }
            if(tab === 'completed') $('#changeall').addClass('v-hidden');
        } else {
            count_items_left = 0;
            for(var i = 0 ; i < task.length; ++i){
                 task[i].state = 'completed'
            }

            if(tab === 'active') $('#changeall').addClass('v-hidden');
        }

        if(tab === 'all') reloadAllTask('content');
        else if(tab === 'active') reloadAllDoingTask('content');
        else if(tab === 'completed') reloadAllTaskIsDone('content');
    });
    
    $('#clear').click(function () {
        for(var i = task.length-1 ; i >= 0; --i){
            if(task[i].state === 'completed'){
                removeATask(task[i].id + '_abc');
            }
        }

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

    task.push(new_task);

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
 * this function removes element in an specified array
 * @param id
 * @param array
 */
function removeAElement(array, id){
    for(var i = 0 ; i < array.length; ++i){
        if(array[i].id === id)
            array.splice(i, 1);
    }
}

/**
 * This function removes a task with specified id
 * @param id
 */
function removeATask(id){
    var id_e = getId(id);

    removeAElement(task, id_e);
    removeDivElement(id_e);
}

/**
 * this function checks there are any items left or not
 */
function checkItemsLeft(){
    // if(count_items_left == 0){ $('.footer').hide(); }
    $('#count').text(count_items_left + ' items');
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
        $('#' + id + '_doingtask').addClass('f-s');
        $('#' + id + '_iconcheck_div').removeClass('fc-gray').addClass('fc-green');
        item.state = 'completed';
        count_items_left--;
        checkItemsLeft();
    }
    else {
        // $('#' + id + '_doingtask').addClass('check');
        $('#' + id + '_doingtask').removeClass('f-s');
        $('#' + id + '_iconcheck_div').removeClass('fc-green').addClass('fc-gray');
        item.state = 'active';
        count_items_left++;
        checkItemsLeft();
    }

    if(tab === 'active') removeDivElement(id);
    else if(tab === 'completed') removeDivElement(id);
}

/**
 * this function will set id for all the tag of new Task
 * @param new_id
 * @param contentOfTask
 */
function setNewIdForTask(new_id, contentOfTask, callback){
    $('.newtask').attr('id', new_id).removeClass('newtask');
    $('.doingtaskcontent').attr('id',new_id + '_doingtask');
    $('#' + new_id + '_doingtask').removeClass('doingtaskcontent').val(contentOfTask);
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
            // $('#' + lastEdit + '_doingtask').attr('disabled', 'disabled');
            updateTask(lastEdit + '_doingtask');
        }
        lastEdit = getId(event.target.id);
        $('#' + event.target.id).removeAttr('disabled');
    });

    $('.input').keyup(function(e){
        if(e.keyCode === 13) { $(this).trigger("enterKey"); }
    }).bind('enterKey', function(){updateTask(event.target.id)});

    $('#' + new_id + '_deletedoingtask').click(function () {
        var id = getId(event.target.id);

        if(getItem(id).state === 'active') count_items_left--;
        checkItemsLeft();

        removeATask(event.target.id);

        if(task.length === 0) { $('.footer').hide(); isVisible = false; }
    });

    if(callback) { callback; }
}

function updateTask(fullid){
    if($('#' + fullid).val() == ''){
        var id = getId(fullid);
        if(getItem(id).state === 'active') count_items_left--;
        checkItemsLeft();

        removeATask(fullid);
    } else {
        $('#' + fullid).attr('disabled', 'disabled');
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

        for(var i = 0; i < task.length; ++i){
            $('#' + id).append(task_html);
            setNewIdForTask(task[i].id, task[i].content);
            if(task[i].state === 'completed'){
                $('#' + task[i].id + '_doingtask').addClass('f-s');
                $('#' + task[i].id + '_iconcheck_div').removeClass('fc-gray').addClass('fc-green');
            }
        }
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

        for(var i = 0; i < task.length; ++i){
            if(task[i].state === 'active'){
                $('#' + id).append(task_html);
                setNewIdForTask(task[i].id, task[i].content);
            }
        }

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

        for(var i = 0; i < task.length; ++i){
            if(task[i].state === 'completed'){
                $('#' + id).append(task_html);
                setNewIdForTask(task[i].id, task[i].content);
                $('#' + task[i].id + '_doingtask').addClass('f-s');
                $('#' + task[i].id + '_iconcheck_div').removeClass('fc-gray').addClass('fc-green');
            }
        }

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