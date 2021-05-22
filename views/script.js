
// const { json } = require("body-parser");

// meta data
let banksData = [];
let banksTitle = ['#', 'IFSC', 'Bank_id', 'Branch','Address', 'City', 'District', 'State'];
let cityArray = ['selected_city','bangalore', 'jaipur', 'delhi', 'mumbai', 'kolkata'];
let dataLength = 0;
let pageLimit = 5;
var page_number = 1;
let maxPageNumber = 0;
let city = $('#selected_city').val();
let limit = $('#selected_limit').val();
let offset = 0;
let URL = 'http://localhost:5000/api/branches?q=';
// 'https://flye-backend-avikant.herokuapp.com/api/branches?q='

// function to getUpdate if choose Option in selected form
function getUpdate(){

    // get the selected data from options
    city = cityArray[$('#selected_city').val()];
    limit = $('#selected_limit').val();
    pageLimit = $('#selected_page_limit').val();
    offset = 0;
    
    let url = URL + city + '&limit=' + limit + '&offset=' + offset;


    // call API using AJAX to grap data from in JSON formate
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'JSON', 
        data: 'dataObj',
        success: function onGetObjSuccess(outputfromserver){

            // compute data for paging
            dataLength = outputfromserver.rows.length;
            if(parseInt(limit) < parseInt(pageLimit)){
                pageLimit = Math.max(limit,5);
                page_number = 1;
            }

            var sum = parseInt(limit) + parseInt(pageLimit) - 1;
            maxPageNumber = parseInt(sum/pageLimit);

            if(page_number > maxPageNumber){
                page_number = Math.max(maxPageNumber,1);
            }
            start = (page_number-1)*pageLimit + 1;


            // string of Table header 
            str = '', pageNaveStr = '';
            str = initialChange();
            
            // check condition if dataLength 0 or more
            if(dataLength != 0){
                str += changeTable(outputfromserver.rows, start);
                pageNaveStr = pageNavUpdate();

            }

            // change table data
            $('table').fadeOut(400, function() {
                $(this).html(str).fadeIn(400);
            });
            
            // change page nav\
            $('#page-nav .pagination').fadeOut(400, function() {
                $('#page-nav .pagination').html(pageNaveStr).fadeIn(400);
            });
                    
        },
        error: function(jqxhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });

    // invisible add buttion
    $(document).find('#AddFavorite').css("visibility", "hidden"); 
}

// Initial funtction to make the header of the table
function initialChange(){
    // check condition if all data is facoutrite or not
    checkall = '';

    // get the key value for store data in map
    if(limit>0){
        var key = city + page_number + "with" + pageLimit;
        console.log("initial key : "+ key);
        if(fav[cityArray.length].get(key)){
            checkall = ' checked';
        }
    }

    str = '';
    str += '<thead class="thead-light">';
    str += '<tr>';
    str += '<th><input id="checkall" type="checkbox" class="star" name="checkall"'+ checkall + ' ></th>';
    
    banksTitle.forEach(element => {
        str += '<th scope="col">' + element + '</th>';
    });
    str += '</tr>';
    str += '</thead>';
    return str;
            
}

// getString of Table row
function getString(cnt, data){
    str += '<tr>'
    str += '<th><input id="checkall" type="checkbox" name="checkall"></th>'
    str += '<th scope="row">'+ cnt + '</th>';
    str += '<td>' + data.ifsc + '</td>';
    str += '<td>' + data.bank_id + '</td>';
    str += '<td>' + data.branch  + '</td>';
    str += '<td>' + data.address + '</td>';
    str += '<td>' + data.city + '</td>';
    str += '<td>' + data.district + '</td>';
    str += '<td>' + data.state + '</td>';
    str += '</tr>';
    return str;
}

// Function to change the Table Data dynamically
function changeTable(banksData, start){
    str = '';
    str += '<tbody>';
    cnt = start;
    checked = '';

    banksData.forEach(data => {
        if(cnt-start+1 > pageLimit){
            return;
        }
        if(fav[cityMap[city]].get(data.ifsc)){
            checked = ' checked';
        }
        str += '<tr>'
        str += '<td><input id="cehckrow" type="checkbox" class="star" name="checkrow" style="width:1.5em"'+ checked + ' ></th>'
        str += '<td scope="row">'+ cnt + '</th>';
        str += '<td>' + data.ifsc + '</td>';
        str += '<td>' + data.bank_id + '</td>';
        str += '<td>' + data.branch  + '</td>';
        str += '<td>' + data.address + '</td>';
        str += '<td>' + data.city + '</td>';
        str += '<td>' + data.district + '</td>';
        str += '<td>' + data.state + '</td>';
        str += '</tr>';
        cnt++;
        checked = '';
    });

    str += '</tbody>';
    return str;
}


// Function to fetch the data dynamically 
function changeData(city, limit, offset){
    url  = URL + city + '&limit=' + limit + '&offset=' + offset;

    // call API using Ajax adn grab json data
    $.ajax({
        method: 'GET',
        url: url,
        dataType: 'JSON', 
        data: 'dataObj',
        success: function onGetObjSuccess(outputfromserver){
            str = '';
            start = (page_number-1)*pageLimit + 1;
            str = initialChange();

            if(outputfromserver.rows.length != 0){
                str += changeTable(outputfromserver.rows, start);  
                pageNaveStr = pageNavUpdate();
            }

            $('table').fadeOut(400, function() {
                $(this).html(str).fadeIn(400);
            });
            $('#page-nav .pagination').html(pageNaveStr);
        },
        error: function(jqxhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

// function to update page-nav after select page at the bottom in pag-nav 
function pageNavUpdate(){
    pageNumber = page_number;
    start = Math.max(pageNumber - 2, 0);
    end = Math.min(start + 5, maxPageNumber);
    zoom = '';
    
    // prev nav page
    status = '', method = '';
    if(pageNumber == 1){
        status = ' disable';
    }else{
        method = 'onclick="pageUpdate($(this).text())"';
        zoom = ' zoom';
    }
    pageName = 'Prev';
    prev = '<li class="page-item' + status + zoom +' "> <button class="page-link" '+ method +'>'+ pageName +'</button> </li>';

    // all original contend page
    pageStr = '';
    zoom = ' zoom';
    for(i=start;i<=end;++i){
        if(i==pageNumber){
            status = ' active';
        }

        if(i>=1){
            if(pageNumber == i){
                status = ' active';
            }
            pageStr += '<li class="page-item' + status + zoom +'"> <button class="page-link" onclick="pageUpdate($(this).text())">'+ i +'</button> </li>';
            status = '';
        }
    }

    // next nav page
    if(pageNumber == maxPageNumber){
        status = ' disable';
        method = '';
        zoom = '';
    }else{
        method = 'onclick="pageUpdate($(this).text())"';
        status = '';
        zoom = ' zoom';
    }
    pageName = 'Next';
    next = '<li class="page-item' + status + zoom +' "> <button class="page-link" '+ method +'>'+ pageName +'</button> </li>';

    return (prev + pageStr + next);

}

// function to update page and load new data
function pageUpdate(pageText){

    // set value of page_number
    if(pageText == "Prev"){
        page_number--;
        currentPage = page_number;
    }else if(pageText == "Next"){
        page_number++;
        currentPage = page_number;
    }else{
        currentPage = parseInt(pageText);
    }
    
    // get page_limit
    pageLimit = $('#selected_page_limit').val();
    offset = Math.max((currentPage-1)*pageLimit,0);
    page_number = currentPage;
    
    // change data 
    changeData(city,limit,offset);
}


// CheckBox 
var fav = Array(cityArray.length + 1);
var checkedBoxNumber = 0;
let cityMap = new Map()

// map values of city and initialise fav array
for(i=0;i<cityArray.length + 1;++i){
    fav[i] = new Map();
    if(i<cityArray.length){
        cityMap[cityArray[i]] = i;  
        fav[i].set(0,false);
    }
}

// update information of the fav array
function updateInfo(flag, id, upto){

    for(i=id;i<parseInt(id)+parseInt(upto);++i){
        if(flag){
            fav[cityMap[city]].set(i,true);
        }else{
            fav[cityMap[city]].set(i,false);
        }
    }
}

// Jquery Event Listners starts.........................................//

// Event Listener to make the search filter through seach box
$("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});

// Jquery Event Listner to handle the all check box click
$(document).on("change", "input[name='checkall']", function () {
    var $selectAll = $('#checkall'); // main checkbox inside table thead
    var $table = $('.table'); // table selector 
    var $tdCheckbox = $table.find('tbody input:checkbox'); // checboxes inside table body
    var tdCheckboxChecked = 0; // checked checboxes

    // Select or deselect all checkboxes depending on main checkbox change
    $tdCheckbox.prop('checked', this.checked);

    // Get count of checkboxes that is checked  
    tdCheckboxChecked = $table.find('tbody input:checkbox:checked').length;

    // get the key value for store data in map
    var key = city + page_number + "with" + pageLimit;

    // update favorite data info
    // check if checkbox checked or unchcked and update info according to that
    if($("input[name='checkall']").prop('checked')){

        // iterate all checked box and update Info
        $("tbody input:checkbox[name=checkrow]:checked").each(function(){
            var row = $(this).closest("tr")[0];
            var id  = row.cells[2].innerHTML;
            fav[cityMap[city]].set(id,true);
        });
        
        // update checkboxall status
        fav[cityArray.length].set(key,true);
    }else{

        // iterate all un checked box and update Info
        $("tbody input:checkbox[name=checkrow]:not(:checked)").each(function(){
            var row = $(this).closest("tr")[0];
            var id  = row.cells[2].innerHTML;
            fav[cityMap[city]].set(id,false);
        });

        // update checkboxall status
        fav[cityArray.length].set(key,false);
    }

});

// JQuery Event Listen to handle the single row checkbox click
$(document).on("change", "input[name='checkrow']", function () {

    var $selectAll = $('#checkall'); // main checkbox inside table thead
    var $table = $('.table'); // table selector 
    var $tdCheckbox = $table.find('tbody input:checkbox'); // checboxes inside table body
    var tdCheckboxChecked = 0; // checked checboxes


    // Toggle main checkbox state to checked when all checkboxes inside tbody tag is checked
    $tdCheckbox.on('change', function(e){
        tdCheckboxChecked = $table.find('tbody input:checkbox:checked').length; // Get count of checkboxes that is checked
        // if all checkboxes are checked, then set property of main checkbox to "true", else set to "false"
        $selectAll.prop('checked', (tdCheckboxChecked === $tdCheckbox.length));

        // get the key value for store data in map
        var key = city + page_number + "with" + pageLimit;
        fav[cityArray.length].set(key,(tdCheckboxChecked === $tdCheckbox.length)); // update info

    })

    // row = this.parentNode.parentNode
    var row = $(this).closest("tr")[0];
    var id  = row.cells[2].innerHTML;

    // check if checkbox checked or unchcked and update info according to that
    if(fav[cityMap[city]].get(id)){
        // update Add Favorite buttion info
        fav[cityMap[city]].set(id,false);
    }else{
        // update Add Favorite buttion info
        fav[cityMap[city]].set(id,true);
    }

});




// funtions to save the page state on local storage after page reload
function save() {
    for (i = 0; i < cityArray.length + 1; i++) {
        if(i < cityArray.length){
            localStorage.setItem(cityArray[i],JSON.stringify(Array.from(fav[i].entries())));
        }else{
            localStorage.setItem("allCheckboxData",JSON.stringify(Array.from(fav[i].entries())));
        }
        
    }
    // localStorage.setItem("selectAllCheckbox",JSON.stringify(Array.from(allCheckBox.entries())))
}

// function to load the data after reload page
function load() {
    for (i = 0; i < cityArray.length + 1; i++) {
        if(i < cityArray.length){
            fav[i] = new Map(JSON.parse(localStorage.getItem(cityArray[i])));
        }else{
            fav[i] = new Map(JSON.parse(localStorage.getItem("allCheckboxData")));
        }
        
    }
    localStorage.clear();
}

// call function at starting to load the saved data at client side
// load();

// call save function to save the page state before thr page refresh
// window.onbeforeunload = function(event){
//     // event.preventDefault();
//     save.apply();
//     return event.returnValue = "Are you sure you want to exit?";
// };



