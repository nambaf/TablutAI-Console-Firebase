var last_iter_mcts = 'iteration_0001'
var last_match_mcts = 'match_0000'
var last_turn_mcts = 'turn_0001'

function search_iterations_V2(id_container_iter = 'iteration_container'){
    var iter_container = document.getElementById(id_container_iter)
    iter_container.innerHTML = ''
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            /* *responseText*
            {
                ITERATION_KEY: [iteration_0001,iteration_0002]
            }
            */
            var response = JSON.parse(this.responseText)
            var iterations = response.ITERATION_KEY;
            iterations.forEach(iteration_name => {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        /*  *responseText*
                        LOADNET_KEY: true
                        MATCH_KEY: ["match_0000", "match_0001", "match_0002"]
                        MAXSELFPLAY_KEY: 50
                        NUMMCTS_KEY: 1350
                        WINSBLACK_KEY: 0
                        WINSWHITE_KEY: 1
                        */
                        var response = JSON.parse(this.responseText)
                        response.ID_ITER = iteration_name
                        last_iter_mcts = iteration_name

                        create_iteration_container(iter_container, response)
                    }   
                };

            xhttp.open("GET", "/explore_iteration?it="+iteration_name, true);
            xhttp.send();
            });
            
        }
    };

    xhttp.open("GET", "/find_training_iteration", true);
    xhttp.send();
}


function search_match(iteration_name, match_name, id_match_container='match_container'){
    var match_container = create_empty_match_container(id_match_container)
    last_match_mcts = match_name

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            /* *responseText*
            MATCH_KEY: "match_0001"
            NUM_TURNS: 31
            TURNS: ["turn_0001", "turn_00010", "turn_00011", "turn_00012"]
            WINNER_KEY: 0       
            */
            var response = JSON.parse(this.responseText)
            

            create_match_basic_info('match_basic_info', response.MATCH_KEY, response.WINNER_KEY, response.NUM_TURNS)
            create_match_history('match_history', response.TURNS)

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    /* *responseText*
                    MATCH_KEY: Array(55)
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
                    var response = JSON.parse(this.responseText)
                    create_match_turn('match_turn', response.MATCH_KEY)
                    match_container.style['visibility'] = 'visible'
                }
            }
            xhttp.open("GET", "/find_training_turns?it="+iteration_name+'&m='+match_name, true);
            xhttp.send();
        }
    }
    xhttp.open("GET", "/find_training_match?it="+iteration_name+'&m='+match_name, true);
    xhttp.send();
}

