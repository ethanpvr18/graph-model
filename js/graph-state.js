// graph-state.js
import { select, deselect, createVertex, deleteVertex, modifyVertex, createEdge, deleteEdge, modifyEdge, modifyEdgeLabel, createEditor, deleteEditor, saveGraph, loadGraph } from "./graph-functions.js";
import "./graph-events.js";

// Shared state variables
export const state = {
    vertexNumber: 1,
    edgeNumber: 1,
    currentVertex: null,
    selectedVertex: null,
    selectedEdge: null,
    selectedEdgeLabel: null,
    selectedEditor: null,
    isDragging: false,
    isEditing: false,
    vertices: [],
    edges: [],
    graph: []
};

// Create and export the model container
export const model = document.createElement('div');
model.classList.add('model');
document.body.appendChild(model);

export const open = document.createElement('input');
open.type = 'button';
open.name = 'Open';
open.value = 'Open';
open.addEventListener('click', (event) => {
    if(event.target.name.contains('Open')) {
        console.log('Open');
    }
});
model.appendChild(open);

export const close = document.createElement('input');
close.type = 'button';
close.name = 'Close';
close.value = 'Close';
close.addEventListener('click', (event) => {
    if(event.target.name.contains('Close')) {
        console.log('Close');
    }
});
model.appendChild(close);

export const save = document.createElement('input');
save.type = 'button';
save.name = 'Save';
save.value = 'Save';
save.addEventListener('click', (event) => {
    if(event.target.name.contains('Save')) {
        console.log('Save');
    }
});
model.appendChild(save);

export const saveAs = document.createElement('input');
saveAs.type = 'button';
saveAs.name = 'Save As';
saveAs.value = 'Save As';
saveAs.addEventListener('click', (event) => {
    if(event.target.name.contains('Save As')) {
        console.log('Save As');
    }
});
model.appendChild(saveAs);

export const print = document.createElement('input');
print.type = 'button';
print.name = 'Print';
print.value = 'Print';
print.addEventListener('click', (event) => {
    if(event.target.name.contains('Print')) {
        console.log('Print');
    }
});
model.appendChild(print);

export const functions = document.createElement('input');
functions.type = 'button';
functions.name = 'Functions';
functions.value = 'Functions';
functions.addEventListener('click', (event) => {
    if(event.target.name.contains('Functions')) {
        console.log('Functions');
    }
});
model.appendChild(functions);
