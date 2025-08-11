import { select, deselect, createVertex, deleteVertex, modifyVertex, createEdge, deleteEdge, modifyEdge, modifyEdgeLabel, createEditor, deleteEditor, saveGraph, loadGraph } from "./graph-functions.js";
import { state, model } from "./graph-state.js";

document.addEventListener('click', (event) => {
    // Deselect Vertex / Edge
    if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('editor')) {
        if(state.selectedVertex) {
            deselect('vertex', state.selectedVertex);
        } else if(state.selectedEdge) {
            deselect('edge', state.selectedEdge);
        } else if(state.selectedEditor) {
            deleteEditor();
        }
    }

    console.log(state);
    console.log(state.graph);
    console.log(state.edges);
    console.log(state.vertices);

});

document.addEventListener('dblclick', (event) => {

    if(event.target.classList.contains('vertex')) {
        // Select Vertex
        const vertex = event.target;
        const modelRect = model.getBoundingClientRect();
        const vertexRect = vertex.getBoundingClientRect();

        if (!state.selectedVertex) {
            // Select Vertex 1
            select('vertex', vertex);

            // Open Editor
            createEditor(vertex.textContent, 
                            (vertexRect.left - modelRect.left + 27) + 'px',
                            (vertexRect.top - modelRect.top - 5) + 'px');

        } else if((state.selectedVertex !== vertex)){
            // Create Edge
            createEdge(state.selectedVertex, vertex, `e${state.edgeNumber++}`);

            // Select Vertex 2
            deselect('vertex', state.selectedVertex);
            
            // Close and Open Editor
            deleteEditor();
        } else {
            // Deselect Vertex
            deselect('vertex', state.selectedVertex);
            
            // Close Editor
            deleteEditor();
        }
    
    } else if(event.target.classList.contains('edge-label')) {
        // Select Edge Label
        const label = event.target;
        const modelRect = model.getBoundingClientRect();
        const labelRect = label.getBoundingClientRect();

        if (!state.selectedEdgeLabel) {
            // Select Edge Label
            select('edge-label', label);

            // Open Editor
            createEditor(label.textContent, 
                        (labelRect.left - modelRect.left + 20) + 'px',
                        (labelRect.top - modelRect.top) + 'px');

        } else {
            // Deselect Edge Label
            deselect('edge-label', state.selectedEdgeLabel);
            
            // Close and Open Editor
            deleteEditor();
        }
    } else if(event.target.classList.contains('edge')) {
        // Select Edge
        const edge = event.target;
        if(!state.selectedEdge) {
            // Select Edge
            select('edge', edge);
            
        } else {
            // Deselect Edge
            deselect('edge', state.selectedEdge);

            // Close Editor
            deleteEditor();
        }
    } else if(event.target.classList.contains('editor')) {
        // Select Editor
        const editor = event.target;
        if(!state.selectedEditor) {
            state.selectedEditor = editor;
            state.selectedEditor.focus();
        } else {
            state.selectedEditor.blur();
            state.selectedEditor = null;
        }
    } else if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('edge-label') && !event.target.classList.contains('editor')) {
        // Create Vertex
        createVertex(`v${state.vertexNumber++}`, null, null);
    }
});

document.addEventListener('keydown', (event) => {
    // Submit Vertex / Edge Modification - ENTER
    if(event.key === 'Enter' && state.selectedEditor) {
        event.preventDefault();

        if(state.selectedVertex) {
            modifyVertex();
        } else if(state.selectedEdgeLabel) {
            modifyEdgeLabel();
        } else if(state.selectedEdge) {
            modifyEdge();
        } else {
            if(state.selectedEditor.dataset.type === 'vertex'){
                state.selectedVertex.textContent = state.selectedEditor.value;
            } else if(state.selectedEditor.dataset.type === 'edge-label'){
                state.selectedEdgeLabel.textContent = state.selectedEditor.value;
            }

            deleteEditor();
        }
    }    
    
    // Delete Vertex - BACKSPACE
    if((event.key === 'Backspace') && !state.isEditing) {
        event.preventDefault();

        if(state.selectedVertex){
             // Delete Vertex - BACKSPACE
            deleteVertex()
        }

        if(state.selectedEdge){
            // Delete Edge - BACKSPACE
            deleteEdge(state.selectedEdge, state.edges);
        }

        if(state.selectedEditor){
            // Delete Editor - BACKSPACE
            deleteEditor();
        }
    }

    // Save Graph - s
    if(event.key === 's') {
        event.preventDefault();

        // Save Graph - s
        saveGraph('./saved/graph.json');
    }

    // Load Graph - l
    if(event.key === 'l') {
        event.preventDefault();

        // Load Graph - l
        loadGraph();
    }
});

document.addEventListener('mousedown', (event) => {
    // Grab Vertex
    if(event.target.classList.contains('vertex')) {
        state.isDragging = true;
        state.currentVertex = event.target;
    }
});

document.addEventListener('mousemove', (event) => {
    // Drag Vertex
    if(state.isDragging && state.currentVertex) {
        const modelRect = model.getBoundingClientRect();
        state.currentVertex.style.left = (event.clientX - modelRect.left - 24) + 'px';
        state.currentVertex.style.top = (event.clientY - modelRect.top - 24) + 'px';
    }

    state.edges.forEach(({ v1, v2, update }) => {
        if (v1 === state.currentVertex || v2 === state.currentVertex) {
            update();
        }
    });

});

document.addEventListener('mouseup', (event) => {
    // Drop Vertex
    state.isDragging = false;
    state.currentVertex = null;
});

