# PiDayServer

## API Documentation

### /othello
#### GET
Return the current game board state
#### POST
Create a new game (overwrites current game if applicable)
#### PUT
Make a move

Requires 3 items in the payload:
* player
  * 1 or 2, indicates the player making the move
* row
  * 0-7, indicates the row of the move
* col
  * 0-7, indicates the column of the move
#### DELETE
Delete the current game
