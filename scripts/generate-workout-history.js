const fs = require("fs");

function generateWorkoutData() {
    const maxes = {
        squat: 315,
        bench: 235,
        deadlift: 350,
        press: 135,
    };

    // Starting weight for the lifter
    const startingWeight = 165;
    let currentWeight = startingWeight;

    const baseData = {
        maxes,
        shouldIncrease: {
            squat: true,
            bench: true,
            deadlift: true,
            press: true,
        },
        weightUnit: "lbs",
        currentLift: "press",
        currentWeek: 1,
        preferredAssistance: {
            squat: ["Leg Press", "Leg Curls"],
            bench: ["Dumbbell Chest Press", "Dumbbell Rows"],
            deadlift: ["Good Mornings", "Hanging Leg Raises"],
            press: ["Dip", "Chin-Ups"],
        },
        latestWeight: startingWeight, // This will be updated as we generate history
    };

    const startDate = new Date("2024-01-01");
    const history = {};
    const lifts = ["press", "deadlift", "bench", "squat"];
    const trainingMaxes = {
        press: Math.floor(maxes.press * 0.9),
        deadlift: Math.floor(maxes.deadlift * 0.9),
        bench: Math.floor(maxes.bench * 0.9),
        squat: Math.floor(maxes.squat * 0.9),
    };
    const assistanceExercises = baseData.preferredAssistance;

    let currentDate = new Date(startDate);
    let liftIndex = 0;
    let week = 1;

    // Generate entries for a full year
    for (let i = 0; i < 4 * 4 * 12; i++) {
        // 4 lifts * 4 weeks * 12 months
        // Small random weight fluctuation (-0.4 to +0.6 lbs)
        currentWeight += Math.random() * 1 - 0.4;
        // Round to 1 decimal place
        currentWeight = Math.round(currentWeight * 10) / 10;

        const dateKey = currentDate
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "");
        const currentLift = lifts[liftIndex];

        // Randomly determine if the set was failed (10% chance)
        const failedSet = Math.random() < 0.1;
        const mainSets = failedSet
            ? { completed: [0, 1], failed: [2] }
            : { completed: [0, 1, 2], failed: [] };

        history[dateKey] = {
            date: currentDate.toISOString(),
            lift: currentLift,
            week,
            duration: 2400 + Math.floor(Math.random() * 1200), // Random duration between 40-60 minutes
            trainingMax: trainingMaxes[currentLift],
            selectedAssistance: assistanceExercises[currentLift],
            completedAssistance: assistanceExercises[currentLift],
            mainSets,
            weight: Math.round(currentWeight), // Add weight to each history entry
        };

        // Advance to next workout
        currentDate.setDate(currentDate.getDate() + 2);
        liftIndex = (liftIndex + 1) % 4;
        if (liftIndex === 0) {
            week = (week % 4) + 1;

            // Potentially increase training maxes at the start of new cycles
            if (week === 1) {
                Object.keys(trainingMaxes).forEach((lift) => {
                    if (Math.random() < 0.7) {
                        // 70% chance to increase
                        trainingMaxes[lift] += 5;
                    }
                });
            }
        }
    }

    return {
        ...baseData,
        maxes: {
            squat: Math.floor(trainingMaxes.squat / 0.9),
            bench: Math.floor(trainingMaxes.bench / 0.9),
            deadlift: Math.floor(trainingMaxes.deadlift / 0.9),
            press: Math.floor(trainingMaxes.press / 0.9),
        },
        latestWeight: Math.round(currentWeight),
        history,
    };
}

// Generate and save the data
const workoutData = generateWorkoutData();
const outputPath = "./example.json";

fs.writeFileSync(outputPath, JSON.stringify(workoutData, null, 2), "utf8");

console.log(`Workout data generated and saved to ${outputPath}`);
