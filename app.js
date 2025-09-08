const namespace = joint.shapes;

const graphs = {
    'root': {
        graph: new joint.dia.Graph({}, { cellNamespace: namespace }),
        parent: null
    }
};
let currentGraphId = 'root';

const paper = new joint.dia.Paper({
    el: document.getElementById('paper-container'),
    model: graphs[currentGraphId].graph,
    width: 800,
    height: 600,
    gridSize: 10,
    drawGrid: true,
    background: {
        color: '#f9f9f9'
    },
    cellViewNamespace: namespace,
    interactive: { elementMove: true }
});

// Custom shape for IDEF0 function box
joint.shapes.standard.Rectangle.define('idef.Function', {
    markup: [
        {
            tagName: 'rect',
            selector: 'body',
        }, {
            tagName: 'text',
            selector: 'label'
        }, {
            tagName: 'path',
            selector: 'drillDownButton'
        }
    ],
    attrs: {
        body: {
            rx: 10,
            ry: 10,
            strokeWidth: 2,
            fill: 'white',
            cursor: 'pointer'
        },
        label: {
            text: 'Function',
            fontWeight: 'bold',
            cursor: 'pointer'
        },
        drillDownButton: {
            event: 'element:drilldown:click',
            d: 'M 15 5 L 5 10 L 15 15 Z',
            fill: 'blue',
            cursor: 'pointer',
            'ref-x': '100%',
            'ref-y': '50%',
            'ref-dx': -20,
            'ref-dy': -5,
        }
    },
    ports: {
        groups: {
            'in': {
                position: 'left',
                attrs: { portBody: { magnet: true, r: 5, fill: '#023047' } },
                label: { position: { name: 'left', args: { y: 0 } } }
            },
            'out': {
                position: 'right',
                attrs: { portBody: { magnet: true, r: 5, fill: '#023047' } },
                label: { position: { name: 'right', args: { y: 0 } } }
            },
            'control': {
                position: 'top',
                attrs: { portBody: { magnet: true, r: 5, fill: '#023047' } },
                label: { position: { name: 'top', args: { y: 0 } } }
            },
            'mechanism': {
                position: 'bottom',
                attrs: { portBody: { magnet: true, r: 5, fill: '#023047' } },
                label: { position: { name: 'bottom', args: { y: 0 } } }
            }
        }
    }
});

paper.on('link:label:pointerdblclick', (linkView, evt) => {
    const label = linkView.findAttribute('label', evt.target);
    const model = linkView.model;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = model.label(0).attrs.text.text;
    input.style.position = 'absolute';
    const bbox = evt.target.getBBox();
    const viewBbox = paper.el.getBoundingClientRect();
    input.style.left = `${bbox.x + viewBbox.left}px`;
    input.style.top = `${bbox.y + viewBbox.top}px`;
    input.style.width = `${bbox.width}px`;
    input.style.height = `${bbox.height}px`;
    document.body.appendChild(input);

    input.focus();
    input.select();

    const onEndEditing = () => {
        model.label(0, { attrs: { text: { text: input.value } } });
        document.body.removeChild(input);
    };

    input.addEventListener('blur', onEndEditing);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            input.blur();
        } else if (e.key === 'Escape') {
            document.body.removeChild(input);
        }
    });
});

paper.on('element:drilldown:click', (elementView) => {
    const model = elementView.model;
    if (model instanceof joint.shapes.idef.Function) {
        const childGraphId = model.id;
        if (!graphs[childGraphId]) {
            graphs[childGraphId] = {
                graph: new joint.dia.Graph({}, { cellNamespace: namespace }),
                parent: currentGraphId
            };
        }
        currentGraphId = childGraphId;
        paper.model = graphs[currentGraphId].graph;
        updateBreadcrumb();
    }
});

function createFunction(x, y, name, inputs, controls, outputs, mechanisms) {
    const newFunction = new joint.shapes.idef.Function({
        position: { x, y },
        size: { width: 200, height: 100 },
        attrs: { label: { text: name } }
    });

    const portItems = [];
    if (inputs) inputs.forEach(input => portItems.push({ group: 'in', attrs: { label: { text: input } } }));
    if (controls) controls.forEach(control => portItems.push({ group: 'control', attrs: { label: { text: control } } }));
    if (outputs) outputs.forEach(output => portItems.push({ group: 'out', attrs: { label: { text: output } } }));
    if (mechanisms) mechanisms.forEach(mechanism => portItems.push({ group: 'mechanism', attrs: { label: { text: mechanism } } }));

    newFunction.addPorts(portItems);
    graphs[currentGraphId].graph.addCell(newFunction);
    return newFunction;
}

function createIcomArrow(source, sourcePort, target, targetPort, label) {
    const link = new joint.shapes.standard.Link({
        source: { id: source.id, port: sourcePort },
        target: { id: target.id, port: targetPort },
        attrs: { line: { stroke: '#333' } }
    });
    if (label) {
        link.appendLabel({ attrs: { text: { text: label } } });
    }
    graphs[currentGraphId].graph.addCell(link);
    return link;
}

// Initial setup
const func1 = createFunction(100, 200, 'Function 1', ['Input A'], ['Control A'], ['Output A'], ['Mechanism A']);
const func2 = createFunction(500, 200, 'Function 2', ['Input B'], ['Control B'], ['Output B'], ['Mechanism B']);
const outputPort = func1.getPorts().find(p => p.group === 'out');
const inputPort = func2.getPorts().find(p => p.group === 'in');
if (outputPort && inputPort) {
    createIcomArrow(func1, outputPort.id, func2, inputPort.id, 'Data from F1 to F2');
}

let functionCounter = 0;
document.getElementById('add-function-btn').addEventListener('click', () => {
    functionCounter++;
    const newFunctionName = `Function ${graphs[currentGraphId].graph.getElements().length + 1}`;
    const x = 50 + (functionCounter % 5) * 50;
    const y = 50 + Math.floor(functionCounter / 5) * 50;
    createFunction(x, y, newFunctionName, ['Input'], ['Control'], ['Output'], ['Mechanism']);
});

paper.on('element:pointerdblclick', (elementView) => {
    const model = elementView.model;
    if (model instanceof joint.shapes.idef.Function) {
        // Create an input field for editing
        const bbox = elementView.getBBox();
        const input = document.createElement('input');
        input.type = 'text';
        input.value = model.attr('label/text');
        input.style.position = 'absolute';
        input.style.left = `${bbox.x + paper.el.offsetLeft}px`;
        input.style.top = `${bbox.y + paper.el.offsetTop}px`;
        input.style.width = `${bbox.width}px`;
        input.style.height = `${bbox.height}px`;
        input.style.textAlign = 'center';
        input.style.fontSize = '14px';
        input.style.boxSizing = 'border-box';
        document.body.appendChild(input);

        input.focus();
        input.select();

        const onEndEditing = () => {
            model.attr('label/text', input.value);
            document.body.removeChild(input);
        };

        input.addEventListener('blur', onEndEditing);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                input.blur();
            } else if (e.key === 'Escape') {
                document.body.removeChild(input);
            }
        });
    }
});

function updateBreadcrumb() {
    const breadcrumb = document.getElementById('breadcrumb');
    breadcrumb.innerHTML = '';
    const path = [];
    let id = currentGraphId;

    while (id) {
        let name = 'Root';
        if (id !== 'root') {
            const parentGraph = graphs[graphs[id].parent].graph;
            const cell = parentGraph.getCell(id);
            if (cell) {
                name = cell.attr('label/text');
            } else {
                name = 'Unknown'; // Should not happen
            }
        }
        path.unshift({ id, name });
        id = graphs[id].parent;
    }

    path.forEach((item, index) => {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = item.name;
        link.dataset.graphId = item.id;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentGraphId = e.target.dataset.graphId;
            paper.model = graphs[currentGraphId].graph;
            updateBreadcrumb();
        });
        breadcrumb.appendChild(link);
        if (index < path.length - 1) {
            breadcrumb.append(' > ');
        }
    });
}

const breadcrumbContainer = document.createElement('div');
breadcrumbContainer.id = 'breadcrumb';
document.body.insertBefore(breadcrumbContainer, document.getElementById('paper-container'));

updateBreadcrumb();

// Expose to window for testing
window.paper = paper;
window.graphs = graphs;
