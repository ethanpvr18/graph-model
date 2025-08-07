import "./Graph.js";

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

    edges.push({ vertex, label  });
}

function deleteVertex(selectedVertex, edges) {
    if(selectedVertex) {
        if(model.contains(selectedVertex)) {
            
            edges
            .filter(({ v1, v2 }) => v1 === selectedVertex || v2 === selectedVertex)
            .forEach(({ edge, label }) => {
                if (model.contains(edge)) model.removeChild(edge);
                if (model.contains(label)) model.removeChild(label);
            });

            edges = edges.filter(({ v1, v2 }) => v1 !== selectedVertex && v2 !== selectedVertex);

            model.removeChild(selectedVertex);
            selectedVertex = null;
        }
    }
}

function modifyVertex(selectedVertex, selectedEditor, isEditing) {
    if(model.contains(selectedVertex)) {
        selectedVertex.textContent = selectedEditor.value;
        selectedVertex.style.border = 'none';
    }

    selectedVertex = null;

    if(model.contains(selectedEditor)) {
        model.removeChild(selectedEditor);
    }

    selectedEditor = null;
    isEditing = false;
}

function createEdge(v1, v2, edgeWeight) {
    const edge = document.createElement('div');
    edge.classList.add('edge');

    const label = document.createElement('div');
    label.textContent = edgeWeight;
    label.classList.add('edge-label');

    label.addEventListener('focus', (event) => {
        isEditing = true;
    });

    label.addEventListener('blur', (event) => {
        isEditing = false;
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

    edges.push({ edge, label, v1, v2, update });
}

function deleteEdge(selectedEdge, edges) {
    if(selectedEdge) {
        const index = edges.findIndex(e => e.edge === selectedEdge);
        if (index !== -1) {
            const { edge, label } = edges[index];

            if (model.contains(edge)) model.removeChild(edge);
            if (model.contains(label)) model.removeChild(label);

            edges.splice(index, 1);
        }

        selectedEdge = null;
    }
}

function modifyEdge(selectedEdge, selectedEditor, isEditing) {
    if(model.contains(selectedEdge)) {
        selectedEdge.textContent = selectedEditor.value;
        selectedEdge.style.border = 'none';
    }

    selectedEdge = null;

    if(model.contains(selectedEditor)) {
        model.removeChild(selectedEditor);
    }

    selectedEditor = null;
    isEditing = false;
}

function createEditor(selectedEditor, existingContent, leftPosition, rightPosition) {
    selectedEditor = document.createElement('input');
    selectedEditor.type = 'text';
    selectedEditor.classList.add('editor');
    selectedEditor.value = existingContent;

    const modelRect = model.getBoundingClientRect();
    const vertexRect = selectedVertex.getBoundingClientRect();

    selectedEditor.style.left = leftPosition;
    selectedEditor.style.top =  rightPosition;

    model.appendChild(selectedEditor);
}

function deleteEditor(selectedEditor, isEditing) {
    if(selectedEditor) {
        if(model.contains(selectedEditor)) {
            model.removeChild(selectedEditor);
            selectedEditor = null;
            isEditing = false;
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