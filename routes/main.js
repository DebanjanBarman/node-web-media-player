var log      = require('../lib/logger'),
    passport = require('passport'),
    path     = require('path'),
    player   = require('../lib/player');

exports.setRoutes = function(app, config, listen) {
    player.setConfig(config.player);

    app.get('/', app.ensureAuthenticated, function(req, res) {
        res.redirect(config.app.namespace + '/browse');
    });

    app.get('/browse', app.ensureAuthenticated, function(req, res) {
        // res.send(player.getBrowseData(''));
        res.render('index.html', player.getBrowseData(''));
    });

    app.get('/browse/*', app.ensureAuthenticated, function(req, res) {
        res.render('index.html', player.getBrowseData(req.params[0]));
    });

    app.get('/play/*', app.ensureAuthenticated, function(req, res) {
        var filePath = player.validatePath(req.params[0], true);
        player.playFile(filePath, function() {
            res.redirect(302, config.app.namespace + '/browse/' + path.dirname(filePath.rel));
        });
    });

    app.get('/control/:command', app.ensureAuthenticated, function(req, res) {
        player.sendCommand(req.params.command, function() {
            res.redirect(req.header('Referer'));
        }, req.query);
    });

    require('./auth').setRoutes(app, config);

    listen();
};
