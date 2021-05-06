# SPEECH GAME

## Table of Contents 
* [Demo](#demo)
* [About the Project](#about-the-project)
* [Technologies](#technologies)
* [Setup](#setup)

## Demo

Here is a working live demo : 

Please preferably use Google Chrome.

## About the Project

In this game, you should find a name that starts with the last letter of the computer's word. A successfull sequence would be: Tom > Marshall > Lizzy > York ...

### Game Settings

You can play this game with computer(Tom). Before you play, you can select the difficulty(Easy, Normal, Hard, Master). Each difficulty has different probabilities that computer responds your speech. At Easy mode, Tom can respond with 0.7 probability. Also Medium (0.8), Hard(0.9) and Master(0.95).

You can select language. You can play with this game in Turkish or English.

You can select the time (in seconds) in order to think your respond.

The default configuration is: Normal, Turkish and 8 seconds.

Before the game starts, the browser asks you to enable your microphone.

### Game Rules

1. You have to say name that starts with the last letter of the name that Tom's said. Tom starts the game.
2. You can only say names. 'Bilgisayar' or 'Television' do not count.
3. You cannot say the name that you said before, Tom either.
4. You have to say a name before the timer runs out.

## Technologies
* React version: 17.0.1
* Material UI Core version: 4.11.3
* Web Speech API

## Setup 

To run this project, install it locally using npm:

```
$ cd ../speech-game
$ npm install
$ npm start
```
