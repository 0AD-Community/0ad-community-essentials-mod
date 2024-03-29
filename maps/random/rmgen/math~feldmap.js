/**
 * Flood fill algorithm to obtain all connected points with respect to the given list of tileClass.
 * @param {Vector2D} start The starting tile for the flood fill.
 * @param {Constraint[]} constraints All the constraints to check against.
 * @returns {Vector2D[]} The area of all tiles connected to the start.
 */
function floodFill(start, constraints)
{
	const constraint = new AndConstraint(constraints);
	const processedTiles = new Uint8Array(mapSize * mapSize);
	const tilesStack = [start];
	const connectedArea = [];

	while (tilesStack.length > 0)
	{
		const position = tilesStack.pop();

		if (!g_Map.validTile(position)) continue;

		const idx = position.x * mapSize + position.y; // The above check enforces that this would never be out of bounds.

		if (processedTiles[idx] != 0) continue;

		if (!constraint.allows(position))
		{
			processedTiles[idx] = 1;
			continue;
		}

		processedTiles[idx] = 1;
		connectedArea.push(position);
		tilesStack.push(new Vector2D(position.x + 1, position.y));
		tilesStack.push(new Vector2D(position.x - 1, position.y));
		tilesStack.push(new Vector2D(position.x, position.y + 1));
		tilesStack.push(new Vector2D(position.x, position.y - 1));
	}

	return new Area(connectedArea);
}
