/*
    LgDBCommSystem - system using a comm stack on the sql db to read/write short communications between node.js
    and the phantombot server.
*/

(function() {
    var NodeComm = "NodejsComms";
    var JavaComm = "JavaComms";

    var dbComms = {};

    // start/open betting window
    function startBet() {
    }

    // close the betting window
    function closeBet() {
    }

    // award the 'winning' bets
    function winningBet(args) {
        sendComand('bet close ' + args[0]);
    }

    // write to the comm stack to send a message to node.js server (and potentially to pachinko machine)
    dbComms.writeCommStack = function(cmd) {
        $.inidb.SetString(JavaComm, "", "cmd", cmd);
    };

    // create an interval script that will read from the comm-stack of the sql db
    dbComms.readCommStack = function() {
        // read from the NodejsComms table
        var cmd = $.inidb.GetNext(NodeComm);
        if (cmd != null) {
            // parse the command
            var split = cmd.split(',');
            if (split[0] == 'win') {
                split = split.slice(1);
                winningBet(split);
            } else {
                $.log.event('Unknown command: ' + cmd);
            }
        }
        // remove the first item from the 'stack'

    };

    // queue of incoming communicae from
    dbComms.incCommQ = [];

    // make sure the comm tables exist
    if (!$.inidb.FileExists(NodeComm)) {
        $.log.event('Creating sql comm stack for NodeJs communicae');
        $.inidb.AddFileAutoInc(NodeComm);
    }

    if (!$.inidb.FileExists(JavaComm)) {
        $.log.event('Creating sql comm stack for Java communicae');
        $.inidb.AddFileAutoInc(JavaComm);
    }

    // set interval to read from comms stack 2/min
    setInterval(dbComms.readCommStack, 3e4);

    // binding to the chat command system in order to use built-in message to execute other commands
    $.bind('command', function(event) {
    		var sender = event.getSender(),
    			command = event.getCommand(),
    			args = event.getArgs(),
    			action = args[0],
    			subAction = args[1];
    });

    $.bind('initReady', function() {
        $.registerChatCommand('./systems/LgDBCommSystem.js', 'commQ', 1);

        $.registerChatSubcommand('commQ', 'write', 1);
        $.registerChatSubcommand('commQ', 'read', 1);
    });

    $.dbComms = dbComms;
})();