# Path Planning

## Find the Shortest Path Through a Maze

This is a demo of Algorithmia's [Maze Generator](https://algorithmia.com/algorithms/kenny/MazeGen) and [Dijkstra](https://algorithmia.com/algorithms/kenny/Dijkstra) algorithms. First, a maze is generated with [Recursive Backtracking Search](http://en.wikipedia.org/wiki/Backtracking), then we use [Dijkstra's Algorithm](http://en.wikipedia.org/wiki/Dijkstra's_algorithm) to find the shortest path through the maze

## See this demo in action

This demo can be viewed at https://algorithmia.com/demo/pathplan

## Run it yourself

This demo only contains frontend code and requires no specialized hosting (or even a server).

1. download the repository
2. edit **/JavaScript/pathplan/public/js/main.js** to place [your own API Key](https://algorithmia.com/user#credentials) (free [signup](https://algorithmia.com/?invite=ghsamples) w/ 5k credits monthly) in the line containing `Algorithmia.client`
4. if you have not already, run the **setup** steps outlined in [/PUBLISH.md](../../PUBLISH.md)
5. build the demo: `grunt build:pathplan`
6. open **/build/pathplan/index.html** in a web browser
 Find more information in the [Algorithmia Developer Center](http://developers.algorithmia.com) or the [API Docs](http://docs.algorithmia.com/).