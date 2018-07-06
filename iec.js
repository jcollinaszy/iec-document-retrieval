var clusters = [];  	// results from SOM go here 

var backup = JSON.parse(JSON.stringify(clusters));
var colors = ["","#ff4d4d","#ff9999","#ffff99","#99ff66","#00ff00"];

var n = 12;				// amount of genotypes in one generation -(n<clusters.length) and (n>nR+nE)
var nR = 1;				// super mutation - number of random
var nE = 1;				// elitism - number of best 
var curGen = [n];		// current generation 
var mutationRate = 1; 	// probability of mutation occurring
var mutationStep = 3; 	// are covered by mutation
var minThreshold = 2;	// minimum of articles selected to not restart population

// rewrites user interface
function rewriteGUI() {
	$("#iec").empty();
	for (var i=0;i<n;i++) {
		$("#iec").append('<div id="iec' + i + '" class="col-sm-3 col-xs-12"><div class="panel panel-default text-center"><div class="magni"><span class="glyphicon glyphicon-zoom-in" style="color:#99ccff" aria-hidden="true"></span></div><div class="thumbnail"><a href="pdf/' + curGen[i].x + '-' + curGen[i].y + '.pdf" target="_blank"><img class="imag" src="images/' + curGen[i].x + '-' + curGen[i].y + '.jpg"></a></div><div class="rating"><button class="btn btn-default btn-1 btn-sm">1</button><button class="btn btn-default btn-2 btn-sm">2</button><button class="btn btn-default btn-3 btn-sm">3</button><button class="btn btn-default btn-4 btn-sm">4</button><button class="btn btn-default btn-5 btn-sm">5</button></div></div></div>');
		$(".btn-" + curGen[i].rating).css("background-color", colors[curGen[i].rating]);
	}
	$(".magni").mouseover(function() {
		var start = $(this).get(0).getBoundingClientRect().left + $(this).width() + 8;
		$("#pup").empty().append("<img src='" + $(this).siblings().children().children().attr('src') + "'>")
		var left = start - $("#pup").width() - $(this).parent().width()
		var right = $( document ).width() - start - $("#pup").width();
		if (right > left) {
			$("#pup").css("left",Math.floor(start) + "px");
		} else {
			$("#pup").css("left",(Math.floor(left-8)) + "px");
		}
		$("#pup").stop().fadeIn();
	});
	$(".magni").mouseout(function() {
		$("#pup").stop().fadeOut();
	});
	$("#pup").mouseover(function() {
		$(this).hide()
	});
	$(".btn-1, .btn-2, .btn-3, .btn-4, .btn-5").click(function() {
		curGen[$(this).parent().parent().parent().attr('id').substring(3)].rating = $(this).text();
		$(this).siblings().css("background-color","#E5E4E2");
		$(this).css("background-color",colors[$(this).text()]);
		selected = $(this).text();
	}).hover(function() {$(this).css("background-color",colors[$(this).text()]);},function() {
		if(curGen[$(this).parent().parent().parent().attr('id').substring(3)].rating != $(this).text()) $(this).css("background-color","#E5E4E2");
	});
}

// generates random population
function allRandom() {
	for (var i=0;i<n;i++) {
		var r = Math.floor((Math.random() * (clusters.length-1)) + 0);
		curGen[i] = {x:clusters[r].x, y:clusters[r].y, rating:1};
		clusters.splice(r,1);
	}
}

// intializes the system
function initialize() {
	clusters = JSON.parse(JSON.stringify(backup));
	allRandom();
	rewriteGUI();
}

// crossover function
function crossover(x1, y1, x2, y2) {
	x = (x1+x2)/2;
	y = (y1+y2)/2;
	return [x, y];
}

// mutation function
function mutate(x1, y1) {
	x = x1 + (Math.random() * mutationStep*2) - mutationStep;
	y = y1 + (Math.random() * mutationStep*2) - mutationStep;
	return [x, y];
}

// function responsible for creating new generation
function nextGen() {
	var newGen = [n];
	// elitism - pick best
	curGen.sort(function(a, b){return b.rating-a.rating});
	for (var i=0;i<nE;i++) {
		newGen[i] = {x:curGen[i].x, y:curGen[i].y, rating:1};
	}
	// super mutation - remove all worst
	for (var i=nE;i<curGen.length;i++) {
		if (curGen[i].rating > 1) {
			clusters.push({x:curGen[i].x, y:curGen[i].y});
		} else {
			curGen.splice(i);
			break;
		}
	}
	// if not enough rated articles - restart population
	if (curGen.length<minThreshold) {
		initialize();
		return;
	}
	// super mutation - pick random
	for (var i=nE;i<nR+nE;i++) {
		var r = Math.floor((Math.random() * (clusters.length-1)) + 0);
		newGen[i] = {x:clusters[r].x, y:clusters[r].y, rating:1};
		clusters.splice(r,1);
	}
	// initialize roulette
	var roulette = [];
	for (var i=0;i<curGen.length;i++) {
		for (var j=0;j<curGen[i].rating;j++) {
			roulette.push(i);
		}
	}
	for (var i=nE+nR;i<n;i++) {					// for each remaining slot
		// selection - pick 2 parents
		var winner1 = curGen[roulette[Math.floor((Math.random() * (roulette.length-1)) + 0)]];
		var winner2;
		do {
			winner2 = curGen[roulette[Math.floor((Math.random() * (roulette.length-1)) + 0)]];
		} while (winner1==winner2);
		// crossover
		var child = crossover(winner1.x,winner1.y,winner2.x,winner2.y);
		// mutation
		if (Math.random() < mutationRate) {
			child = mutate(child[0], child[1]);
		}
		// find genotype closest to child
		var min = 50;
		var winner;
		for (var j=0;j<clusters.length;j++) {
			var distance = Math.sqrt(Math.pow(child[0]-clusters[j].x, 2) + Math.pow(child[1]-clusters[j].y, 2));
			if (distance<min) {
				min = distance;
				newGen[i] = {x:clusters[j].x, y:clusters[j].y, rating:1};
				winner = j;
			}
		}
		clusters.splice(winner,1);
	}
	curGen = JSON.parse(JSON.stringify(newGen));
	rewriteGUI();
}

$(document).ready(function(){
	initialize();
});