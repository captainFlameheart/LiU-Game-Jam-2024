class SeparationAxis {
    edge: number;
    vertex: number;
    penetration: number;

    constructor(edge: number, vertex: number, penetration: number) {
        this.edge = edge;
        this.vertex = vertex;
        this.penetration = penetration;
    }
}

function findClosestVertexInDirection(
    polygon: ConvexPolygon, direction: Vector2D
) {
    let closestVertex = -1;
    let minDistance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < polygon.vertices.length; i++) {
        const distance = Vector2D.dot(direction, polygon.vertices[i]);
        if (distance < minDistance) {
            closestVertex = i;
            minDistance = distance;
        }
    }
    return [closestVertex, minDistance];
}

function findSeparationAxis(
    referencePolygon: ConvexPolygon, incidentPolygon: ConvexPolygon, 
    separationAxis: SeparationAxis
) {
    for (let i = 0; i < referencePolygon.vertices.length; i++) {
        const normal = referencePolygon.normals[i];
        const [closestVertex, minDistance] = findClosestVertexInDirection(
            incidentPolygon, normal
        );
        const penetration = 
            Vector2D.dot(normal, referencePolygon.vertices[i]) - 
            minDistance;
        if (penetration < 0) {
            return false;
        }
        if (penetration < separationAxis.penetration) {
            separationAxis.edge = i;
            separationAxis.vertex = closestVertex;
            separationAxis.penetration = penetration;
        }
    }
    return true;
}

function clipIncidentVertex(
    referencePolygon: ConvexPolygon, referenceVertex: number, 
    referenceNormal: number, directionSign: number, 
    incidentPolygon: ConvexPolygon, 
    incidentClipVertex: number, incidentTargetVertex: number
) {
    const referenceNormalVector = referencePolygon.normals[referenceNormal];
    const direction = Vector2D.zCross(directionSign, referenceNormalVector);

    const referenceVertexVector =  referencePolygon.vertices[referenceVertex];
    const incidentClipVertexVector = incidentPolygon.vertices[incidentClipVertex];
    const incidentTargetVertexVector = incidentPolygon.vertices[incidentTargetVertex];

    let clippedVertex = incidentClipVertexVector.copy();
    const outOfBounds = Vector2D.dot(
        direction, Vector2D.subtract(
            incidentClipVertexVector, referenceVertexVector
        )
    );
    if (outOfBounds < 0) {
        return clippedVertex
    }
    const toTargetVector = Vector2D.subtract(
        incidentTargetVertexVector, incidentClipVertexVector
    );
    const outOfBoundsFraction = -outOfBounds / Vector2D.dot(
        direction, toTargetVector
    );
    clippedVertex.addMultiplied(toTargetVector, outOfBoundsFraction);
    return clippedVertex;
}

function clipIncidentEdge(
    referencePolygon: ConvexPolygon, referenceEdge: number, 
    incidentPolygon: ConvexPolygon, 
    clockwiseIncidentVertex: number, counterClockwiseIncidentVertex: number
) {
    const clockwiseReferenceVertex = referenceEdge;
    let counterClockwiseReferenceVertex = referenceEdge + 1;
    if (counterClockwiseReferenceVertex === referencePolygon.vertices.length) {
        counterClockwiseReferenceVertex = 0;
    }

    const clippedVertex0 = clipIncidentVertex(
        referencePolygon, counterClockwiseReferenceVertex, referenceEdge, 1, 
        incidentPolygon, 
        clockwiseIncidentVertex, counterClockwiseIncidentVertex
    );
    const clippedVertex1 = clipIncidentVertex(
        referencePolygon, clockwiseReferenceVertex, referenceEdge, -1, 
        incidentPolygon, 
        counterClockwiseIncidentVertex, clockwiseIncidentVertex
    );
    return [clippedVertex0, clippedVertex1];
}

function findContactPoints(
    referencePolygon: ConvexPolygon, incidentPolygon: ConvexPolygon, 
    separationAxis: SeparationAxis
) {
    let counterClockwiseIncidentNormal = separationAxis.vertex;
    const clockwiseIncidentNormal = (counterClockwiseIncidentNormal === 0 ? 
        incidentPolygon.normals.length - 1 : counterClockwiseIncidentNormal - 1
    );
    const referenceNormalVector = referencePolygon.normals[separationAxis.edge];
    
    let clockwiseIncidentVertex;
    let counterClockwiseIncidentVertex;
    if (
        Vector2D.dot(
            referenceNormalVector, 
            incidentPolygon.normals[clockwiseIncidentNormal]
        ) < 
        Vector2D.dot(
            referenceNormalVector, 
            incidentPolygon.normals[counterClockwiseIncidentNormal]
        )
    ) {
        clockwiseIncidentVertex = clockwiseIncidentNormal;
        counterClockwiseIncidentVertex = separationAxis.vertex;

    } else {
        clockwiseIncidentVertex = separationAxis.vertex;
        counterClockwiseIncidentVertex = separationAxis.vertex + 1;
        if (counterClockwiseIncidentVertex === incidentPolygon.vertices.length) {
            counterClockwiseIncidentVertex = 0;
        }
    }
    const [incidentVertex0, incidentVertex1] = clipIncidentEdge(
        referencePolygon, separationAxis.edge, incidentPolygon,  
        clockwiseIncidentVertex, counterClockwiseIncidentVertex
    );
    const referenceNormalPosition = Vector2D.dot(
        referenceNormalVector, referencePolygon.vertices[separationAxis.edge]
    );
    const contactPoints = [];
    
    const penetration0 = 
        referenceNormalPosition - 
        Vector2D.dot(referenceNormalVector, incidentVertex0);
    if (penetration0 >= 0) {
        contactPoints.push(ContactPoint.of(incidentVertex0, penetration0));
    }
    const penetration1 = 
        referenceNormalPosition - 
        Vector2D.dot(referenceNormalVector, incidentVertex1);
    if (penetration1 >= 0) {
        contactPoints.push(ContactPoint.of(incidentVertex1, penetration1));
    }

    return contactPoints;
}

function convexPolygonVsConvexPolygon(
    polygon0: ConvexPolygon, polygon1: ConvexPolygon
) {
    const separationAxis = new SeparationAxis(-1, -1, Number.POSITIVE_INFINITY);
    if (!findSeparationAxis(polygon0, polygon1, separationAxis)) {
        return null;
    }
    const oldPenetration = separationAxis.penetration;
    if (!findSeparationAxis(polygon1, polygon0, separationAxis)) {
        return null;
    }
    let swap = (separationAxis.penetration < oldPenetration);
    
    let referencePolygon;
    let incidentPolygon;
    let contactNormal;
    if (swap) {
        referencePolygon = polygon1;
        incidentPolygon = polygon0;
        contactNormal = Vector2D.copy(polygon1.normals[separationAxis.edge]);
    } else {
        referencePolygon = polygon0;
        incidentPolygon = polygon1;
        contactNormal = Vector2D.negate(polygon0.normals[separationAxis.edge]);
    }
    const contactPoints = findContactPoints(
        referencePolygon, incidentPolygon, separationAxis
    );

    return ContactManifold.of(contactPoints, contactNormal);
}