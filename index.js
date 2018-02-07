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
server.connection({ port: 3000});

// Define routes
server.route([
    {
        method: 'GET',
        path: '/',
        handler: function(request, reply) {
            reply('server is running');
        }
    },
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
]);

// Serve!
server.start(err => {
    if (err) {
        throw err;
    }
    console.log('Server running at', server.info.uri);
});
