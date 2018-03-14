// Utilities and helpers
const fs = require('fs');

function readFile(fileName) {
    try {
        return fs.readFileSync(__dirname + "/games/" + fileName, "utf8");
    } catch (err) {
        return false;
    }
}

function writeFile(fileName, contents) {
    fs.writeFileSync(__dirname + "/games/" + fileName, contents);
}

function deleteFile(fileName) {
    fs.unlinkSync(__dirname + "/games/" + fileName);
}

////////////////////////////////////////////////////////////////
// Hapi Server

// Require the Hapi module
const Hapi = require('hapi');
const Joi = require('joi');
const Boom = require('boom');

// Create a new Hapi server
const server = new Hapi.Server();

// Configure the port on which the server will listen
server.connection({ port: 3000 });

// Define routes
server.route([
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply('server is running');
        }
    },

    /** Othello **/
    {
        method: 'GET',
        path: '/othello',
        handler: function(request, reply) {
            const fileOutput = readFile("othello.txt");
            if (!fileOutput) {
                reply(Boom.notFound('There is not currently a game in progress'));
            } else {
                reply(fileOutput);
            }
        }
    },
    {
        method: 'POST',
        path: '/othello',
        handler: function(request, reply) {
            const startingBoard = "00000000\n00000000\n00000000\n00021000\n00012000\n00000000\n00000000\n00000000";
            writeFile("othello.txt", startingBoard);
            reply("New game created");
        }
    },
    {
        method: 'PUT',
        path: '/othello',
        config: {
            validate: {
                payload: {
                    player: Joi.number().integer().min(1).max(2).required(),
                    row: Joi.number().integer().min(0).max(7).required(),
                    col: Joi.number().integer().min(0).max(7).required()
                }
            }
        },
        handler: function(request, reply) {
            const fileName = "othello.txt";
            var fileOutput = readFile(fileName);
            if (!fileOutput) {
                reply(Boom.notFound("There is not currently a game in progress"));
                return;
            }
            const strIndex = request.payload.row * 9 + request.payload.col;
            fileOutput = fileOutput.substring(0, strIndex) + request.payload.player + fileOutput.substring(strIndex + 1, fileOutput.length);
            writeFile(fileName, fileOutput);
            reply(request.payload.player == 1 ? 2 : 1);
        }
    },
    {
        method: 'DELETE',
        path: '/othello',
        handler: function(request, reply) {
            deleteFile("othello.txt");
            reply("Game deleted");
        }
    },

    /** Tic Tac Toe **/
    {
        method: 'GET',
        path: '/ttc',
        handler: function(request, reply) {
            const fileOutput = readFile("ttc.txt");
            if (!fileOutput) {
                reply(Boom.notFound('There is not currently a game in progress'));
            } else {
                reply(fileOutput);
            }
        }
    },
    {
        method: 'POST',
        path: '/ttc',
        handler: function(request, reply) {
            const startingBoard = "000\n000\n000";
            writeFile("ttc.txt", startingBoard);
            reply("New game created");
        }
    },
    {
        method: 'PUT',
        path: '/ttc',
        config: {
            validate: {
                payload: {
                    player: Joi.number().integer().min(1).max(2).required(),
                    row: Joi.number().integer().min(0).max(2).required(),
                    col: Joi.number().integer().min(0).max(2).required()
                }
            }
        },
        handler: function(request, reply) {
            const fileName = "ttc.txt";
            var fileOutput = readFile(fileName);
            if (!fileOutput) {
                reply(Boom.notFound("There is not currently a game in progress"));
                return;
            }
            const strIndex = request.payload.row * 4 + request.payload.col;
            fileOutput = fileOutput.substring(0, strIndex) + request.payload.player + fileOutput.substring(strIndex + 1, fileOutput.length);
            writeFile(fileName, fileOutput);
            reply(request.payload.player == 1 ? 2 : 1);
        }
    },
    {
        method: 'DELETE',
        path: '/ttc',
        handler: function(request, reply) {
            deleteFile("ttc.txt");
            reply("Game deleted");
        }
    },

    /** Connect Four **/
    {
        method: 'GET',
        path: '/connect4',
        handler: function(request, reply) {
            const fileOutput = readFile("connect4.txt");
            if (!fileOutput) {
                reply(Boom.notFound('There is not currently a game in progress'));
            } else {
                reply(fileOutput);
            }
        }
    },
    {
        method: 'POST',
        path: '/connect4',
        handler: function(request, reply) {
            const startingBoard = "0000000\n0000000\n0000000\n0000000\n0000000\n0000000";
            writeFile("connect4.txt", startingBoard);
            reply("New game created");
        }
    },
    {
        method: 'PUT',
        path: '/connect4',
        config: {
            validate: {
                payload: {
                    player: Joi.number().integer().min(1).max(2).required(),
                    row: Joi.number().integer().min(0).max(5).required(),
                    col: Joi.number().integer().min(0).max(6).required()
                }
            }
        },
        handler: function(request, reply) {
            const fileName = "connect4.txt";
            var fileOutput = readFile(fileName);
            if (!fileOutput) {
                reply(Boom.notFound("There is not currently a game in progress"));
                return;
            }
            const strIndex = request.payload.row * 8 + request.payload.col;
            fileOutput = fileOutput.substring(0, strIndex) + request.payload.player + fileOutput.substring(strIndex + 1, fileOutput.length);
            writeFile(fileName, fileOutput);
            reply(request.payload.player == 1 ? 2 : 1);
        }
    },
    {
        method: 'DELETE',
        path: '/connect4',
        handler: function(request, reply) {
            deleteFile("connect4.txt");
            reply("Game deleted");
        }
    },
]);

// Serve!
server.start(err => {
    if (err) {
        throw err;
    }
    console.log('Server running at', server.info.uri);
});
