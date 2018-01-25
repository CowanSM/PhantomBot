/**
 * Betting system, a system use to bet about thing to win or lose points in Twitch chat.
 * bettingSystem.js
 *
 */

// import from underscore
//import * as _ from "./underscore.js";


(function() {
    function play(sender) {
        $.say($.whisperPrefix(sender) + "Welcome to Leviathan Pachinko! Use !bet to place a bet. Follow the channel to get started!");
    }

    /**
     * @function reloadNoticeSettings
     */
    function reloadMiscSystem() {
    };

    /**
     * @event command
     * @info Used for commands.
     *
     * @param {object} event
     */
    $.bind('command', function(event) {
        var sender = event.getSender(),
            command = event.getCommand(),
            args = event.getArgs(),
            action = args[0],
            subAction = args[1];

        if (command.equalsIgnoreCase('play')) {
            play(sender);
        }
    });

	/**
	 * @event initReady
	 */
	$.bind('initReady', function() {
        $.registerChatCommand('./systems/LgMiscSystem.js', 'play', 7);
    });

    /* export to the $ api */
    $.reloadMiscSystem = reloadMiscSystem;
})();
