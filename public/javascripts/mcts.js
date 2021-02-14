
var container = document.getElementById('network');

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
    }
};

function applyFilter(){
    var stringMinNsa = document.getElementById('FilterTextBox').value

    var minNsa = 0
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


    var filteredNodes = [];
    var filteredEdges = [];
    var count = 0;
    for(key in recivedArray){
        if(recivedArray[key].Nsa >= minNsa){
            filteredNodes.push({id:key, label:"move "+recivedArray[key].move+ " Nsa "+ recivedArray[key].Nsa});
            filteredEdges.push({from: recivedArray[key].parent , to: key , id:"e"+count});
            count++;
        }
    }
    setTree(filteredNodes,filteredEdges,count);

}

function resetNodes(){
    return createTree()
}

function setTree(){
    
    var data = {
        nodes: Object.keys(mapNodes).map(function(key){return mapNodes[key].node}),
        edges: Object.keys(mapEdges).map(function(key){return mapEdges[key].edge})
    };

    var network = new vis.Network(container, data, options);
    network.on("click", function (params) {

        var selectedNode = mapNodes[this.getNodeAt(params.pointer.DOM)]

        if(selectedNode.expanded){
           
            removechild(selectedNode)
            
            selectedNode.expanded=false
        }else{

            for(key in recivedArray){
                if(recivedArray[key].parent == selectedNode.node.id)
                {
                    mapNodes[key] = {node:{id:key, label:"move "+recivedArray[key].move+ " Nsa "+ recivedArray[key].Nsa}, expanded: false, parent:selectedNode.node.id }
                    mapEdges["from_"+selectedNode.node.id+"_to_"+key] = {edge: {from: selectedNode.node.id , to: key , id:"from_"+selectedNode.node.id+"_to_"+key} }
                }
            }

            selectedNode.expanded=true
        }

        setTree()
    });
}

function removechild(node){
    for(key in mapNodes){
        if( mapNodes[key].parent == node.node.id){
            removechild(mapNodes[key])
            delete mapNodes[key]
            delete mapEdges["from_"+node.node.id+"_to_"+key]
            
        }
    }
}

function arrayRemove(arr, value) {

    return arr.filter(function(ele){
        return ele != value;
    });
 
 }

function createTree(){
    $.ajax({
        url: "/getNodes",  // the local Node server
        method: 'GET',
        success: function(data){
            
            recivedArray = data.treeKey;
            mapNodes = {}
            mapEdges = {}
            

            for (var key in recivedArray) {
                if (recivedArray[key] .parent == "ROOT"){
                    mapNodes[key] = {node:{id:key, label:"move "+recivedArray[key].move+ " Nsa "+ recivedArray[key].Nsa}, expanded: false, parent:"ROOT"}
                    
                }
            }
            // create a network
            
            setTree();
         }
    });
}