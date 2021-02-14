function create_empty_mcts_container(id_mcts_container='mcts_container'){
    var mcts_container = document.getElementById(id_mcts_container);
    mcts_container.innerHTML = '' //reset
    var row_title = document.createElement("div");
    row_title.setAttribute('class', 'row')
    var row_content = document.createElement("div");
    row_content.setAttribute('class', 'row')
    var row_controls = document.createElement("div");
    row_controls.setAttribute('class', 'row')
    //title
    var col = document.createElement("div");
    col.setAttribute('class','col-md-12')
    var title = document.createElement("h1");
    title.appendChild(document.createTextNode('Analisi turno MCTS'))
    title.setAttribute('class', 'text-center text-primary')
    title.setAttribute('id', 'title_mcts_container')
    col.appendChild(title)
    row_title.appendChild(col)
    //controls
    var col_controls = document.createElement("div");
    col_controls.setAttribute('class', 'col-md-12')
    var div_controls = document.createElement("div");
    var title_filter = document.createElement("span");
    title_filter.appendChild(document.createTextNode('Filtro: '))
    div_controls.appendChild(title_filter)
    var input_text = document.createElement("input");
    input_text.setAttribute('id','FilterTextBox')
    div_controls.appendChild(input_text)
    var input_button = document.createElement("input");
    input_button.setAttribute('type','button')
    input_button.setAttribute('value','Applica')
    input_button.setAttribute('onclick','javascript:applyFilter()')
    div_controls.appendChild(input_button)
    input_button = document.createElement("input");
    input_button.setAttribute('type','button')
    input_button.setAttribute('value','Reset')
    input_button.setAttribute('onclick','javascript:resetNodes()')
    div_controls.appendChild(input_button)
    col_controls.appendChild(div_controls)
    row_controls.appendChild(col_controls)
    //canvas
    var col_canvas = document.createElement("div");
    col_canvas.setAttribute('class', 'col-md-6')
    var canvas = document.createElement("canvas");
    canvas.setAttribute('id', 'boardMCTS')
    canvas.setAttribute('style', 'width: 500px;height: 500px')
    canvas.setAttribute('width', '300')
    canvas.setAttribute('height', '300')
    col_canvas.appendChild(canvas)
    var legend = document.createElement("canvas");
    legend.setAttribute('id', 'legend_canvas')
    col_canvas.appendChild(legend)
    row_content.appendChild(col_canvas)
    //network
    var col_network = document.createElement("div");
    col_network.setAttribute('class', 'col-md-6')
    var net = document.createElement("div");
    net.setAttribute('id', 'network')
    net.setAttribute('float', 'right')
    col_network.appendChild(net)
    row_content.appendChild(col_network)
    //
    mcts_container.appendChild(row_title)
    mcts_container.appendChild(row_controls)
    mcts_container.appendChild(row_content)
}

function create_legend(json_legend_nsa){
    var legend = document.getElementById("legend_canvas");
    var ctx = legend.getContext("2d");
    Object.keys(json_legend_nsa).forEach(function(key) {
        ctx.beginPath();
        var pos = Object.keys(json_legend_nsa).indexOf(''+key)
        ctx.arc(10 +pos*30,30, 10, 0, 2 * Math.PI);
        ctx.fillStyle = json_legend_nsa[key];
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.fillText(''+key, 5 +pos*30, 50);
    })
    ctx.beginPath();
    var pos = Object.keys(json_legend_nsa).length;
    ctx.arc(10 +pos*30,30, 10, 0, 2 * Math.PI);
    ctx.fillStyle = '#e2f204';
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'black';
    ctx.fillText('BEST', 5 +pos*30, 50);
}
function draw_tablut_board_with_nsa_prior(canvas, board, json_legend, actions=undefined) {
    ctx = canvas.getContext("2d");
    let square_width = canvas.width  / ROW_COL ;
    let total_squares = ROW_COL*ROW_COL;
    let i, col, row = -1;
    
    canvas.width = 300
    canvas.height = 300
    
    for (i = 0; i < total_squares; i++) {
        col++;
        if (i % ROW_COL == 0) {
            row++; 
            col = 0;
        }     
    
        ctx.beginPath();
        ctx.rect(col * square_width, row * square_width, square_width, square_width);
        //ctx.strokeStyle  = (col + row) % 2 ? "grey" : "black"; 
        ctx.fillStyle = 'red';
        ctx.strokeStyle = 'black';
        special_square = mask_canvas[row][col];
        if (special_square === 5){
            //accampamento
            ctx.fillStyle = 'grey';
            ctx.fill()
        }
        if (special_square === 4){
            //trono
            ctx.fillStyle = 'yellow';
            ctx.fill()
        }
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.font = "20px Verdana";
        piece = board[row][col]
        if(piece === 1){
            ctx.fillStyle = 'black';
            ctx.fillText('B', col * square_width + 15, row*square_width + 25);
        }
        if(piece === 2){
            ctx.fillStyle = 'blue';
            ctx.fillText('W', col * square_width + 15, row*square_width + 25);
        }
        if(piece === 3){
            ctx.fillStyle = 'red';
            ctx.fillText('K', col * square_width + 15, row*square_width + 25);
        }
    }
    if(actions!=undefined){
        Object.keys(actions).forEach(key => {
            var tuple_move = key.split(/,|\(|\)| /).filter(function(e){ return e === 0 || e })
            var fromx = tuple_move[0]
            var fromy = tuple_move[1]
            var tox = tuple_move[2]
            var toy = tuple_move[3]
            x2 = fromy * square_width + 15
            x1 = toy * square_width + 15
            y2 = fromx * square_width + 15
            y1 = tox * square_width + 15
            

            isbest = true
            for(skey in actions){
                if(skey != key && actions[skey] > actions[key] ){
                    isbest = false
                }
            }


            if(isbest){
            
                drawArrow(ctx, x1, y1, x2, y2, 20, 5, "#e2f204", 10);
            
            }else{
                var key_dynamic_group = Math.max(...Object.keys(json_legend).filter(function(lower_bound){
                    return lower_bound <= actions[key]
                }));
                var width = Object.keys(json_legend).indexOf(''+key_dynamic_group)
                drawArrow(ctx, x1, y1, x2, y2, 20, 5, json_legend[key_dynamic_group], width+1);
            }
        });
    }
    create_legend(json_legend)
}