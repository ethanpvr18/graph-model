import { select, deselect, createVertex, deleteVertex, modifyVertex, createEdge, deleteEdge, modifyEdge, createEditor, deleteEditor, saveGraph } from "./graph-functions.js";
import { state, model } from "./graph-state.js";

document.addEventListener('click', (event) => {
    // Deselect Vertex / Edge
    if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('editor')) {
        state.isEditing = false;
        if(state.selectedVertex) {
            deselect('vertex', state.selectedVertex);
        } else if(state.selectedEdge) {
            deselect('edge', state.selectedEdge);
        } else if(state.selectedEditor) {
            deleteEditor();
        }
    }
});

document.addEventListener('dblclick', (event) => {
    // Create Vertex
    if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('editor') && state.isEditing) {
        createVertex(`v${state.vertexNumber++}`, event);

    } else if(event.target.classList.contains('vertex') && state.isEditing) {
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

        } else if((state.selectedVertex !== vertex) && state.isEditing){
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
    } else if(event.target.classList.contains('edge') && state.isEditing) {
        // Select Edge
        const edge = event.target;
        if(!state.selectedEdge) {
            // Select Edge
            select('edge', edge);

            // Open Editor
            createEditor(state.selectedEdge.textContent, 
                        (parseInt(state.selectedEdge.style.left) + 27) + 'px',
                        (parseInt(state.selectedEdge.style.top) - 5) + 'px');

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
            state.selectedEditor = null;
            state.selectedEditor.blur();
        }
    }
});

document.addEventListener('keydown', (event) => {
    // Submit Vertex / Edge Modification - ENTER
    if(event.key === 'Enter') {
        if(state.selectedVertex) {
            modifyVertex();
        } else if(state.selectedEdge) {
            modifyEdge();
        }
    }    
    
    console.log('Key Pressed = ' + event.key);

    // Delete Vertex - BACKSPACE
    if((event.key === 'Backspace') && !state.isEditing) {
        event.preventDefault();

        console.log('Backspace Pressed on ' + state.selectedVertex + '   ' + state.selectedEdge + '   ' + state.selectedEditor);

        if(state.selectedVertex){
            console.log("On : " + state.selectedVertex.textContent);
             // Delete Vertex - BACKSPACE
            deleteVertex()
        } else if(state.selectedEdge){
            console.log("On : " + state.selectedEdge.textContent);
            // Delete Edge - BACKSPACE
            deleteEdge(state.selectedEdge, state.edges);
        } else if(state.selectedEditor){
            console.log("On : " + state.selectedEditor.textContent);
             // Delete Editor - BACKSPACE
            deleteEditor();;
        }

        state.isEditing = false;
    }

    // Save Graph - e
    if(event.key === 'e') {
        event.preventDefault();

        // Save Graph - e
        saveGraph();
    }
});

document.addEventListener('mousedown', (event) => {
    // Grab Vertex
    if(event.target.classList.contains('vertex')) {
        state.isDragging = true;
        state.currentVertex = event.target;

        const modelRect = model.getBoundingClientRect();
        state.currentVertex.style.left = (event.clientX - modelRect.left - 24) + 'px';
        state.currentVertex.style.top = (event.clientY - modelRect.top - 24) + 'px';
    }
});

document.addEventListener('mousemove', (event) => {
    // Drag Vertex
    if(state.isDragging && state.currentVertex) {
        const modelRect = model.getBoundingClientRect();
        state.currentVertex.style.left = (event.clientX - modelRect.left - 24) + 'px';
        state.currentVertex.style.top = (event.clientY - modelRect.top - 24) + 'px';
    }

    // Generated
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

