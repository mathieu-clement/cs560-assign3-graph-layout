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
    }
}

function create_edge(u, v) {
    return new Edge(u, v);
}

function vector_norm(x, y) {
    return sqrt(x*x + y*y);
}

function fr91(W, L, V, E, iterations) {
    var area = W * L;
    var V_length = 0;
    for (var v in V) V_length++;
    var k = sqrt(area/V_length);
    var k2 = k*k;
    var fa = function(x) { return (x*x)/k; }
    var fr = function(x) { return x==0 ? 0 : k2/x; }

    var t = iterations + 1;
    var cool = function(x) { return max(x-1, 0); }

    for (var i = 0 ; i < iterations ; i++) {
        console.log('Iteration', i);

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
                    var delta_norm = vector_norm(delta_x, delta_y);
                    var ddx = delta_x == 0 ? 0 : delta_x/delta_norm;
                    var ddy = delta_y == 0 ? 0 : delta_y/delta_norm;
                    v.disp_x = v.disp_x + ddx * fr(delta_norm);
                    v.disp_y = v.disp_y + ddy * fr(delta_norm);
                }
            }
        } 

        // Calculate attractive forces
        for (var j in E) {
            var e = E[j];
            var lambda_x = e.v.pos_x - e.u.pos_x;
            var lambda_y = e.v.pos_y - e.u.pos_y;
            var lambda_norm = vector_norm(lambda_x, lambda_y);
            var llx = lambda_x == 0 ? 0 : lambda_x/lambda_norm;
            var lly = lambda_y == 0 ? 0 : lambda_y/lambda_norm;
            var ax = llx * fa(lambda_norm);
            var ay = lly * fa(lambda_norm);
            e.v.disp_x = e.v.disp_x - ax;
            e.u.disp_y = e.u.disp_y + ay;
        }

        // Limit max displacement to temperature t and 
        // prevent from displacement outside frame
        for (var j in V) {
            var v = V[j];
            var v_disp_norm = vector_norm(v.disp_x, v.disp_y);
            var ddx = v.disp_x==0 ? 0 : v.disp_x/v_disp_norm;
            var ddy = v.disp_y==0 ? 0 : v.disp_y/v_disp_norm;
            v.pos_x = v.pos_x + ddx * min(v.disp_x, t);
            v.pos_y = v.pos_y + ddy * min(v.disp_y, t);
            v.pos_x = min(W/2, max(-W/2, v.pos_x));
            v.pos_y = min(L/2, max(-L/2, v.pos_y));
        } 

        // Reduce the temperature as the layout approaches a 
        // better configuration
        t = cool(t);
    } // for i
}

function setup() {
    createCanvas(plotWidth+10, plotHeight+10);

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
    var iterations = 10;
    
    fr91(W, L, V, E, iterations);

    // Draw
    textAlign(CENTER);

    for (var i in V) {
        var v = V[i];
        var x = v.pos_x;
        var y = v.pos_y;
        //stroke(51);
        point(x, y);
        //stroke(0);
        text(v.id, x, y-5);
    }

    for (var i in E) {
        var e = E[i];
        line(e.u.pos_x, e.u.pos_y, e.v.pos_x, e.v.pos_y);
    }
}

function draw() {

}


