#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <float.h>
#include <math.h>
#include <time.h>

#define wMin 0 // minimum value for random weights initialization
#define wMax 675 // maximum value for random weights initialization

#define top_x 5 // map topology x
#define top_y 5 // map topology y
#define epochs 100 // number of learning cycles
#define gamma 0.02 // learning parameter
#define radius 3.0 // radius for neighborhood function

#define samples 60 // number of training samples
#define inputs 9518 // number of inputs
#define trainFile "txt3/train.txt" // training set file path
int train[samples][inputs] = {0}; // training set

double w[top_x][top_y][inputs]; // weights
#define w(i,j,in) w[i][j][in]

#define logFile "log.txt" // log file path
#define visualFile "visual.txt" // visualization file path

#define saveWeights 0 // switch - save learned weights into file
#define loadWeights 0 // switch - load weights from file (Not Implemented Yet)
#define weightsFile "weights.txt" // weights file path

// -------------------------------------------------------------- READ TRAINING SET
void readTrainingSet() {
    int l = 0;
    int i = 0;
    char ch;

    FILE *fp = fopen(trainFile,"r");
    if( fp == NULL ) {
        perror("Error while opening the file.\n");
        exit(EXIT_FAILURE);
    }

    while( ( ch = fgetc(fp) ) != EOF ) {
        if (ch == '\n') {
   			l = l + 1;
   			i = 0;
        } else if (ch == ' ') {
   			i = i + 1;
		} else {
            train[l][i] = ( train[l][i] * 10 ) + ( ch - 48 );
		}
    }
    fclose(fp);
}

// -------------------------------------------------------------- RANDOM WEIGHTS INIT
void wInit() {
	time_t t;
	srand((unsigned) time(&t));
	for(int i=0; i<top_x; i++) for(int j=0; j<top_y; j++) for(int in=0; in<inputs; in++) w(i,j,in) = rand() / (RAND_MAX/(wMax-wMin)) + wMin;
}

// -------------------------------------------------------------- CHANGE WEIGHTS
void changeWeights(int input[],double g ,double r, FILE *log, FILE *visual) {
    // --- find winner
	int winner[2] = {0};
	double min = DBL_MAX;
	for(int i=0; i<top_x; i++) for(int j=0; j<top_y; j++) {
		double d = 0;
		for(int in=0; in<inputs; in++) {
			d = d + pow(w(i,j,in)-input[in],2);
		}
		if (d < min) {
        	min = d;
        	winner[0] = i;
        	winner[1] = j;
   		}
	}
	fprintf(log, "%4d   %4d   %f\n", winner[0], winner[1], min);
    fprintf(visual, "%d %d ", winner[0], winner[1]);
	// --- change weights
	double distance;
    double neighborF;
    for(int i=0; i<top_x; i++) for(int j=0; j<top_y; j++) {
    	distance = pow(winner[0] - i, 2) + pow(winner[1] - j, 2);
    	neighborF = 1 * exp ( - distance / r );
    	for(int in=0; in<inputs; in++) {
			w(i,j,in) =  w(i,j,in) + g * neighborF * (input[in] - w(i,j,in));
		}
	}
}

// -------------------------------------------------------------- MAIN
void main() {
	double g,r;
	FILE *log = fopen(logFile,"w");
	FILE *visual = fopen(visualFile,"w");
	fprintf(log,"Sample      X      Y   Distance\n");
	fprintf(visual,"%d %d %d %d\n", top_x, top_y, samples, epochs);
    readTrainingSet();
    printf("Training Set (%s) Loaded.\n", trainFile);

	wInit();
	printf("Weights Initialised.\n");

    // --- Learning
	for (int e=0; e<epochs; e++) {
        g = gamma - (gamma/epochs) * e;
		r = radius - (radius/epochs) * e;
		fprintf(log,"------------------------------------------- Epoch : %d (Gamma : %f, Radius : %f)\n", e+1, g, r);
	    printf("\rRunning SOM ( Epoch : %d ).", e+1);
		for (int t=0; t<samples; t++) {
			fprintf(log, "%6d   ", t+1);
            changeWeights(train[t], g, r, log, visual);
		}
		fprintf(visual, "\n");
	}
    fclose(log);
    fclose(visual);

    // --- Save Weights
    if (saveWeights) {
        printf("\nSaving Weights.");
        FILE *wfile = fopen(weightsFile,"w");
        for(int i=0; i<top_x; i++) for(int j=0; j<top_y; j++) for(int in=0; in<inputs; in++) fprintf(wfile,"%f ", w(i,j,in));
        fclose(wfile);
    }
    printf("\nFinished.");
}
