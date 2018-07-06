###################################################
#                                                 #
# Renames images and pdf files to x-y             #
# Author : juraj Collinaszy                       #
# Note : Pdfs have to be in pdf folder            #
#        Jpeg images have to be in images folder  #
#        Clusters.txt contains new names in order #               	                
#                                                 #
###################################################

import os

clusters_file = open("clusters.txt", "r")
clusters = clusters_file.read().split("\n")
clusters_file.close()
pdf = os.listdir("pdf")
jpg = os.listdir("images")

for i,c in enumerate(clusters):
    print c.strip().replace(" ","-") + ".pdf - " + jpg[i] + " - " + pdf[i]
    os.rename("pdf/" + pdf[i],"pdf/" + c.strip().replace(" ","-") + ".pdf")
    os.rename("images/" + jpg[i],"images/" + c.strip().replace(" ","-") + ".jpg")
	
'''
for c in clusters:
    e = c.split()
    print "{x:" + e[0] + ", y:" + e[1] + "}"
'''