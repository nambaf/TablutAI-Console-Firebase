const ROW_COL = 9;
mask_canvas = [
    [0,0,0,5,5,5,0,0,0],
    [0,0,0,0,5,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [5,0,0,0,0,0,0,0,5],
    [5,5,0,0,4,0,0,5,5],
    [5,0,0,0,0,0,0,0,5],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,5,0,0,0,0],
    [0,0,0,5,5,5,0,0,0]
]

function draw_tablut_board(canvas, board, actions=undefined) {
    
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
        actions.forEach(action => {
            var tuple_move = action.split(/,|\(|\)| /).filter(function(e){ return e === 0 || e })
            var fromx = tuple_move[0]
            var fromy = tuple_move[1]
            var tox = tuple_move[2]
            var toy = tuple_move[3]
            x2 = fromy * square_width + 15
            x1 = toy * square_width + 15
            y2 = fromx * square_width + 15
            y1 = tox * square_width + 15
            
            drawArrow(ctx, x1, y1, x2, y2, 20, 5, '#f36', 4);
        });
    }
    
}

function drawHead (ctx, x0, y0, x1, y1, x2, y2, color, width) {

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);

    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x0, y0);
    ctx.fill();

    ctx.restore();
}
  

function drawArrow(ctx, x1, y1, x2, y2, angle, d, color, width) {
    var dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    var ratio = (dist - d / 3) / dist;
    var tox, toy, fromx, fromy;

    tox = x2;
    toy = y2;  

    fromx = x1 + (x2 - x1) * (1 - ratio);
    fromy = y1 + (y2 - y1) * (1 - ratio);

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();

    var lineangle = Math.atan2(y2 - y1, x2 - x1);
    var h = Math.abs(d / Math.cos(angle));

    var angle1 = lineangle + angle;
    var topx = x1 + Math.cos(angle1) * h;
    var topy = y1 + Math.sin(angle1) * h;
    var angle2 = lineangle - angle;
    var botx = x1 + Math.cos(angle2) * h;
    var boty = y1 + Math.sin(angle2) * h;
    drawHead(ctx, topx, topy, x1, y1, botx, boty, color, width);
}