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
    vertex.style.border = "none";

    const modelRect = model.getBoundingClientRect();

    if(left == null)
        if(window.event)
            left = window.event.clientX - modelRect.left - 24;
        else
            left = 0 ;

    if(top == null)
        if(window.event)
            top = window.event.clientY - modelRect.top - 24;
        else
            top = 0;

    vertex.style.left = left + 'px';
    vertex.style.top = top + 'px';

    model.appendChild(vertex);

    state.vertices.push(vertex);

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

function createEdge(v1, v2, edgeWeight, savedStyles) {
    if(!v1 || !v2 || !edgeWeight)
        return null;

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

    if(savedStyles) {
        edge.style.left = savedStyles.left + 'px';
        edge.style.top = savedStyles.top + 'px';
        edge.style.width = savedStyles.width + 'px';
        edge.style.transform = `rotate(${savedStyles.transform}deg)`;

        label.style.left = savedStyles.labelLeft + 'px';
        label.style.top = savedStyles.labelTop + 'px';
    } else {
        update();
    }

    state.edges.push({ edge, label, v1, v2, update });

    return edge;
}

function deleteEdge() {
    if(!state.selectedEdge)
        return;

    state.edges = state.edges.filter(e => {
        if (e && e.edge === state.selectedEdge) {
            if (e.edge && model.contains(e.edge)) model.removeChild(e.edge);
            if (e.label && model.contains(e.label)) model.removeChild(e.label);
            
            return false;
        }
        return true;
    });

    state.selectedEdge = null;
}

function modifyEdge() {
    if(!state.selectedEdge || !state.selectedEditor)
        return null;
    
    const edgeToModify = state.edges.find(e => e.edge === state.selectedEdge);
    
    if(edgeToModify && edgeToModify.label)
        edgeToModify.label.textContent = state.selectedEditor.value?.trim() || '';

    state.selectedEdge = null;

    deleteEditor();
}

function modifyEdgeLabel() {
    if(!state.selectedEdgeLabel || !state.selectedEditor)
        return;

    if(model.contains(state.selectedEdgeLabel)) {
        state.selectedEdgeLabel.textContent = state.selectedEditor.value?.trim() || '';
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

async function saveGraph(filename) {

    const vertexData = state.vertices.map(v => ({
        left: parseFloat(v.style.left, 10) || 0,
        top: parseFloat(v.style.top, 10) || 0,
        label: v.textContent || "",
        border: 'none'
    }));

    const edgeData = state.edges.filter(e => e && e.edge && e.label).map(e => ({
        v1Index: state.vertices.indexOf(e.v1),
        v2Index: state.vertices.indexOf(e.v2),
        label: e.label.textContent || "",
        border: 'none',
        left: parseFloat(e.edge?.style?.left, 10) || 0,
        top: parseFloat(e.edge?.style?.top, 10) || 0,
        width: parseFloat(e.edge?.style?.width, 10) || 0,
        transform: parseFloat((e.edge?.style?.transform || "").replace(/[^\d.-]/g, "")) || 0,
        labelLeft: parseFloat(e.label?.style?.left, 10) || 0,
        labelTop: parseFloat(e.label?.style?.top, 10) || 0
    }));

    const data = { vertices: vertexData, edges: edgeData };
    const dataString = JSON.stringify(data, null, 2);


    const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
            description: "JSON Files",
            accept: { "application/json": [".json"] }
        }]
    });

    const writable = await handle.createWritable();
    await writable.write(dataString);
    await writable.close();
    // Check in Safari

    // const blob = new Blob([dataString], { type: 'application/json'});
    // const url = URL.createObjectURL(blob);

    // const a = document.createElement('a');
    // a.href = url;
    // a.download = filename;
    // document.body.appendChild(a);
    
    // a.click();

    // URL.revokeObjectURL(url);
    // document.body.removeChild(a);
}

async function loadGraph() {

    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const fileContent = await file.text();
    const graph = JSON.parse(fileContent);

    state.vertices = [];
    state.edges = [];

    if(Array.isArray(graph.vertices)) {
        graph.vertices.forEach(v => {
            createVertex(v?.label, v?.left, v?.top);
        });
    }

    if(Array.isArray(graph.edges)) {
        graph.edges.forEach(e => { 
            const v1 = state?.vertices[e?.v1Index];
            const v2 = state?.vertices[e?.v2Index];
            if(v1 && v2)
                createEdge(v1, v2, e?.label, {
                    left: e?.left,
                    top: e?.top,
                    width: e?.width,
                    transform: e?.transform,
                    labelLeft: e?.labelLeft,
                    labelTop: e?.labelTop
            });
        });
    }
}