%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%                                          %
% Creates JPEG files for SOM visualisation %
% Author: Juraj Collinaszy                 %
%                                          %
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

clear all; close all; clc; 

if exist('visual','dir') ~= 7 
    mkdir('visual');
end
input = fopen('visual.txt','r');
info = textscan(input,'%d', 4);
arrays = textscan(input,'%d %d ');
samples = info{1}(3);     
epochs = info{1}(4);      
maxX = info{1}(1) -1;      
maxY = info{1}(2) -1;      
clearvars info input;
x = zeros(samples,2);
f = figure('visible','off');

for e = 1:epochs
    % rewrite into proper format
        for s = 1:samples
            x(s,1) = arrays{1}(s+samples*(e-1));
            x(s,2) = arrays{2}(s+samples*(e-1));
        end

    % get unique combinations
    [xyUnique, ignore, ixs] = unique(x,'rows');

    % get combination counts
    [nRows, nCols] = size(xyUnique);
    xyCount = hist(ixs,nRows);
    
    % save figure to file
    
    scatter(xyUnique(:,1), xyUnique(:,2), xyCount*50, 'r', 'filled');
    axis([0 maxX 0 maxY]);
    saveas(f,strcat('visual/output', num2str(e)),'jpg');
    clf;
    clearvars s ignore ixs xyUnique nRows nCols xyCount;
    fprintf('File output%i.jpg done.\n',e);
end

fprintf('Finished.\n');