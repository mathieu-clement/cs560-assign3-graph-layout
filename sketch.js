var table; // data loaded from csv

function preload() {
    table = loadTable('/data/facebook/0.edges.csv', 'csv');
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

var plotWidth = 1500;
var plotHeight = 1000 ;

class Vertex {
    constructor(id) {
        this.id = id;
        this.pos = 0;
        this.disp = 0;
        this.pos_x = int(random(plotWidth));
        this.pos_y = int(random(plotHeight));
    }
}

function create_vertex(id) {
    return new Vertex(id);
}

class Edge {
    constructor(u, v) {
        this.u = u;
        this.v = v;
    }
}

function create_edge(u, v) {
    return new Edge(u, v);
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
        for (var j in V) {
            var v = V[j];
            v.disp = 0;
            for (var u in V) {
                if (u != v) {
                    var delta = v.pos - u.pos;
                    v.disp = v.disp + (delta/abs(delta)) * fr(abs(delta));
                }
            }
        } 

        // Calculate attractive forces
        for (var j in E) {
            var e = E[j];
            var lambda = e.v.pos - e.u.pos;
            var a = (lambda/abs(lambda)) * fa(abs(lambda));
            e.v.disp = e.v.disp - a;
            e.u.disp = e.u.disp + a;
        }

        // Limit max displacement to temperature t and 
        // prevent from displacement outside frame
        for (var j in V) {
            var v = V[j];
            v.pos = v.pos + (v.disp/abs(v.disp)) * min(v.disp, t);
            v.pos_x = min(W/2, max(-W/2, v.pos_x));
            v.pos_y = min(L/2, max(-L/2, v.pos_y));
        } 

        // Reduce the temperature as the layout approaches a 
        // better configuration
        t = cool(t);
    } // for i
}

function setup() {
    createCanvas(plotHeight+10, plotWidth+10);

    //frameRate(10);
    noLoop();

    // Prepare data
    var rows = table.getRows();
    var vertices = { };
    var edges = [ ];

    for (var i = 0 ; i < rows.length ; i++) {
        var u_id = int(rows[i].getNum(0));
        var v_id = int(rows[i].getNum(1));
        if (!vertices.hasOwnProperty(u_id)) {
            vertices[u_id] = create_vertex(u_id);
        }
        if (!vertices.hasOwnProperty(v_id)) {
            vertices[v_id] = create_vertex(v_id);
        }

        var u = vertices[u_id];
        var v = vertices[v_id];
        edges.push(create_edge(u, v));
    }

    // Execute algorithm
    var W = plotWidth;
    var L = plotHeight;
    var V = vertices;
    var E = edges;
    var iterations = 100;
    
    fr91(W, L, V, E, iterations);
    
    console.log('V[1]', V[1]);
    console.log('E[0]', E[0]);

    // Draw
    textAlign(CENTER);

    for (var i in V) {
        var v = V[i];
        var x = v.pos_x;
        var y = v.pos_y;
        stroke(51);
        point(x, y);
        stroke(1);
        text(v.id, x, y-5);
    }

    for (var i in E) {
        var e = E[i];
        line(e.u.pos_x, e.u.pos_y, e.v.pos_x, e.v.pos_y);
    }
}

function draw() {

}


