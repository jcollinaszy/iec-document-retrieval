%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                         %
% Creates MP4 video for SOM visualisation %
% Author: Juraj Collinaszy                %
%                                         %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

clear all; close all; clc; 

folder = 'visual';          % image folder
format = 'MPEG-4';          % output file format

epochs = length(dir(folder)) - 2;
images = cell(epochs,1);

% create video writer
writerObj = VideoWriter('video',format);
writerObj.FrameRate = 30;

% open video writer
open(writerObj);

% read images and write to video
for i = 1:epochs
    fprintf('Reading, resizing and writing input %5i.\n',i);
    writeVideo(writerObj, im2frame(imresize(imread([folder ,'/output', int2str(i), '.jpg']), 0.5)));
end


% close writer object
close(writerObj);

fprintf('Finished.\n');