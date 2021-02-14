var backup_match_container = document.getElementById('match_container').cloneNode(true)

function create_spinner(element){
    /*
    Crea spinner come figlio di element
    */
    div_cont = document.createElement("div");
    var i;
    for (i = 0; i < 5; i++) {
        div = document.createElement("div");
        div.setAttribute('class', 'spinner-grow text-danger')
        div.setAttribute('role', 'status')
        span = document.createElement("span");
        span.setAttribute('class', 'sr-only')
        span.appendChild(document.createTextNode('Loading...'));
        div.appendChild(span)
        div_cont.appendChild(div)
    }
    element.appendChild(div_cont)
}
function create_iteration_container(iteration_container, json_iteration_info = undefined){
    /*
    Crea un pannello container composto da h2,table per info iterazioni come figlio di element
    */
    var cont_fluid = document.createElement("div");
    cont_fluid.setAttribute('class', 'container-fluid')
    var row_cont = document.createElement("div");
    row_cont.setAttribute('class', 'row')
    var col_cont = document.createElement("div");
    col_cont.setAttribute('class', 'col-md-12')
    //Block iter
    var row_cont_name = document.createElement("div");
    row_cont_name.setAttribute('class', 'row')
    var col_cont_name = document.createElement("div");
    col_cont_name.setAttribute('class', 'col-md-12')
    var name = document.createElement("h2");
    name.setAttribute('id', 'iteration')
    name.appendChild(document.createTextNode('Ultima iterazione: '.concat((json_iteration_info!= undefined) ? json_iteration_info.ID_ITER : 'Error database')));
    col_cont_name.appendChild(name)
    row_cont_name.appendChild(col_cont_name)
    col_cont.appendChild(row_cont_name)
    //Fine Block iter
    //Block info
    var row_cont_info = document.createElement("div");
    row_cont_info.setAttribute('class', 'row')
    var col_cont_info = document.createElement("div");
    col_cont_info.setAttribute('class', 'col-md-12')
    var table_info = document.createElement("table");
    table_info.setAttribute('class', 'table table-striped table-bordered')
    var table_head = document.createElement("thead");
    var table_head_tr = document.createElement("tr");
    if(json_iteration_info != undefined){
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Identificativo'));
        table_head_tr.appendChild(th)
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Net precaricata'));
        table_head_tr.appendChild(th)
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Numero self-plays'));
        table_head_tr.appendChild(th)
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Simulazioni MCTS'));
        table_head_tr.appendChild(th)
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Vittorie neri'));
        table_head_tr.appendChild(th)
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Vittorie bianchi'));
        table_head_tr.appendChild(th)
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Partite'));
        table_head_tr.appendChild(th)
        var th = document.createElement("th");
        th.appendChild(document.createTextNode('Azioni'));
        table_head_tr.appendChild(th)
    }
    table_head.appendChild(table_head_tr)
    var table_body = document.createElement("tbody");
    table_body.setAttribute('id', 'info_iteration')
    var tr_info = document.createElement("tr");
    if(json_iteration_info != undefined){
        tr_info.setAttribute("id", "table_info_"+json_iteration_info.ID_ITER);

        var td_info = document.createElement("td")
        td_info.appendChild(document.createTextNode(json_iteration_info.ID_ITER))
        tr_info.appendChild(td_info)

        td_info = document.createElement("td")
        td_info.appendChild(document.createTextNode(json_iteration_info.LOADNET_KEY))
        tr_info.appendChild(td_info)

        td_info = document.createElement("td")
        td_info.appendChild(document.createTextNode(json_iteration_info.MAXSELFPLAY_KEY))
        tr_info.appendChild(td_info)

        td_info = document.createElement("td")
        td_info.appendChild(document.createTextNode(json_iteration_info.NUMMCTS_KEY))
        tr_info.appendChild(td_info)

        td_info = document.createElement("td")
        td_info.appendChild(document.createTextNode(json_iteration_info.WINSBLACK_KEY))
        tr_info.appendChild(td_info)

        td_info = document.createElement("td")
        td_info.appendChild(document.createTextNode(json_iteration_info.WINSWHITE_KEY))
        tr_info.appendChild(td_info)

        td_info = document.createElement("td")
        json_iteration_info.MATCH_KEY.forEach(match => {
            br = document.createElement("br")
            button = document.createElement("button")
            button.setAttribute('class', 'btn btn-success')
            button.setAttribute('onclick', 'javascript:search_match("'+json_iteration_info.ID_ITER+'","'+match+'")');
            button.appendChild(document.createTextNode(match))
            td_info.appendChild(button)
            td_info.appendChild(br)
        });
        tr_info.appendChild(td_info)

        td_info = document.createElement("td")
        button = document.createElement("button")
        button.setAttribute('class', 'btn btn-danger');
        button.setAttribute('type', 'button');
        button.setAttribute('onclick', 'javascript:remove_element_by_id("table_info_'+json_iteration_info.ID_ITER+'")');
        i = document.createElement("i")
        i.setAttribute('class', 'fas fa-trash-alt');
        button.appendChild(i)
        td_info.appendChild(button)
    }
    tr_info.appendChild(td_info)
    table_body.appendChild(tr_info)
    table_info.appendChild(table_body)
    table_info.appendChild(table_head)
    col_cont_info.appendChild(table_info)
    row_cont_info.appendChild(col_cont_info)
    col_cont.appendChild(row_cont_info)
    //Fine Block info
    row_cont.appendChild(col_cont)
    cont_fluid.appendChild(row_cont)
    iteration_container.appendChild(cont_fluid)
}
function create_table_iteration_OLD(json_iteration_info, id_table_title='iteration', id_table_info='info_iteration'){

    /*  *json_iteration_info*

    ID_ITER = iteration_001
    LOADNET_KEY: true
    MATCH_KEY: ["match_0000", "match_0001", "match_0002"]
    MAXSELFPLAY_KEY: 50
    NUMMCTS_KEY: 1350
    WINSBLACK_KEY: 0
    WINSWHITE_KEY: 1
    */
    var iteration_title = document.getElementById(id_table_title);
    iteration_title.innerText = 'Last iter: ' + json_iteration_info.ID_ITER
    var iteration_info = document.getElementById(id_table_info);
    var tr_info = document.createElement("tr");
    tr_info.setAttribute("id", "table_info_"+json_iteration_info.ID_ITER);

    var td_info = document.createElement("td")
    td_info.appendChild(document.createTextNode(json_iteration_info.ID_ITER))
    tr_info.appendChild(td_info)

    td_info = document.createElement("td")
    td_info.appendChild(document.createTextNode(json_iteration_info.LOADNET_KEY))
    tr_info.appendChild(td_info)

    td_info = document.createElement("td")
    td_info.appendChild(document.createTextNode(json_iteration_info.MAXSELFPLAY_KEY))
    tr_info.appendChild(td_info)

    td_info = document.createElement("td")
    td_info.appendChild(document.createTextNode(json_iteration_info.NUMMCTS_KEY))
    tr_info.appendChild(td_info)

    td_info = document.createElement("td")
    td_info.appendChild(document.createTextNode(json_iteration_info.WINSBLACK_KEY))
    tr_info.appendChild(td_info)

    td_info = document.createElement("td")
    td_info.appendChild(document.createTextNode(json_iteration_info.WINSWHITE_KEY))
    tr_info.appendChild(td_info)

    td_info = document.createElement("td")
    json_iteration_info.MATCH_KEY.forEach(match => {
        br = document.createElement("br")
        button = document.createElement("button")
        button.setAttribute('class', 'btn btn-success')
        button.setAttribute('onclick', 'javascript:search_match("'+json_iteration_info.ID_ITER+'","'+match+'")');
        button.appendChild(document.createTextNode(match))
        td_info.appendChild(button)
        td_info.appendChild(br)
    });
    tr_info.appendChild(td_info)

    td_info = document.createElement("td")
    button = document.createElement("button")
    button.setAttribute('class', 'btn btn-danger');
    button.setAttribute('type', 'button');
    button.setAttribute('onclick', 'javascript:remove_element_by_id("table_info_'+json_iteration_info.ID_ITER+'")');
    i = document.createElement("i")
    i.setAttribute('class', 'fas fa-trash-alt');
    button.appendChild(i)
    td_info.appendChild(button)
    tr_info.appendChild(td_info)
    
    iteration_info.appendChild(tr_info)
}
function create_match_basic_info(match_basic_info_id, ...args){
    var match_basic_info = document.getElementById(match_basic_info_id)
    match_basic_info.innerText = ''
    info = document.createElement("h1")
    info.setAttribute('class','text-primary')
    info.appendChild(document.createTextNode('Id: ' + args[0]))
    match_basic_info.appendChild(info)
    info = document.createElement("h4")
    info.appendChild(document.createTextNode('Vincitore = ' + args[1]))
    match_basic_info.appendChild(info)
    info = document.createElement("h4")
    info.appendChild(document.createTextNode('Totale turni = ' + args[2]))
    match_basic_info.appendChild(info)
}
function create_match_history(match_history_id, turns){
    var match_history = document.getElementById(match_history_id)
    match_history.innerText = ''
    div_hist = document.createElement("div")
    div_hist.setAttribute('class', 'container_history')
    div_m_hist = document.createElement("div")
    div_m_hist.setAttribute('class', 'match_history list-group')
    div_m_hist.setAttribute('id', 'match_turn_list')

    turns.forEach(turn => {
        anchor_turn = document.createElement("a")
        if(turn === turns[0])
            anchor_turn.setAttribute('class', 'list-group-item list-group-item-action active')
        else
            anchor_turn.setAttribute('class', 'list-group-item list-group-item-action')

        anchor_turn.setAttribute('href', 'javascript:find_match_canvas_and_list("item_car_'+turn+'","'+turn+'")')
        anchor_turn.setAttribute('id', turn)

        info = document.createElement("h5")
        info.appendChild(document.createTextNode(turn))
        anchor_turn.appendChild(info)
        div_m_hist.appendChild(anchor_turn)
    });
    div_hist.appendChild(div_m_hist)
    match_history.appendChild(div_hist)
}
function create_match_turn(match_turn_id, turns){
    /* *ESEMPIO*
    : Array(55)
        0: 
            BOARD_KEY: (9) [Array(9), Array(9), Array(9), Array(9), Array(9), Array(9), Array(9), Array(9), Array(9)]
            CURRENTPLAYER_KEY: 2
            MOVE_KEY: "((4, 3), (2, 3))"
            TURN_KEY: "turn_0001"
        1:
            BOARD_KEY: (9) [Array(9), Array(9), Array(9), Array(9), Array(9), Array(9), Array(9), Array(9), Array(9)]
            CURRENTPLAYER_KEY: 1
            MOVE_KEY: "((8, 3), (1, 3))"
            TURN_KEY: "turn_00010"
        ...
    */
    var match_turn = document.getElementById(match_turn_id)
    
    turns.forEach(turn => {
        car_item = document.createElement("div")
        if(turn === turns[0])
            car_item.setAttribute('class', 'carousel-item active')
        else
            car_item.setAttribute('class', 'carousel-item')
        car_item.setAttribute('id', 'item_car_'+turn.TURN_KEY)
        
        canvas = document.createElement("canvas")
        canvas.setAttribute('style', 'width: 400px;height: 400px')
        draw_tablut_board(canvas, turn.BOARD_KEY, [turn.MOVE_KEY])
        car_item.appendChild(canvas)

        car_cap = document.createElement("div")
        car_cap.setAttribute('class', 'carousel-caption')
        car_cap.setAttribute('style', 'text-shadow: 0 0 2px black')
        cp_cap = document.createElement("p")
        cp_cap.appendChild(document.createTextNode("Giocatore "+ turn.CURRENTPLAYER_KEY))
        car_cap.appendChild(cp_cap)
        car_item.appendChild(car_cap)
        match_turn.appendChild(car_item)
    });
}
function find_match_canvas_and_list(id_match_turn, id_turn_list){
    var match_turn = document.getElementById('match_turn')

    var current_active = match_turn.querySelector('.active')
    current_active.setAttribute('class', 'carousel-item')

    var new_active = document.getElementById(id_match_turn)
    
    new_active.setAttribute('class', 'carousel-item active')

    var list_turn = document.getElementById('match_turn_list')
    current_active = list_turn.querySelector('.active')
    current_active.setAttribute('class', 'list-group-item list-group-item-action')

    new_active = document.getElementById(id_turn_list)
    new_active.setAttribute('class', 'list-group-item list-group-item-action active')
    last_turn_mcts = id_turn_list
}
function find_turn_list(id_turn_list){
    match_turn = document.getElementById('match_turn')

    var current_active = match_turn.querySelector('.active')
    current_active.setAttribute('class', 'carousel-item')

    var new_active = document.getElementById(id_match_turn)
    last_turn_mcts = id_match_turn
    new_active.setAttribute('class', 'carousel-item active')
}
function create_empty_match_container(id_match_container){
   /*
    Crea un pannello container composto da 
    info basic per match,
    lista dei turni,
    rappresentazione board del turno
    */
    var match_container = document.getElementById(id_match_container);
    match_container.innerHTML = '' //reset
    match_container.setAttribute('style', 'visibility: hidden')
    var row = document.createElement("div");
    row.setAttribute('class', 'row')
    //match_basic_info
    var col_basic = document.createElement("div");
    col_basic.setAttribute('class', 'col-md-4')
    col_basic.setAttribute('id', 'match_basic_info')
    row.appendChild(col_basic)
    //
    //match_history
    var col_hist = document.createElement("div");
    col_hist.setAttribute('class', 'col-md-4')
    col_hist.setAttribute('id', 'match_history')
    row.appendChild(col_hist)
    //carouselExampleControls
    var col_turn = document.createElement("div");
    col_turn.setAttribute('class', 'col-md-4')
    var row_turn = document.createElement("div");
    row_turn.setAttribute('class', 'row')
    var col_car = document.createElement("div");
    col_car.setAttribute('class', 'col-md-12')
    col_car.setAttribute('style', 'text-align:center')
    var car = document.createElement("div");
    car.setAttribute('id', 'carouselExampleControls')
    car.setAttribute('class', 'carousel slide')
    car.setAttribute('data-ride', 'carousel')
    car.setAttribute('data-interval', 'false')
    var inner = document.createElement("div");
    inner.setAttribute('class', 'carousel-inner')
    inner.setAttribute('id', 'match_turn')

    var a = document.createElement("a");
    a.setAttribute('class', 'carousel-control-prev')
    a.setAttribute('href', '#carouselExampleControls')
    a.setAttribute('role', 'button')
    a.setAttribute('data-slide', 'prev')
    var span = document.createElement("span");
    span.setAttribute('class', 'carousel-control-prev-icon')
    span.setAttribute('aria-hidden', 'true')
    a.appendChild(span)
    var span = document.createElement("span");
    span.setAttribute('class', 'sr-only')
    span.appendChild(document.createTextNode('Previous'))
    a.appendChild(span)
    inner.appendChild(a)
    
    a = document.createElement("a");
    a.setAttribute('class', 'carousel-control-next')
    a.setAttribute('href', '#carouselExampleControls')
    a.setAttribute('role', 'button')
    a.setAttribute('data-slide', 'next')
    span = document.createElement("span");
    span.setAttribute('class', 'carousel-control-next-icon')
    span.setAttribute('aria-hidden', 'true')
    a.appendChild(span)
    var span = document.createElement("span");
    span.setAttribute('class', 'sr-only')
    span.appendChild(document.createTextNode('Next'))
    a.appendChild(span)
    inner.appendChild(a)

    car.appendChild(inner)
    col_car.appendChild(car)
    row_turn.appendChild(col_car)
    col_turn.appendChild(row_turn)
    row.appendChild(col_turn)
    //
    match_container.appendChild(row)
    return match_container
}