var table; // data loaded from csv

function preload() {
    table = loadTable('data/facebook/0.edges.csv', 'csv');
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

var leftMargin = 100;
var topMargin = 50;

var plotHeight = 350;
var plotWidth = 500;

function setup() {
    createCanvas(plotHeight+leftMargin+100, plotWidth+topMargin+100);

    frameRate(10);

    var v = {
        .pos = 0,
        .disp = 0,
        .pos_x = 0, // start with random
        .pos_y = 0 // start with random
    };

    var e  = {
        .u = ...,
        .v = ...
    };
}

function fr91(W, L, V, E, iterations) {
    var area = W * L;
    var k = sqrt(area/V.length);
    var fa = function(x) { return (x*x)/k; }
    var fr = function(x) { return (k*k)/x; }

    var t = iterations + 1;
    var cool = function(t) { return max(t-1, 0); }

    for (var i = 0 ; i < iterations ; i++) {
        // Calculate repulsive forces
        for (var j = 0 ; j < V.length ; j++) { // for v in V
            var v = V[j];
            v.disp = 0;
            for (var l = 0 ; l < V.length ; l++) {
                var u = V[l];
                if (l != j) { // if u != v
                    var delta = v.pos - u.pos;
                    v.disp = v.disp + (delta/abs(delta)) * fr(abs(delta));
                } // if u != v
            } // for u in V
        } // for v in V

        // Calculate attractive forces
        for (var j = 0 ; j < E.length ; j++) { // for e in E
            var e = E[j];
            var lambda = e.v.pos - e.u.pos;
            var a = (lambda/abs(lambda)) * fa(abs(lambda));
            e.v.disp = e.v.disp - a;
            e.u.disp = e.u.disp + a;
        } // for e in E

        // Limit max displacement to temperature t and 
        // prevent from displacement outside frame
        for (var j = 0 ; j < V.length ; j++) { // for v in V
            var v = V[j];
            v.pos = v.pos + (v.disp/abs(v.disp)) * min(v.disp, t);
            v.pos_x = min(W/2, max(-W/2, v.pos_x));
            v.pos_y = min(L/2, max(-L/2, v.pos_y));
        } // for v in V

        // Reduce the temperature as the layout approaches a 
        // better configuration
        t = cool(t);
    } // for i
}

function draw() {
    background(255);

    
}
