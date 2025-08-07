import "./GraphFunctions.js";

let vertexNumber, edgeNumber = 1;
let currentVertex, selectedVertex, selectedEdge, selectedEdgeLabel, selectedEditor = null;
let isDragging, isEditing = false;
let edges, vertices = [];

// Create Window
const model = document.createElement('div');
model.classList.add('model');
document.body.appendChild(model);

document.addEventListener('click', (event) => {
    // Deselect Vertex / Edge
    if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('editor')) {
        isEditing = false;
        if(selectedVertex) {
            deselect(vertex, selectedVertex);
        } else if(selectedEdge) {
            deselect(edge, selectedEdge);
        } else if(selectedEditor) {
            deleteEditor(selectedEditor, isEditing)
        }
    }
});

document.addEventListener('dblclick', (event) => {
    isEditing = true;

    // Create Vertex
    if(!event.target.classList.contains('vertex') && !event.target.classList.contains('edge') && !event.target.classList.contains('editor') && isEditing) {
        createVertex(`v${vertexNumber++}`);

    } else if(event.target.classList.contains('vertex') && isEditing) {
        // Select Vertex
        const vertex = event.target;
        if (!selectedVertex) {
            // Select Vertex 1
            select(vertex, selectedVertex);

            // Open Editor
            createEditor(selectedVertex.textContent, (modelRect.left + vertexRect.left + 27) + 'px', (modelRect.top + vertexRect.top - 5) + 'px');

        } else if((selectedVertex !== vertex) && isEditing){
            // Create Edge
            createEdge(selectedVertex, vertex, `e${edgeNumber++}`);

            // Select Vertex 2
            deselect(vertex, selectedVertex);
            
            // Close and Open Editor
            deleteEditor(selectedEditor, isEditing)
        } else {
            // Deselect Vertex
            deselect(vertex, selectedVertex);
            
            // Close Editor
            deleteEditor(selectedEditor, isEditing)
        }
    } else if(event.target.classList.contains('edge') && isEditing) {
        // Select Edge
        const edge = event.target;
        if(!selectedEdge) {
            // Select Edge
            select(edge, selectedEdge);

            // Open Editor
            createEditor(selectedEdge.textContent, (parseInt(selectedEdge.style.left) + 27) + 'px', (parseInt(selectedEdge.style.top) - 5) + 'px');

        } else {
            // Deselect Edge
            deselect(edge, selectedEdge);

            // Close Editor
            deleteEditor(selectedEditor, isEditing)
        }
    } else if(event.target.classList.contains('editor')) {
        // Select Editor
        const editor = event.target;
        if(!selectedEditor) {
            selectedEditor = editor;
            selectedEditor.focus();
        } else {
            selectedEditor = null;
            selectedEditor.blur();
        }
    }
});

document.addEventListener('keydown', (event) => {
    // Submit Vertex / Edge Modification - ENTER
    if(event.key === 'Enter' && selectedEditor) {
        modifyVertex(selectedVertex, selectedEditor, isEditing);
        modifyEdge(selectedVertex, selectedEditor, isEditing);
    }    
    
    // Delete Vertex - BACKSPACE
    if((event.key === 'Backspace') && !isEditing) {
        event.preventDefault();

        // Delete Vertex - BACKSPACE
        deleteVertex(selectedVertex, edges)

        // Delete Edge - BACKSPACE
        deleteEdge(selectedEdge, edges);
        
        // Delete Editor - BACKSPACE
        deleteEditor(selectedEditor, isEditing);

        isEditing = false;
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
        isDragging = true;
        currentVertex = event.target;

        const modelRect = model.getBoundingClientRect();
        currentVertex.style.left = (event.clientX - modelRect.left - 24) + 'px';
        currentVertex.style.top = (event.clientY - modelRect.top - 24) + 'px';
    }
});

document.addEventListener('mousemove', (event) => {
    // Drag Vertex
    if(isDragging && currentVertex) {
        const modelRect = model.getBoundingClientRect();
        currentVertex.style.left = (event.clientX - modelRect.left - 24) + 'px';
        currentVertex.style.top = (event.clientY - modelRect.top - 24) + 'px';
    }

    // Generated
    edges.forEach(({ v1, v2, update }) => {
        if (v1 === currentVertex || v2 === currentVertex) {
            update();
        }
    });

});

document.addEventListener('mouseup', (event) => {
    // Drop Vertex
    isDragging = false;
    currentVertex = null;
});

