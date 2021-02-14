group_different_nsa = {
    1 : 'source',
    50: 'box',
    100: 'database'
}

group_different_arrow_action = {
    1 :  '#68B',
    5:   '#5fb',
    10:  '#5f6',
    20:  '#58d',
    50:  '#bbb',
    70:  '#f07',
    90:  '#f4c',
    100: '#f00'
}

extras_options_node = {
    color: {
        background:'#39c7ef', 
        border:'black', 
        highlight:{
            background:'#e0b723',
            border:'black'
        },
        hover:{
            background:'#0ba81e',
            border:'#045934'
        }
    },
    group: 'source'
}

var options = {
    layout: {
        hierarchical: {
            direction: "UD",
            sortMethod: "directed",
            levelSeparation: 800,
            nodeSpacing: 200

        }
    },
    interaction: {
        hover:true,
        dragNodes :false
    },
    physics: {
        enabled: false
    },
    groups: {
        box: {
            shape: 'box',
            color: '#41f477'
        },
        database: {
            shape: 'database',
            color: '#b342f4'
        },
        source: {
            shape: 'ellipse',
            color: '#d85b76'
        }
    },
    edges: {
        width: 2,
        arrowStrikethrough: true,
        arrows: {
            to:     {enabled: false, scaleFactor:1, type:'arrow'},
            middle: {enabled: true, scaleFactor:1, type:'arrow'},
            from:   {enabled: false, scaleFactor:1, type:'arrow'}
          }

    },
    nodes: {
        color: {
            background:'#39c7ef', 
            border:'black', 
            highlight:{
                background:'#e0b723',
                border:'black'
            },
            hover:{
                background:'#0ba81e',
                border:'#045934'
            }
        }
    }
};

minNsa = 0
function applyFilter(){
    var stringMinNsa = document.getElementById('FilterTextBox').value

    minNsa = 0
    if(!isNaN(stringMinNsa)){
        minNsa = parseInt(stringMinNsa)
        if(minNsa <0){
            alert("Enter a positive number")
            return
        }
    }else{
        alert("Enter a valid Digit")
        return
    }
    
    filter_min_nsa(minNsa)
    
    draw_board(lastClickedNode)
    
    setTree()
}

function apply_generic_func_map(func, ...params){
    for(key in tree){
        func(key, ...params)
    }
}

get_child_selected = function(key, selectedNode){
    if(tree[key].parent == selectedNode.node.id){
        update_child(selectedNode.node.id)
    }
}
get_root = function(key){
    if (tree[key].parent === "ROOT"){
        mapNodes[key] = {
            node:{
                id:key,
                label:"Move "+tree[key].move + " Nsa "+ tree[key].Nsa
            },
            expanded: false,
            parent:"ROOT"
        }
        lastClickedNode = key
    }
}
filter_min_nsa = function(bound){
    for(node in mapNodes){
        if(tree[node].Nsa < bound){
            delete mapNodes[node]
        }
    }

    mapEdges = {}
    for(node in mapNodes){

        mapEdges["from_"+mapNodes[node].parent+"_to_"+node] = {
            edge: {
                from: mapNodes[node].parent,
                to: node,
                id: "from_"+mapNodes[node]+"_to_"+node
            }
        }
    }
}

function update_child(parent){
    var key_dynamic_group = Math.max(...Object.keys(group_different_nsa).filter(function(lower_bound){
        return lower_bound <= tree[key].Nsa
    }));
    mapNodes[key] = {
        node:{
            id: key,
            label: "move "+tree[key].move+ " Nsa "+ tree[key].Nsa,
            group: group_different_nsa[key_dynamic_group]
        },
        expanded: false,
        parent: parent
    }
    mapEdges["from_"+parent+"_to_"+key] = {
        edge: {
            from: parent,
            to: key,
            id: "from_"+parent+"_to_"+key
        }
    }
}

function resetNodes(){
    minNsa = 0
    return createTree()
}

function setTree(){
    container = document.getElementById('network');
    canvas = document.getElementById('boardMCTS')
    
    data = {
        nodes: Object.keys(mapNodes).map(function(key){return mapNodes[key].node}),
        edges: Object.keys(mapEdges).map(function(key){return mapEdges[key].edge})
    };

    network = new vis.Network(container, data, options);
    
    network.on("click", function (params) {

        var selectedNode = mapNodes[this.getNodeAt(params.pointer.DOM)]


        lastClickedNode = this.getNodeAt(params.pointer.DOM)

       
        if(selectedNode != undefined){
            if(selectedNode.expanded){
                    
                removechild(selectedNode)
                
                selectedNode.expanded=false
            }else{

                apply_generic_func_map(get_child_selected, selectedNode)

                selectedNode.expanded=true
            }

            filter_min_nsa(minNsa)
            draw_board(lastClickedNode)

            setTree()
        }
    });
}

function draw_board(key_node){

    var sonActions = {}

    for(node in mapNodes){

        if(mapNodes[node].parent == key_node){
            sonActions[tree[node].move] = tree[node].Nsa
        }
    }
    draw_tablut_board_with_nsa_prior(canvas, tree[key_node].board, group_different_arrow_action, sonActions)
}

function removechild(node){
    var sons = []
    for(key in mapNodes){
        if( mapNodes[key].parent == node.node.id){
            sons.push(mapNodes[key])
            delete mapNodes[key]
            delete mapEdges["from_"+node.node.id+"_to_"+key]
        }
    }
    
    for(son in sons){
        removechild(sons[son])
    }
}

function createTree(){
    create_empty_mcts_container()
    $.ajax({
        url: "/find_mcts_tree?it="+last_iter_mcts+'&m='+last_match_mcts+'&t='+last_turn_mcts,  // the local Node server
        method: 'GET',
        success: function(data){
            document.getElementById('title_mcts_container').innerText = 'Analisi turno MCTS:' + last_iter_mcts +'/'+last_match_mcts+'/'+last_turn_mcts
            tree = data.treeKey;
            mapNodes = {}
            mapEdges = {}
            apply_generic_func_map(get_root)
            
            setTree();
         }
    });
}