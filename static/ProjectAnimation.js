import anime from '/static/anime-master/lib/anime.es.js';


var entireArray = [];
var currentArray = [];
var currentIndex = 0;
var entireIndex = 0;
var blur = false;
var highlightBoxes = new Map(); // highlights list
var currentChange = 0;
var startingRGB = [173, 241, 210];
var endingRGB = [96, 87, 112];
var startingHSL = [Math.random() * 360, Math.random() * 100, Math.random() * 100];
var endingHSL = [Math.random() * 360, Math.random() * 100, Math.random() * 100];
var time = 250;
var pauseThing = false;

function delay(time) {
/**
* delay function
*/
     return new Promise(resolve => setTimeout(resolve, time));
}

async function getList () {
/**
* Fetches the current array, index, and change to the previous index.
* I'll add return values when I learn how to do that well
*/
    if (currentIndex != -1){
        try {
            const setUpFetch = await fetch('/quick');
            const text = await setUpFetch.json();
            entireArray = text;
            currentIndex = 0;
        } catch (error) {
            console.error(error);
        }
    }
}


async function getIndividualArrayAndIndex() {
    if (entireIndex < entireArray.length){
        currentArray = entireArray[entireIndex][0];
        currentIndex = entireArray[entireIndex][1];
    }
    else {currentIndex = -1;}
    entireIndex += 1;
}

function createContainer() {
/**
* Creates the container holding all of the gradient elements, as well as the gradient
* elements themselves
*/
    var container = document.getElementById('container');
//    var colourChangeR = endingRGB[0] - startingRGB[0];
//    var colourChangeG = endingRGB[1] - startingRGB[1];
//    var colourChangeB = endingRGB[2] - startingRGB[2];
    var colourChangeR = endingHSL[0] - startingHSL[0];
    var colourChangeG = endingHSL[1] - startingHSL[1];
    var colourChangeB = endingHSL[2] - startingHSL[2];
    if (colourChangeR < 180) {
        colourChangeR = -colourChangeR;
    }
    container.style.backgroundColor = 'hsl(' + (endingHSL[0] - (colourChangeR / 2)) % 360 + ',' +
        (endingHSL[1] - (colourChangeR / 2)) + '%,' + (endingHSL[2] - (colourChangeR / 2)) + '%)';
    // creates all of the skewLines
    for (let i = 0; i < currentArray.length; i++) {
        const box = document.createElement('div');
        box.id = "box" + i;
        box.className = 'skewLines';
        box.style.width = 100/currentArray.length + '%';
        const boxOverlap = document.createElement('div');
        boxOverlap.className = 'skewOverlap';
        const colourBox = document.createElement('div');
        colourBox.id = 'colourBox' + i;
        colourBox.className = 'skewColours';
//        colourBox.style.backgroundColor = 'rgb(' + (endingRGB[0] - (colourChangeR / currentArray.length * currentArray[i][1])) + ',' +
//        (endingRGB[1] - (colourChangeG / currentArray.length * currentArray[i][1])) + ',' +
//        (endingRGB[2] - (colourChangeB / currentArray.length * currentArray[i][1])) + ')';
        colourBox.style.backgroundColor = 'hsl(' + (endingHSL[0] - (colourChangeR / currentArray.length * currentArray[i][1])) % 360 + ',' +
        (endingHSL[1] - (colourChangeG / currentArray.length * currentArray[i][1])) + '%,' +
        (endingHSL[2] - (colourChangeB / currentArray.length * currentArray[i][1])) + '%)';
        boxOverlap.append(colourBox);
        box.append(boxOverlap);
        if (entireArray[0].length > 2) {
            const blurBox = document.createElement('div');
            blurBox.id = "blurBox" + i;
            blurBox.className = 'blurBox';
            blurBox.style.zIndex = "10000";
            boxOverlap.append(blurBox);
            blur = true;
        }
        container.appendChild(box);
    }
   container.style.backgroundColor = 'hsl(' + (endingHSL[0] - (colourChangeR / 2)) + ',' +
   (endingHSL[1] - (colourChangeG / 2)) + '%,' +
   (endingHSL[2] - (colourChangeB / 2)) + '%)';
}

async function fullSetUp() {
/**
* Creates the initial container populated with the gradient elements
*/
    await getList();
    await getIndividualArrayAndIndex();
    await createContainer();
    var x = document.createElement("INPUT");
    x.setAttribute("type", "button");
    x.addEventListener("click", pauseFunct);
    x.style.position = "absolute";
    x.style.width = "100px";
    x.style.height = "100px";
    document.body.appendChild(x);
}

function pauseFunct() {
    if (pauseThing == false) {
        pauseThing = true;
    }
    else {
        pauseThing = false;
        iterate();
    }
}

async function iterate() {

    if(pauseThing == true) {
        return
    }
    
    getIndividualArrayAndIndex();
    if (currentIndex == -1) {
        return
    }
    var animatedSkewLines = []
    // get every node which has a change
    for (let x = 0; x < currentArray.length; x++) {
        if (currentArray[x][2] != 0) {
        animatedSkewLines.push(currentArray[x]);
        }
        // push highlight nodes
        if (currentArray[x][4] != 0) {
            highlightBoxes.set(currentArray[x][4], currentArray[x][0]);
        }
    }
    // see if there are highlight boxes for everything, if not create new ones
    // make a timeline to add everything to
    var animatedTimeline = anime.timeline({
    endDelay: 0
    });
    var longTime = 0;
    // reference box
    var firstBox = document.getElementById('box0');
    // stats for each box
    var boxWidth = window.getComputedStyle(firstBox, null).getPropertyValue("width");
    boxWidth = boxWidth.slice(0, -2);
    var boxWidth2 = boxWidth - 10;
    var boxHeight = window.getComputedStyle(firstBox, null).getPropertyValue("height");
    boxHeight = boxHeight.slice(0, -2);
    var boxHeight2 = boxHeight - 10;

    for (let y = 0; y < animatedSkewLines.length; y++) {
        var currentNode = animatedSkewLines[y];
        // grab the previous translateX value of the box
        var previousTranslateX = document.getElementById('box' + currentNode[0]).style.transform;
        previousTranslateX = previousTranslateX.slice(11, -2);
        previousTranslateX = previousTranslateX / 100;
        // find max group
        if (currentNode[3] > longTime) {
            longTime = currentNode[3] + 1;
        }
        var newTime = time * currentNode[3];
        // if it's the "index node", then have a special animation
        if (currentNode[3] == 0) {
            document.getElementById('box' + currentNode[0]).style.zIndex='1000';
            animatedTimeline.add({
                targets: '#box' + currentNode[0],
                translateX: currentNode[2] + previousTranslateX + '00%',
                easing: 'easeInOutQuad',
                duration: time * Math.abs(currentNode[2]),
            }, time);
        }
        // all other moving boxes have the shortened animation based on their grouping
        else {
            document.getElementById('box' + currentNode[0]).style.zIndex='10';
            animatedTimeline.add({
                targets: '#box' + currentNode[0],
                translateX: currentNode[2] + previousTranslateX + '00%',
                duration: time,
                easing: 'easeInOutQuint'
            }, newTime)
        }
    }
    // get rid of the blurs of every box within the "sorting range", if it exists:
    if (blur) {
        if (entireIndex < entireArray.length) {
            for (let i = 0; i < currentArray.length; i++) {
                if (entireArray[entireIndex][2] <= currentArray[i][1] && currentArray[i][1] <= entireArray[entireIndex][3]) {
                    animatedTimeline.add({
                        targets: '#blurBox' + currentArray[i][0],
                        opacity: 0,
                        duration: 100,
                        easing: 'linear'
                    }, time);
                }
                else {
                    animatedTimeline.add({
                        targets: '#blurBox' + currentArray[i][0],
                        opacity: 0.5,
                        duration: 100,
                        easing: 'linear'
                    }, time);
                }
            }
        }
        else {
            for (let i = 0; i < currentArray.length; i++) {
                animatedTimeline.add({
                    targets: '#blurBox' + currentArray[i][0],
                    opacity: 0,
                    duration: 100,
                    easing: 'linear'
                }, time);
            }
        }
    }
    // grab every box with a highlight and animate it
    var background = document.getElementById('colourBox' + (currentIndex)).style.backgroundColor;
    var currentBox = document.getElementById('box' + (currentIndex));
    var boxNodeInfo = [];
    var backgrounds = [];
    var boxes = [];
    var colourBoxes = [];
    // push all the info about the boxes with highlights
    for (let i = 0; i < currentArray.length; i++) {
        if (currentArray[i][4] != -1) {
            boxNodeInfo.push([currentArray[i][0], currentArray[i][4]]);
            backgrounds.push(document.getElementById('colourBox' + currentArray[i][0]).style.backgroundColor);
            boxes.push(document.getElementById('box' + currentArray[i][0]));
            colourBoxes.push(document.getElementById('colourBox' + currentArray[i][0]));
        }
    }
    // highlights
    for (let i = 0; i < boxNodeInfo.length; i++) {
        // highlights in
        animatedTimeline.add({
            begin: function (anim) {
                boxes[i].style.backgroundColor='rgb(' + boxNodeInfo[i][1] + ", " + boxNodeInfo[i][1] + ", " + boxNodeInfo[i][1] + ")";
            },
            targets: '#colourBox' + boxNodeInfo[i][0],
            scale: ["1, 1", boxWidth2/boxWidth + ", " + boxHeight2/boxHeight],
            duration: time * 2,
        }, 0);
        // highlights out
        animatedTimeline.add({
            targets: '#colourBox' + boxNodeInfo[i][0],
            scale: [boxWidth2/boxWidth + ", " + boxHeight2/boxHeight, "1, 1"],
            duration: time,
            easing: "easeOutQuint",
            complete: function (anim) {
                boxes[i].style.backgroundColor=backgrounds[i];
                colourBoxes[i].style.transform = '';
            }
        }, time * Math.max(longTime, 1));
    }
    // reset z indices
    animatedTimeline.add({
        complete: function (anim) {
            for (let i = 0; i < currentArray.length; i ++) {
                document.getElementById('box' + i).style.zIndex='0';
            }
            iterate()
        },
        duration: 0
        }, time * Math.max(longTime + 1, 2));
    // play the timeline
    animatedTimeline.play();
}

async function doEverything() {
    await fullSetUp();
    console.log(entireArray);
    entireIndex = 0;
//    var container = document.getElementById('container');
//    while (currentIndex != -1) {
//        while (container.lastElementChild) {
//            container.removeChild(container.lastElementChild);
//        }
//        await fullSetUp();
//        await iterate();
//        await delay(700);
//    }
    await iterate();
}

doEverything();
