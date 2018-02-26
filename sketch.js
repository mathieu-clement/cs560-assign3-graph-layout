var table; // data loaded from csv
var vertices = { };
var edges = [ ];
var iteration = 0;
var iterations = 100;

var plotWidth = 1200;
var t = plotWidth / 10;

function preload() {
    table = loadTable('/data/facebook/3980.edges.csv', 'csv');
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

var plotHeight = 600;

class Vertex {
    constructor(id) {
        this.id = id;
        this.disp_x = 0;
        this.disp_y = 0;
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
        // color
        this.r = random(256);
        this.g = random(256);
        this.b = random(256);
    }
}

function create_edge(u, v) {
    return new Edge(u, v);
}

function vector_norm(x, y) {
    return sqrt(x*x + y*y);
}

function fr91(W, L, V, E) {
    var area = W * L;
    var V_length = 0;
    for (var v in V) V_length++;
    var k = sqrt(area/V_length);
    var k2 = k*k;
    var fa = function(x) { return x*x/k; }
    var fr = function(x) { return x==0 ? 0 : k2/x; }

    var cool = function(x) { return t - t/(iteration+2); }

    // Calculate repulsive forces
    for (var j in V) {
        var v = V[j];
        v.disp_x = 0;
        v.disp_y = 0;
        for (var l in V) {
            if (j != l) {
                var u = V[l];
                var delta_x = v.pos_x - u.pos_x;
                var delta_y = v.pos_y - u.pos_y;
                var dist = vector_norm(delta_x, delta_y);
                if (dist > 0) {
                    v.disp_x = v.disp_x + delta_x/dist * fr(dist);
                    v.disp_y = v.disp_y + delta_y/dist * fr(dist);
                }
            }
        }
    } 

    // Calculate attractive forces
    for (var j in E) {
        var e = E[j];
        var lambda_x = e.v.pos_x - e.u.pos_x;
        var lambda_y = e.v.pos_y - e.u.pos_y;
        var dist = vector_norm(lambda_x, lambda_y);
        if (dist > 0) {
            var ax = lambda_x/dist * fa(dist);
            var ay = lambda_y/dist * fa(dist);
            e.v.disp_x -= ax;
            e.v.disp_y -= ay;
            e.u.disp_x += ax;
            e.u.disp_y += ay;
        }
    }

    // Limit max displacement to temperature t and 
    // prevent from displacement outside frame
    for (var j in V) {
        var v = V[j];
        var v_disp_norm = vector_norm(v.disp_x, v.disp_y);
        if (v_disp_norm > 0) {
            var ddx = v.disp_x/v_disp_norm;
            var ddy = v.disp_y/v_disp_norm;
            v.pos_x += ddx * min(v_disp_norm, t);
            v.pos_y += ddy * min(v_disp_norm, t);

            //var x = v.pos_x;
            //var y = v.pos_y;
            //x = min(W,max(0,x)) - W/2;
            //y =  min(L,max(0,y)) - L/2;
            //v.pos_x = min(sqrt(W*W/4-y*y),max(-sqrt(W*W/4-y*y),x)) + W/2
            //v.pos_y = min(sqrt(L*L/4-x*x),max(-sqrt(L*L/4-x*x),y)) + L/2
            //v.pos_x = min(W/2, max(-W/2, v.pos_x));
            //v.pos_y = min(L/2, max(-L/2, v.pos_y));
        }
    } 

    // Reduce the temperature as the layout approaches a 
    // better configuration
    t = cool(t);
}

function setup() {
    createCanvas(plotWidth+10, plotHeight+10);
    //randomSeed(400);

    frameRate(24);

    // Prepare data
    var rows = table.getRows();

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

}

function draw() {
    background(255);

    // Execute algorithm
    var W = plotWidth;
    var L = plotHeight;
    var V = vertices;
    var E = edges;
    
    if (t > 0 && iteration < iterations) {
        fr91(W, L, V, E);
        iteration++;
    } else {
        noLoop();
    }

    // Draw
    textAlign(CENTER);

    for (var i in V) {
        var v = V[i];
        var x = v.pos_x;
        var y = v.pos_y;
        point(x, y);
        text(v.id, x, y-5);
    }

    for (var i in E) {
        var e = E[i];
        stroke(e.r, e.g, e.b);
        line(e.u.pos_x, e.u.pos_y, e.v.pos_x, e.v.pos_y);
    }
    stroke(0);

    console.log('V[1]', V[1]);

}


