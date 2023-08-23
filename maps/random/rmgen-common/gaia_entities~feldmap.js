/**
 * Places player additionnal food around his base in a balanced way
 * such that every player will have approximately the same quantity of food.
 * The total quantity of food, and the distribution between hunt and berries
 * can also be defined in the argument.

 * @param areas - The surrounding area of each player, where resources will be placed.
 * @param oBerryMain - The template of the berry resource.
 * @param oBerryStraggler - The template of the berry straggler tree, if null it won't be placed.
 * @param oMainHuntable - The template of the main huntable animal.
 * @param oSecondaryHuntable - The template of the secondary huntable animal.
 * @param clFood - The 'food' class to paint.
 * @param constraints - Custom constraints.
 * @param foodAvailability - A relative number describing how abundant food should be.
 * @param huntBerryRatio - A relative number defining which resource is most likely to be picked.
 */
function placePlayerFoodBalanced(
	areas,
	oBerryMain,
	oBerryStraggler,
	oMainHuntable,
	oSecondaryHuntable,
	clFood,
	constraints,
	foodAvailability = 1,
	huntBerryRatio = 1
)
{
	const foodPath = "ResourceSupply/Max";
	const mainBerryFood = GetBaseTemplateDataValue(
		Engine.GetTemplate(oBerryMain),
		foodPath
	);
	const mainHuntableFood = GetBaseTemplateDataValue(
		Engine.GetTemplate(oMainHuntable),
		foodPath
	);
	const secondaryHuntableFood = GetBaseTemplateDataValue(
		Engine.GetTemplate(oSecondaryHuntable),
		foodPath
	);
	const constraint = new AndConstraint(constraints);
	const place = function(type, amount, area) {
		const group = new SimpleGroup(
			[new SimpleObject(type, amount, amount, 0, 4)],
			true,
			clFood
		);
		createObjectGroupsByAreas(group, 0, constraints, 1, 300, [area]);
	};

	let totalFood = randIntInclusive(0, 20) * 100 * foodAvailability;
	totalFood += Math.max(mainHuntableFood, secondaryHuntableFood) * 5;
	if (randBool(0.2)) totalFood = 0;

	for (const area of areas)
	{
		let remainingFood = totalFood;
		while (remainingFood > 0)
		{
			if (remainingFood <= 700)
			{
				// We want to get as close to 0 as possible to end food placement.
				// In low quantities of food, berries are less useful, so we generate hunt everytime.
				let smallestAnimal, smallestAnimalFood;
				if (mainHuntableFood < secondaryHuntableFood)
				{
					smallestAnimal = oMainHuntable;
					smallestAnimalFood = mainHuntableFood;
				}
				else
				{
					smallestAnimal = oSecondaryHuntable;
					smallestAnimalFood = secondaryHuntableFood;
				}
				const amount = remainingFood / smallestAnimalFood;
				place(smallestAnimal, amount, area);
				remainingFood = 0;
			}
			else
			{
				if (randBool(0.5 * huntBerryRatio))
				{
					let currentAnimal, currentAnimalFood;
					if (randBool(0.5))
					{
						currentAnimal = oMainHuntable;
						currentAnimalFood = mainHuntableFood;
					}
					else
					{
						currentAnimal = oMainHuntable;
						currentAnimalFood = mainHuntableFood;
					}
					const maxAmount = remainingFood / currentAnimalFood;
					let desiredAmount = randIntInclusive(5, 7);
					desiredAmount = Math.max(
						desiredAmount,
						(desiredAmount * 100) / currentAnimalFood
					);
					const amount = Math.min(maxAmount, desiredAmount);
					remainingFood -= amount * currentAnimalFood;
					place(currentAnimal, amount, area);
				}
				else
				{
					const amount = Math.min(remainingFood, 1200) / mainBerryFood;
					remainingFood -= amount * mainBerryFood;
					place(oBerryMain, amount, area);
				}
			}
		}
	}
}
