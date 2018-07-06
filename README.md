# Interactive evolutionary computation in document retrieval

This project is an implementation of tools for document preprocessing and interactive evolutionary computation algorithm for the purpose of document retrieval. As an exercise various parts of this projects are intentionally written in different languages. 

**Preprocessing**

- **allpdf2txt** - bash file used to convert PDF input files into raw text.
- **createTraining.py** - python text processing that takes a group of raw text files as inputs and processes them into dictionary representation. It also creates a main file containing word counts over the whole training set. 
- **kohonen.c** - self-organizing map written in C used to reduce dimensions of text files represented as dictionaries. Output is a list of input files represented as two integers which are going to be used in evolutionary algorithm.


- **video.m, visual.m** - MatLab scrips used for visualization of process of self-organizing map.

**Evolutionary Algorithm**

Evolutionary algorithm is implemented in JavaScript and since it is interactive, the fitness function is replaced by users input. Documents are random at start but users are allowed to rate documents of interest and depending on the ratings in the previous generations the system will create a new generation containing similar documents to the higly rated ones converging towards page filled with documents interesting to the user. Various settings can be changed in the code including : 
- **supermutation** - number of completely random documents on each page.
- **elitism** - number of documents with highest rating from previous generation.
- **mutation rate and step** - probability of mutation occuring and its impact.
