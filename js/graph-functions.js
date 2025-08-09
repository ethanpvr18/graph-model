import "./graph-events.js";
import { state, model } from "./graph-state.js"

export { select, deselect, createVertex, deleteVertex, modifyVertex, createEdge, deleteEdge, modifyEdge, modifyEdgeLabel, createEditor, deleteEditor, saveGraph, loadGraph };

function select(type, element) {
    if(type === 'vertex') {
        state.selectedVertex = element;
        element.style.border = "3px solid red";
    } else if(type === 'edge') {
        state.selectedEdge = element;
        element.style.border = "3px solid red";
    } else if(type === 'edge-label') {
        state.selectedEdgeLabel = element;
    }
}

function deselect(type, element) {
    if(element) {
        if(type === 'vertex') {
            state.selectedVertex = null;
            element.style.border = "none";
        } else if(type === 'edge') {
            state.selectedEdge = null;
            element.style.border = "none";
        }
    }
}

function createVertex(label, left, top) {
    const vertex = document.createElement('div');
    vertex.classList.add('vertex');
    vertex.textContent = label;

    // Set Vertex Position
    const modelRect = model.getBoundingClientRect();

    if(left == null)
        left = (event.clientX - modelRect.left - 24);

    if(top == null)
        top = (event.clientY - modelRect.top - 24);

    vertex.style.left = left + 'px';
    vertex.style.top = top + 'px';

    model.appendChild(vertex);

    state.vertices.push(vertex);

    if(!state.graph.vertices.vertex)
        state.graph.vertices.push({ vertex });

    return vertex;
}

function deleteVertex() {
    if(state.selectedVertex) {
        if(model.contains(state.selectedVertex)) {
            
            state.edges
            .filter(({ v1, v2 }) => v1 === state.selectedVertex || v2 === state.selectedVertex)
            .forEach(({ edge, label }) => {
                if (model.contains(edge)) model.removeChild(edge);
                if (model.contains(label)) model.removeChild(label);
            });

            state.edges = state.edges.filter(({ v1, v2 }) => v1 !== state.selectedVertex && v2 !== state.selectedVertex);

            model.removeChild(state.selectedVertex);
            state.selectedVertex = null;
        }
    }
}

function modifyVertex() {
    if(model.contains(state.selectedVertex)) {
        state.selectedVertex.textContent = state.selectedEditor.value;
        state.selectedVertex.style.border = 'none';
    }

    state.selectedVertex = null;

    deleteEditor();
}

function createEdge(v1, v2, edgeWeight) {
    if(v1 && v2 && edgeWeight) {
        const edge = document.createElement('div');
        edge.classList.add('edge');

        const label = document.createElement('div');
        label.textContent = edgeWeight;
        label.classList.add('edge-label');

        label.addEventListener('focus', (event) => {
            state.isEditing = true;
        });

        label.addEventListener('blur', (event) => {
            state.isEditing = false;
        });

        model.appendChild(edge);
        model.appendChild(label);

        // Generated
        const update = () => {
            const modelRect = model.getBoundingClientRect();
            const v1Rect = v1.getBoundingClientRect();
            const v2Rect = v2.getBoundingClientRect();

            const x1 = v1Rect.left + v1Rect.width / 2 - modelRect.left;
            const y1 = v1Rect.top + v1Rect.height / 2 - modelRect.top;
            const x2 = v2Rect.left + v2Rect.width / 2 - modelRect.left;
            const y2 = v2Rect.top + v2Rect.height / 2 - modelRect.top;

            const dx = x2 - x1;
            const dy = y2 - y1;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;

            edge.style.left = `${x1}px`;
            edge.style.top = `${y1}px`;
            edge.style.width = `${length}px`;
            edge.style.transform = `rotate(${angle}deg)`;

            const labelX = (x1 + x2) / 2;
            const labelY = (y1 + y2) / 2;
            label.style.left = `${labelX + 5}px`;
            label.style.top = `${labelY - 10}px`;        
        };

        update();

        state.edges.push({ edge, label, v1, v2, update });

        if(!state.graph.edges.edge)
            state.graph.edges.push({ edge, label, v1, v2 });

        return edge;
    } else {
        return;
    }
}

function deleteEdge() {
    if(state.selectedEdge) {
        const index = state.edges.findIndex(e => e.edge === state.selectedEdge);
        if (index !== -1) {
            const { edge, label } = state.edges[index];

            if (model.contains(edge)) model.removeChild(edge);
            if (model.contains(label)) model.removeChild(label);

            state.edges.splice(index, 1);
        }

        state.selectedEdge = null;
    }
}

function modifyEdge() {
    if(state.selectedEdge) {
        const edgeToModify = state.edges.find(e => e.edge === state.selectedEdge);
        
        if(edgeToModify) {
            edgeToModify.label.textContent = state.selectedEditor.value;
        }
    }

    state.selectedEdge = null;

    deleteEditor();
}

function modifyEdgeLabel() {
    if(model.contains(state.selectedEdgeLabel)) {
        state.selectedEdgeLabel.textContent = state.selectedEditor.value;
    }

    state.selectedEdgeLabel = null;

    deleteEditor();
}

function createEditor(existingContent, leftPosition, topPosition) {
    state.selectedEditor = document.createElement('input');
    state.selectedEditor.type = 'text';
    state.selectedEditor.classList.add('editor');
    state.selectedEditor.value = existingContent;
    state.selectedEditor.style.left = leftPosition;
    state.selectedEditor.style.top =  topPosition;

    state.selectedEditor.addEventListener('focus', () => {
        state.isEditing = true;
    });

    state.selectedEditor.addEventListener('blur', () => {
        state.isEditing = false;
    });

    model.appendChild(state.selectedEditor);
    state.selectedEditor.blur();

    return state.selectedEditor;
}

function deleteEditor() {
    if(state.selectedEditor) {
        if(model.contains(state.selectedEditor)) {
            model.removeChild(state.selectedEditor);
            state.selectedEditor = null;
            state.isEditing = false;
        }
    }

    state.selectedEdgeLabel = null;
    const editors = model.querySelectorAll('.editor');
    editors.forEach(editor => {
        model.removeChild(editor);
    });
}

function saveGraph(filename) {

    const data = { graph: state.graph };
    const dataString = JSON.stringify(data, null, 2);

    const blob = new Blob([dataString], { type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

async function loadGraph() {

    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const fileContent = await file.text();
    const graph = JSON.parse(fileContent);

    state.graph = graph;

    if(Array.isArray(state.graph.vertices)) {
        state.graph.vertices.forEach(v => createVertex(v.textContent, v.style.left, v.style.top));
    }

    console.log(Array.isArray(state.graph.edges));
    console.log(state.graph.edges);
    console.log(state.graph.edges.v1);
    
    if(Array.isArray(state.graph.edges)) {
        state.graph.edges.forEach(e => createEdge(e.v1, e.v2, e.label));
        // state.graph.edges.forEach(edge => createEdge(state.vertices[edge.v1index], state.vertices[edge.v2index], edge.label));
    }
}

// state.graph.edges.push({ edge, label, v1, v2 });
// state.graph.vertices.push({ vertex });