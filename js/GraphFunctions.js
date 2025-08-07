import "./Graph.js";
import { state, model } from "./state.js"

function select(element, selectedElement) {
    if(selectedElement) {
        element = vertex;
        element.style.border = "3px solid red";
    }
}

function deselect(element, selectedElement) {
    if(selectedElement) {
        element.style.border = 'none';
        element = null;
    }
}

function createVertex(label) {
    const vertex = document.createElement('div');
    vertex.classList.add('vertex');
    vertex.textContent = label;

    // Set Vertex Position
    const modelRect = model.getBoundingClientRect();
    vertex.style.left = (event.clientX - modelRect.left - 24) + 'px';
    vertex.style.top = (event.clientY - modelRect.top - 24) + 'px';

    model.appendChild(vertex);

    state.edges.push({ vertex, label  });
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

    if(model.contains(state.selectedEditor)) {
        model.removeChild(state.selectedEditor);
    }

    state.selectedEditor = null;
    state.isEditing = false;
}

function createEdge(v1, v2, edgeWeight) {
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
    if(model.contains(state.selectedEdge)) {
        state.selectedEdge.textContent = state.selectedEditor.value;
        state.selectedEdge.style.border = 'none';
    }

    state.selectedEdge = null;

    if(model.contains(state.selectedEditor)) {
        model.removeChild(state.selectedEditor);
    }

    state.selectedEditor = null;
    state.isEditing = false;
}

function createEditor(existingContent, leftPosition, rightPosition) {
    state.selectedEditor = document.createElement('input');
    state.selectedEditor.type = 'text';
    state.selectedEditor.classList.add('editor');
    state.selectedEditor.value = existingContent;

    const modelRect = model.getBoundingClientRect();
    const vertexRect = state.selectedVertex.getBoundingClientRect();

    state.selectedEditor.style.left = leftPosition;
    state.selectedEditor.style.top =  rightPosition;

    model.appendChild(state.selectedEditor);
}

function deleteEditor() {
    if(state.selectedEditor) {
        if(model.contains(state.selectedEditor)) {
            model.removeChild(state.selectedEditor);
            state.selectedEditor = null;
            state.isEditing = false;
        }
    }
}

function saveGraph() {
    const edgeData = {
        left : '',
        top : '',
        width : '',
        transform : '',
        rotate : '',
        label : '',
        sourceVertex : '',
        sinkVertex : ''
    };

    const edgeLabelData = {
        left : '',
        top : '',
        label : ''
    };

    const vertexData = {
        left : '',
        top : '',
        label : ''
    };


    const savedEdges = document.querySelectorAll('.edge');
    const savedEdgeLabels = document.querySelectorAll('.vertex');
    const savedVertices = document.querySelectorAll('.edge-label');


    savedEdges.forEach((div) => {
        edgeData.left = div.style.left;
        edgeData.top = div.style.top;
        edgeData.width = div.style.width;
        edgeData.transform = div.style.transform;
        edgeData.rotate = div.style.rotate;

        console.log('Left = ' + edgeData.left + 
            '\nTop = ' + edgeData.top + 
            '\nWidth = ' + edgeData.width + 
            '\nTransform= ' + edgeData.left + 
            '\nRotate = ' + edgeData.left +
            '\n\n');
    });

    savedEdgeLabels.forEach((div) => {
        edgeLabelData.left = div.style.left;
        edgeLabelData.top = div.style.top;
        edgeLabelData.label = div.innerHTML;

        console.log('Left = ' + edgeLabelData.left + 
            '\nTop = ' + edgeLabelData.top + 
            '\nLabel = ' + edgeLabelData.label +
            '\n\n');
    });

    savedVertices.forEach((div) => {
        vertexData.left = div.style.left;
        vertexData.top = div.style.top;
        vertexData.label = div.innerHTML;

        console.log('Left = ' + vertexData.left + 
            '\nTop = ' + vertexData.top + 
            '\nLabel = ' + vertexData.label +
            '\n\n');
    });

    const edgeDataString = JSON.stringify(edgeData);
    const edgeLabelDataString = JSON.stringify(edgeLabelData);
    const vertexDataString = JSON.stringify(vertexData);

    const blob = new Blob([edgeDataString], { type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    
    a.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(a);
}