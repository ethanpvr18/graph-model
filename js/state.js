// state.js

// Shared state variables
export let vertexNumber = 1;
export let edgeNumber = 1;

export let currentVertex = null;
export let selectedVertex = null;
export let selectedEdge = null;
export let selectedEdgeLabel = null;
export let selectedEditor = null;

export let isDragging = false;
export let isEditing = false;

export const vertices = [];
export const edges = [];

// Create and export the model container
export const model = document.createElement('div');
model.classList.add('model');
document.body.appendChild(model);

// Utility to reset or update state
export function resetSelection() {
    selectedVertex = null;
    selectedEdge = null;
    selectedEdgeLabel = null;
    selectedEditor = null;
}
