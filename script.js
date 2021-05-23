
//....................................... meta data.......................................//
let banksData = [];
let banksTitle = ['#', 'IFSC', 'Bank_id', 'Branch','Address', 'City', 'District', 'State'];
let cityArray = ['selected_city','bangalore', 'jaipur', 'delhi', 'mumbai', 'kolkata'];
let dataLength = 0;
let pageLimit = 5;
var page_number = 1;
let maxPageNumber = 0;
let city = 0;
let limit = 0;
let offset = 0;
let URL = 'https://banks-branches-api.herokuapp.com/api/branches?q=';

let order = 'asc';
let sortColNumber = 0;
var sortColId  = '#';



//...............................................helper Funtion.................................................//

// upadate simple Options data
function updateOptionData(){

    limitData[city] = limit;
    pageNumberData[city] = page_number;
    pageLimitData[city] = pageLimit;

    orderData[city] = order;
    sortColIDData[city] = sortColId;
    sortColNumberData[city] = sortColNumber;
}
 
// fetch simple option data
function fetchOptionData(){
    limit = limitData[city];
    pageLimit = pageLimitData[city];
    page_number = pageNumberData[city];

    order = orderData[city];
    sortColId = sortColIDData[city];
    sortColNumber = sortColNumberData[city];
        
}




//................................Table Info fetiching and updating dynamically Logic Implemented............................//

// function to getUpdate if choose Option in selected form
function getUpdate(){

    // get the selected data from options
    
    var temp = $('#selected_city').val();
    if(temp == city){
        tempLimit = $('#selected_limit').val();
        tempPageLimit = $('#selected_page_limit').val();

        if(tempLimit == limit && tempPageLimit == pageLimit){
            
        }else if(tempPageLimit == pageLimit){
            limit = tempLimit;
            limitData[city] = limit;
        }else{
            pageLimit = tempPageLimit;
            pageLimitData[city] = pageLimit;
        }

        order = orderData[city];
        sortColId = sortColIDData[city];
        sortColNumber = sortColNumberData[city];

        // updatea all data;
        updateOptionData();
    }else{
        city = temp;

        // get all data
        fetchOptionData();

        $("#selected_limit").val(limit);
        $("#selected_page_limit").val(pageLimit);
    }
    
    offset = 0;

    cityStr = cityArray[city];
    
    let url = URL + cityStr + '&limit=' + limit + '&offset=' + offset;


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
            // $('table').fadeOut(400, function() {
            //     $(this).html(str).fadeIn(400);
            // });

            $('table').html(str).fadeIn(400);
            $('#page-nav .pagination').html(pageNaveStr).fadeIn(400);
                // sort the data
                // call the sort function to maintain the data before page reload or page change
            sortTable(order,sortColNumber);
            
            
            // change page nav
            // $('#page-nav .pagination').fadeOut(400, function() {
            //     $('#page-nav .pagination').html(pageNaveStr).fadeIn(400);
            //     // sort the data
            //     // call the sort function to maintain the data before page reload or page change
            //     sortTable(order,sortColNumber);
            // });

            
                    
        },
        error: function(jqxhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });

    // invisible add buttion
    $(document).find('#AddFavorite').css("visibility", "hidden"); 
}




//...................................................Data Replacement Logic....................................................//

// Initial funtction to make the header of the table
function initialChange(){

    // check condition if all data is facoutrite or not
    checkall = '';

    // get the key value for store data in map
    if(limit>0){
        var key = cityArray[city] + page_number + "with" + pageLimit;
        
        if(fav[cityArray.length].get(key)){
            checkall = ' checked';
        }
    }

    // sort triangle icon
    downIcon = ' &#9660 ';
    upIcon = ' ';
    var method = ' onclick="sortBy($(this).html(), $(this).prevAll().length)"';

    if(parseInt(limit)==0){
        upIcon = ' '
        method = '';
    }

    str = '';
    str += '<thead class="thead-light">';
    str += '<tr>';
    str += '<th><input id="checkall" type="checkbox" class="star" name="checkall"'+ checkall + ' ></th>';
    
    var i = 0;
    var value = ' value="0" ';
    banksTitle.forEach(element => {
        if(i+1==parseInt(sortColNumber)){
            if(order == 'asc'){
                value = ' value="1" ';
                upIcon = ' &#9650 '
            }else{
                value = ' value="-1" ';
                upIcon = ' &#9660 '
            }
            
        }

        str += '<th scope="col" id="sortCol" ' + value +  method + ' > ' + element + upIcon + '</th>';

        upIcon = '';
        value = ' value="0" ';
        i++;
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
        if(cnt-start+1 > pageLimit || cnt>limit){
            return;
        }
        if(fav[city].get(data.ifsc)){
            checked = ' checked';
        }
        str += '<tr>'
        str += '<td><input id="cehckrow" type="checkbox" class="star" name="checkrow" style="width:1.5em"'+ checked + ' ></th>'
        str += '<td scope="row" >'+ cnt + '</th>';
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
                // sort the data
                // call the sort function to maintain the data before page reload or page change
                sortTable(order,sortColNumber);
            });
            $('#page-nav .pagination').html(pageNaveStr);
        },
        error: function(jqxhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}




//..................................................paging Nav bar updation Logic Implement..........................//

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

    // update page_number in pageNumberData
    pageNumberData[city] = page_number;
    
    // change data 
    changeData(city,limit,offset);
}




//.....................................Table Sort By column Logic Implemented....................................//

// onclick function to sort table according clicked column
function sortBy(text,colNumber){
    // console.log("target : " + text);

    // triangle icon of sort indication
    downIcon = ' &#9660 ';
    upIcon = ' &#9650 ';

    
    // update the header info according sort called on particular column
    var col = document.getElementById('page_table').rows[0].cells;
    for(i=0;i<col.length;++i){
        if(col[i].innerHTML == text){
            if(col[i].getAttribute('value') == '0'){
                order = 'asc';
                col[i].setAttribute('value','1');
                col[i].innerHTML = banksTitle[i-1] + upIcon;
            }
            else if(col[i].getAttribute('value') == '1'){
                order = 'desc';
                col[i].setAttribute('value','-1');
                col[i].innerHTML = banksTitle[i-1] + downIcon;
            }else if(col[i].getAttribute('value') == '-1'){
                order = 'asc';
                col[i].setAttribute('value','1');
                col[i].innerHTML = banksTitle[i-1] + upIcon;
            }   
        }else{
            if(col[i].getAttribute('value') == '1' || col[i].getAttribute('value')== '-1'){
                col[i].setAttribute('value','0');
                col[i].innerHTML = banksTitle[i-1];
            }
        }
    }

    // get the length of the data
    sortColNumberData[city] = colNumber;
    sortColIDData[city] = text;
    orderData[city] = order;

    // call the sort function 
    sortTable(order,colNumber);
}

// function to sort the table data with columwise
function sortTable(order,n) {

    // check the order of the elements
    var f = (order == 'asc')?1:-1;

    // get all row value of particular column
    var rows = $('#page_table tbody tr').get();

    // function perform swaping after condition check
    rows.sort(function(a, b) {
        var A = getVal(a);
        var B = getVal(b);

        if(A < B) {
            return -1*f;
        }
        if(A > B) {
            return 1*f;
        }
        return 0;
    });


    // function to get the value from html 
    function getVal(elm){
        var v = $(elm).children('td').eq(n).text().toUpperCase();
        if($.isNumeric(v)){
            v = parseInt(v,10);
        }
        return v;
    }

    // function to swap the data of table to ordered data
    $.each(rows, function(index, row) {
		$('#page_table').children('tbody').append(row);
	});
   
}




// .........................................Fav Data Saving logic Implemented................................................//

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





// ......................................Jquery Event Listners starts.........................................//

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
    var key = cityArray[city] + page_number + "with" + pageLimit;

    // update favorite data info
    // check if checkbox checked or unchcked and update info according to that
    if($("input[name='checkall']").prop('checked')){

        // iterate all checked box and update Info
        $("tbody input:checkbox[name=checkrow]:checked").each(function(){
            var row = $(this).closest("tr")[0];
            var id  = row.cells[2].innerHTML;
            fav[city].set(id,true);
        });
        
        // update checkboxall status
        fav[cityArray.length].set(key,true);
    }else{

        // iterate all un checked box and update Info
        $("tbody input:checkbox[name=checkrow]:not(:checked)").each(function(){
            var row = $(this).closest("tr")[0];
            var id  = row.cells[2].innerHTML;
            fav[city].set(id,false);
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
        var key = cityArray[city] + page_number + "with" + pageLimit;
        fav[cityArray.length].set(key,(tdCheckboxChecked === $tdCheckbox.length)); // update info

    })

    // row = this.parentNode.parentNode
    var row = $(this).closest("tr")[0];
    var id  = row.cells[2].innerHTML;

    // check if checkbox checked or unchcked and update info according to that
    if(fav[city].get(id)){
        // update Add Favorite buttion info
        fav[city].set(id,false);
    }else{
        // update Add Favorite buttion info
        fav[city].set(id,true);
    }

});



//...............................................Data of options to save in page state.....................................//

// declaring Options data
limitData = Array(cityArray.length);
pageNumberData  = Array(cityArray.length);
pageLimitData = Array(cityArray.length);

// Declaring Sorting Data
orderData = Array(cityArray.length);
sortColNumberData = Array(cityArray.length);
sortColIDData = Array(cityArray.length);

// initialisze Data array
for(i=0;i<cityArray.length;++i){
    // initialising Options data
    limitData[i] = 0;
    pageNumberData[i] = 1;
    pageLimitData[i] = 5;

    // initialising sorting data
    orderData[i] = 'asc';
    sortColNumberData[i] = 0;
    sortColIDData[i] = '#';
}   

// checking NUll Data
function checkNullData(){
    for(i=0;i<cityArray.length;++i){
        // initialising Options data
        limitData[i]= limitData[i]==null?0:limitData[i];
        pageNumberData[i] =  pageNumberData[i]==null?1: pageNumberData[i];
        pageLimitData[i] = pageLimitData[i]==null?5:pageLimitData[i];
    
        // initialising sorting data
        orderData[i] = orderData[i]==null?'asc':orderData[i];
        sortColNumberData[i] = sortColNumberData[i]==null?0:sortColNumberData[i];
        sortColIDData[i] = sortColIDData[i]==null?'#':sortColIDData[i];
    }   
}



// .....................................Save & Load Function to sotre the page state ........................................//

// funtions to save the page state on local storage after page reload
function save() {
    for (i = 0; i < cityArray.length + 1; i++) {
        if(i < cityArray.length){
            localStorage.setItem(cityArray[i],JSON.stringify(Array.from(fav[i].entries())));
        }else{
            localStorage.setItem("allCheckboxData",JSON.stringify(Array.from(fav[i].entries())));
        }
        
    }

    localStorage.setItem("city", city);

    // saving Sorting Data
    localStorage.setItem("orderData", JSON.stringify(orderData));
    localStorage.setItem("sortColNumberData", JSON.stringify(sortColNumberData));
    localStorage.setItem("sortColIDData", JSON.stringify(sortColIDData));
    
    // saving Otions Data
    localStorage.setItem("limitData", JSON.stringify(limitData));
    localStorage.setItem("pageNumberData", JSON.stringify(pageNumberData));
    localStorage.setItem("pageLimitData", JSON.stringify(pageLimitData));
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

    if(localStorage.getItem("city")!=null){
        city = localStorage.getItem("city");
    }
    
    // sorting Data retriving....................//
    if((JSON.parse(localStorage.getItem("orderData"))) != null){
        orderData = JSON.parse(localStorage.getItem("orderData"));
    }
    if((JSON.parse(localStorage.getItem("sortColNumberData"))) != null){
        sortColNumberData = JSON.parse(localStorage.getItem("sortColNumberData"));
    }
    if((JSON.parse(localStorage.getItem("sortColIDData"))) != null){
        sortColIDData = JSON.parse(localStorage.getItem("sortColIDData"));
    }


    // Options Data retriving........................//
    if((JSON.parse(localStorage.getItem("limitData"))) != null){
        limitData = JSON.parse(localStorage.getItem("limitData"));
    }
    if((JSON.parse(localStorage.getItem("pageNumberData"))) != null){
        pageNumberData = JSON.parse(localStorage.getItem("pageNumberData"));
    }
    if((JSON.parse(localStorage.getItem("pageLimitData"))) != null){   
        pageLimitData = JSON.parse(localStorage.getItem("pageLimitData"));
    }
    
    // check for null values in array
    checkNullData();

    // clear localstorage
    localStorage.clear();

    // console.log("********************************");

    $("#selected_city").val(city);
    $("#selected_limit").val(limitData[city]);
    $("#selected_page_limit").val(pageLimitData[city]);

    limit = limitData[city];
    pageLimit = pageLimitData[city];
    page_number = pageNumberData[city];

    order = orderData[city];
    sortColId = sortColIDData[city];
    sortColNumber = sortColNumberData[city];

    // First call of update function
    getUpdate();
}

// call function at starting to load the saved data at client side
load();

// call save function to save the page state before thr page refresh
window.onbeforeunload = function(event){
    event.preventDefault();
    save.apply();
    return event.returnValue = "Are you sure you want to exit?";
};




