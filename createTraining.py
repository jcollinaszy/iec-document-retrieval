###############################################
#                                             #
# Creates Training Set for SOM from txt files #
# Author : Juraj Collinaszy                   #
# Note : Files have to be in txt folder       #
#        Blacklist only in English            #
#                                             #
###############################################

import os
if not os.path.exists("txt2"):
    os.makedirs("txt2")
if not os.path.exists("txt3"):
    os.makedirs("txt3")
file_list = os.listdir("txt")
file_list2 = os.listdir("txt2")
blacklist = ["that", "from", "when", "will", "with", "have", "this",
             "other", "each", "which", "these", "such", "than", "where",
             "also", "used", "then", "were", "there", "more", "between",
             "some", "after", "been", "same", "must", "next", "every",
             "their", "them", "later", "only", "using"]
 
 
def build_dict(input_filename, output_filename, bl, count, length, dict):
 
    import re
 
    input_file = open(input_filename, 'r')
    arr = re.sub(r'[^a-z ]+', '', input_file.read().lower()).split()
    input_file.close()
 
    word_list = [x for x in arr if x not in bl]
    import collections
    d = collections.OrderedDict()
    for word in word_list:
        d[word] = None
 
    f = open(output_filename, 'w')
    f2 = open(output_filename[:-3] + "dat", 'w')
    for k in d.keys():
        if count[1] > word_list.count(k) > count[0] and length[1] > len(k) > length[0]:
            if dict == 0:
                f.write(k + "\n")
                f2.write(str(word_list.count(k)) + "\n")
            else:
                output_file2.write(k + "\n")
                f2.write(k + " " + str(word_list.count(k)) + "\n")
 
    f.close()
    f2.close()
 
output_file = open("txt3/words.dat", "w")
output_file.write("")
output_file.close()
output_file2 = open("txt3/words2.dat", "w")
output_file2.write("")
output_file2.close()
 
output_file = open("txt3/words.dat", "a")
output_file2 = open("txt3/words2.dat", "a")
for txt in file_list:
    build_dict("txt/" + txt, "txt2/" + txt, blacklist, [0, 999], [3, 999], 0)
    print "File " + txt + ": DONE"
    with open("txt/" + txt, "r") as my_file:
        output_file.write(my_file.read())
        print "^ File Written."
output_file.close()
print "Writing words.dat"
build_dict("txt3/words.dat", "txt3/words.dat", blacklist, [1, 999], [3, 999], 1)
output_file2.close()
 
print "Creating train set"
output_file = open("txt3/words2.dat", "r")
listX = output_file.read().split()
output_file.close()
train_file = open("txt3/train.txt", "w")
for txt in file_list2:
    if txt[-3:] == "txt":
        f = open("txt2/" + txt, 'r')
        f2 = open("txt2/" + txt[:-3] + "dat", 'r')
        arr1 = f.read().split()
        arr2 = f2.read().split()
        for wrd in listX:
            if wrd in arr1:
                train_file.write(arr2[int(arr1.index(wrd))] + " ")
            else:
                train_file.write("0 ")
        f.close()
        f2.close()
        train_file.write("\n")
train_file.close()
print "Done"