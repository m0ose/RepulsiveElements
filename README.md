# RepulsiveElements
Move elements away from the mouse
Cody Smith 2020


## Example ##
    A (demo)[https://m0ose.gihubio.com/RepulsiveElements] is worth a thousand words. 

## Usage ##
``` javascript
new RepulsiveElements(document.getElementById('someElement')) 
```

## Options ##
* textSplitter: "", change the striing to splt text by. empty string splits up every letter. 
* friction: 0.09, How fast the element returns to it's origin. 
* springK: 1, Spring factor. 
* mouseK: 0.1, Mouse repulsion factor. 0 turns it off. 
* scrollK: 0.3, How much to bounce when you scroll. 0 is off. 1 is on. 

