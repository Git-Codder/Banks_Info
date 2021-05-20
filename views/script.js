
// meta data
let banksData = [];
let banksTitle = ['#', 'IFSC', 'Bank_id', 'Branch','Address', 'City', 'District', 'State'];
let dataLength = 0;
let pageLimit = 5;
var page_number = 0;
let maxPageNumber = 0;
let city = $('#selected_city').val();
let limit = $('#selected_limit').val();
let offset = 0;
let URL = 'http://localhost:5000/api/branches?q=';
// 'https://flye-backend-avikant.herokuapp.com/api/branches?q='

// function to getUpdate if choose Option in selected form
function getUpdate(){

    // get the selected data from options
    city = $('#selected_city').val();
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
                pageLimit = Math.max(limit,1);
            }

            var sum = parseInt(limit) + parseInt(pageLimit) - 1;
            maxPageNumber = parseInt(sum/pageLimit);


            // string of Table header 
            str = '', pageNaveStr = '';
            str = initialChange();

            // store page_number to find the value of start
            temp = page_number;
            // compute starting of the data 
            if(page_number > maxPageNumber){
                temp = temp-1;
            }
            start = (temp)*pageLimit + 1;
            
            // check condition if dataLength 0 or more
            if(dataLength != 0){
                str += changeTable(outputfromserver.rows, start);
                pageNaveStr = pageNavUpdate();

            }

            // change table data
            $('table').fadeOut(400, function() {
                $(this).html(str).fadeIn(400);
            });
            // change page nav
            $('#page-nav .pagination').html(pageNaveStr);
                    
        },
        error: function(jqxhr, textStatus, errorThrown){
            console.log(errorThrown);
        }
    });
}

// Initial funtction to make the header of the table
function initialChange(){
    str = '';
    str += '<thead class="thead-light">';
    str += '<tr>';
    str += '<th><input id="checkall" type="checkbox" class="star" name="checkall"></th>';
    
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

    banksData.forEach(data => {
        if(cnt-start+1 > pageLimit){
            return;
        }
        str += '<tr>'
        str += '<th><input id="cehckrow" type="checkbox" class="star" name="checkrow" style="width:1.5em"></th>'
        str += '<th scope="row">'+ cnt + '</th>';
        str += '<td>' + data.ifsc + '</td>';
        str += '<td>' + data.bank_id + '</td>';
        str += '<td>' + data.branch  + '</td>';
        str += '<td>' + data.address + '</td>';
        str += '<td>' + data.city + '</td>';
        str += '<td>' + data.district + '</td>';
        str += '<td>' + data.state + '</td>';
        str += '</tr>';
        cnt++;
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
    
    // prev nav page
    status = '', method = '';
    if(pageNumber == 1){
        status = ' disable';
    }else{
        method = 'onclick="pageUpdate($(this).text())"';
    }
    pageName = 'Prev';
    prev = '<li class="page-item' + status +' "> <button class="page-link" '+ method +'>'+ pageName +'</button> </li>';


    // all original contend page
    pageStr = '';
    for(i=start;i<=end;++i){
        if(i==pageNumber){
            status = ' active';
        }

        if(i>=1){
            if(pageNumber == i){
                status = ' active';
            }
            pageStr += '<li class="page-item' + status +'"> <button class="page-link" onclick="pageUpdate($(this).text())">'+ i +'</button> </li>';
            status = '';
        }
    }

    // next nav page
    if(pageNumber == maxPageNumber){
        status = ' disable';
        method = '';
    }else{
        method = 'onclick="pageUpdate($(this).text())"';
        status = '';
    }
    pageName = 'Next';
    next = '<li class="page-item' + status +' "> <button class="page-link" '+ method +'>'+ pageName +'</button> </li>';

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

// function to make the search filter through seach box
$("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("tbody tr").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
});


// CheckBox 
var fav = [];

$(document).on("change", "input[name='checkall']", function () {
    var $selectAll = $('#checkall'); // main checkbox inside table thead
    var $table = $('.table'); // table selector 
    var $tdCheckbox = $table.find('tbody input:checkbox'); // checboxes inside table body
    var tdCheckboxChecked = 0; // checked checboxes

    // Select or deselect all checkboxes depending on main checkbox change
    $tdCheckbox.prop('checked', this.checked);
});


$(document).on("change", "input[name='checkrow']", function () {
    var $selectAll = $('#checkall'); // main checkbox inside table thead
    var $table = $('.table'); // table selector 
    var $tdCheckbox = $table.find('tbody input:checkbox'); // checboxes inside table body
    var tdCheckboxChecked = 0; // checked checboxes

    // Toggle main checkbox state to checked when all checkboxes inside tbody tag is checked
    $tdCheckbox.on('change', function(e){
        tdCheckboxChecked = $table.find('tbody input:checkbox:checked').length; // Get count of checkboxes that is checked
        // if all checkboxes are checked, then set property of main checkbox to "true", else set to "false"
        if(tdCheckboxChecked >= 0){
            $(document).find('#AddFavorite').css("visibility", "visible");
        }else{
            $(document).find('#AddFavorite').css("visibility", "hidden"); 
        }
        $selectAll.prop('checked', (tdCheckboxChecked === $tdCheckbox.length));
    })


});

