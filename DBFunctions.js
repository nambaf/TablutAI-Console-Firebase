TRAINING_KEY = 'training'
ITERATION_KEY = 'iteration_'
MCTS_KEY = 'mcts'
MATCH_KEY = 'match_'
LOADNET_KEY = 'loaded-net'
MAXSELFPLAY_KEY = 'max-selfplay'
NUMMCTS_KEY = 'num-mcts-sims'
WINSBLACK_KEY = 'wins-black'
WINSWHITE_KEY = 'wins-white'
WINNER_KEY = 'winner'
TURN_KEY = 'turn_'
CURRENTPLAYER_KEY = 'player'
MOVE_KEY = 'move'
BOARD_KEY = 'board'


module.exports = {
  remove_generic_listener: function(firebase, ref_str){
    firebase.database().ref(ref_str).off()
  },
  set_generic_listener: function(firebase, ref_str, func_handler){
    listener = firebase.database().ref(ref_str);
    listener.on('value', func_handler)
  },
  get_generic_snapshot: function(firebase, ref_str, func_handler){
    firebase.database().ref(ref_str).once('value').then(func_handler);
  },
  /*
  TRAINING FUNCTIONS
  */
  find_training_iterations: function(firebase, response_to_send=undefined){
    var train_str = TRAINING_KEY;
    var iterations = []
    this.get_generic_snapshot(firebase, train_str, function(snapshot){
      snapshot.forEach(function(child_snapshot){
        iterations.push(child_snapshot.key)
      });
      if(response_to_send !== undefined){
        response_to_send.json({ITERATION_KEY: iterations});
      }
    });
  },
  find_training_specific_iteration: function(firebase, str_iteration, response_to_send=undefined){
    var it_str = TRAINING_KEY + '/' + str_iteration;
    var matches = []
    this.get_generic_snapshot(firebase, it_str, function(snapshot){
      var load_net = snapshot.val()[LOADNET_KEY]
      var max_self_play = snapshot.val()[MAXSELFPLAY_KEY]
      var num_sims = snapshot.val()[NUMMCTS_KEY]
      var wins_b = snapshot.val()[WINSBLACK_KEY]
      var wins_w = snapshot.val()[WINSWHITE_KEY]
      snapshot.forEach(function(child_snapshot){
        if(child_snapshot.key.startsWith(MATCH_KEY))
          matches.push(child_snapshot.key)
      });
      if(response_to_send !== undefined){
        response_to_send.json({
          LOADNET_KEY: load_net,
          MAXSELFPLAY_KEY: max_self_play,
          NUMMCTS_KEY: num_sims,
          WINSBLACK_KEY: wins_b,
          WINSWHITE_KEY: wins_w,
          MATCH_KEY: matches
        });
      }
    });
  },
  find_training_specific_match: function(firebase, str_iteration, str_match, response_to_send=undefined){
    var match_str = TRAINING_KEY + '/' + str_iteration + '/' + str_match;
    var turns = []
    this.get_generic_snapshot(firebase, match_str, function(snapshot){
      var match_name = snapshot.key
      var winner = snapshot.val()[WINNER_KEY]
      snapshot.forEach(function(turn_snapshot){
        if(turn_snapshot.key.startsWith(TURN_KEY))
          turns.push(turn_snapshot.key)
      })
      if(response_to_send !== undefined){
        response_to_send.json({
          MATCH_KEY: match_name,
          WINNER_KEY: winner,
          NUM_TURNS: turns.length,
          TURNS: turns
        });
      }
    });
  },
  find_training_turns: function(firebase, str_iteration, str_match, response_to_send=undefined){
    var match_str = TRAINING_KEY + '/' + str_iteration + '/' + str_match;
    var turns = []
    this.get_generic_snapshot(firebase, match_str, function(snapshot){
      snapshot.forEach(function(turn_snapshot){
        if(turn_snapshot.key.startsWith(TURN_KEY)){
          var current_p = turn_snapshot.val()[CURRENTPLAYER_KEY]
          var move = turn_snapshot.val()[MOVE_KEY]
          var board = turn_snapshot.val()[BOARD_KEY]
          turns.push({
              TURN_KEY: turn_snapshot.key,
              BOARD_KEY: board,
              MOVE_KEY: move,
              CURRENTPLAYER_KEY: current_p
            })
        }
      });
      if(response_to_send !== undefined){
        response_to_send.json({
          MATCH_KEY: turns
        });
      }
    });
  },
  /*
  MCTS FUNCTIONS
  */
 find_mcts_turn: function(firebase, str_iteration, str_match, str_turn, response_to_send=undefined){
   
    var turn_str = MCTS_KEY + '/' + str_match + '/' + str_turn + '/tree';

    this.get_generic_snapshot(firebase, turn_str, function(tree_snapshot){
      if(response_to_send !== undefined){
        response_to_send.json({treeKey: tree_snapshot});
      }
    })
  }
  
};
