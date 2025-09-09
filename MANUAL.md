# IDEF0 Function Modeler - Instruction Manual

This document provides instructions on how to use the IDEF0 Function Modeler application.

## Table of Contents
1.  [Getting Started](#getting-started)
2.  [Adding Functions](#adding-functions)
3.  [Editing Function Names](#editing-function-names)
4.  [Creating Sub-diagrams (Drill-Down)](#creating-sub-diagrams-drill-down)
5.  [Navigating the Diagram Hierarchy](#navigating-the-diagram-hierarchy)
6.  [Connecting Functions (ICOM Arrows)](#connecting-functions-icom-arrows)
7.  [Editing Arrow Labels](#editing-arrow-labels)

---

### Getting Started

The IDEF0 Function Modeler is a web-based tool for creating function models based on the IDEF0 methodology. The application allows you to create a hierarchical set of diagrams to model complex processes.

To start, simply open the `index.html` file in a web browser.

### Adding Functions

To add a new function box to the current diagram, click the **"Add Function"** button at the top of the page. A new function box will appear on the canvas.

### Editing Function Names

To edit the name of a function, **double-click** on the function box. An input field will appear over the function's name. Type the new name and press **Enter** or click outside the input field to save the change.

### Creating Sub-diagrams (Drill-Down)

Each function in an IDEF0 model can be decomposed into a more detailed sub-diagram. To drill down into a function and view or create its sub-diagram, click the **blue triangle** icon in the top-right area of the function box.

This will take you to a new, empty canvas where you can model the sub-process of the function.

### Navigating the Diagram Hierarchy

When you drill down into a sub-diagram, a breadcrumb navigation trail will appear at the top of the page (e.g., `Root > Function 1`).

To navigate back to a parent diagram, simply click on its name in the breadcrumb trail.

### Connecting Functions (ICOM Arrows)

To connect two function boxes, you can create an ICOM (Input, Control, Output, Mechanism) arrow between them. To do this:

1.  Hover over a function box to see its ports (the small circles on its border).
2.  Click and drag from one of the ports to a port on another function box.
3.  An arrow will be created between the two ports.

The type of arrow is determined by the port you connect it to:
-   **Input:** Left side of the box.
-   **Control:** Top side of the box.
-   **Output:** Right side of the box.
-   **Mechanism:** Bottom side of the box.

### Editing Arrow Labels

Each arrow has a label that can be edited. To edit an arrow's label, **double-click** on the label text. An input field will appear, allowing you to change the label. Press **Enter** or click outside the input field to save the new label.
