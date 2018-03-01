var egoNode; // 0, 107, 348, 414, 686, 698, 1684, 1912, 3437, 3980...
var table; // data loaded from csv
var adj = { }; // adjacency list. adj[3] = [5, 7] means there is an edge
               // from 3 to 5, and from 3 to 7
               // Guarantee: adj[x].contains(y) == adj[y].contains(x)
var numVertices = 0;

var plotHeight;
var plotWidth;
var margin = 100;
var cellWidth = 15;
var cellHeight = 15;

function preload() {
    // Change ego node by suffixing URL with egoNode=123
    var pEgoNode = getURLParams().egoNode;
    if (pEgoNode) {
        egoNode = int(pEgoNode);
    } else {
        egoNode = 698; // default
    }
    table = loadTable('../data/facebook/' + egoNode + '.edges.csv', 'csv');
}

function unique_array(arr) {
    var uniqueArr = [];
    for (var i = 0 ; i < arr.length ; i++) {
        if (uniqueArr.indexOf(arr[i]) < 0) { // not contains
            uniqueArr.push(arr[i]);
        }
    }
    return uniqueArr;
}

function int_array(arr) {
    var intArr = [];
    for (var i = 0 ; i < arr.length ; i++) {
        intArr[i] = int(arr[i]);
    }
    return intArr;
}

function setup() {
    // Prepare data
    var rows = table.getRows();

    for (var i = 0 ; i < rows.length ; i++) {
        var u_id = int(rows[i].getNum(0));
        var v_id = int(rows[i].getNum(1));
        // Update adjacency matrix
        if (!adj.hasOwnProperty(u_id)) 
            adj[u_id] = [];
        adj[u_id].push(v_id);
        if (!adj.hasOwnProperty(v_id)) 
            adj[v_id] = [];
        adj[v_id].push(u_id);
    }

    // Create an edge from each of the other vertices to the ego node
    adj[egoNode] = [];
    for (var i in adj) {
        var u_id = int(i);
        if (u_id == egoNode) continue;
        if (!adj.hasOwnProperty(u_id))
            adj[u_id] = [];
        adj[u_id].push(egoNode);
        adj[egoNode].push(u_id);
    }
    console.log('adj', adj);

    for (var i in Object.keys(adj)) numVertices++;
    console.log('vertices', numVertices);

    // plotHeight = windowHeight;
    // plotWidth = windowWidth;
    plotHeight = margin*2 + numVertices * cellHeight;
    plotWidth = margin*2 + numVertices * cellWidth;
    createCanvas(plotWidth, plotHeight);

    //frameRate(24);
    noLoop();

    noSmooth();

    angleMode(DEGREES);
}

function draw() {
    background(255);
    push();

    var matrixWidth = plotWidth - margin * 2;
    var matrixHeight = plotHeight - margin * 2;
    //var cellWidth = matrixWidth / numVertices;
    //var cellHeight = matrixHeight / numVertices;

    var x = margin;
    var y = margin;

    textAlign(RIGHT);
    textSize(9);

    // left column
    for (var i in adj) {
        text(i, x - 5, y + cellHeight*0.66);
        line (x, y, x, y + cellHeight);

        y += cellHeight;
    }
    
    // right column
    textAlign(LEFT);
    x = margin + numVertices * cellWidth;
    y = margin;
    for (var i in adj) {
        text(i, x + 5, y + cellHeight*0.66);
        y += cellHeight;
    }

    x = y = margin;
    textAlign(LEFT);

    // top row
    for (var i in adj) {
        rotate(-90);
        text(i, -y+5, x + cellWidth*0.66);
        rotate(90);
        line(x, y, x + cellWidth, y);

        x += cellWidth;
    }

    // bottom row
    x = margin;
    y = margin + numVertices * cellHeight;
    textAlign(RIGHT);
    for (var i in adj) {
        rotate(-90);
        text(i, -y-5, x + cellWidth*0.66);
        rotate(90);

        x += cellWidth;
    }

    x = y = margin;

    for (var i in adj) {
        x = margin;

        for (var j in adj) {
            if (adj[i].includes(int(j))) {
                console.log('Edge from ' + j + ' to ' + i);
                fill(0, 128, 0);
            } else {
                noFill();
            }
            rect(x, y, cellWidth, cellHeight);
            x += cellWidth;
        }

        y += cellHeight;
    }

    x = y = margin;

    pop();
}

//function mouseMoved() {
//    redraw();
//    push();
//    // TODO Interactivity
//    pop();
//}
