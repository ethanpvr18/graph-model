// graph-state.js
import { select, deselect, createVertex, deleteVertex, modifyVertex, createEdge, deleteEdge, modifyEdge, createEditor, deleteEditor, saveGraph } from "./graph-functions.js";
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
    edges: []
};

// Create and export the model container
export const model = document.createElement('div');
model.classList.add('model');
document.body.appendChild(model);
