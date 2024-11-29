'use client';

import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import { WeightDisplay } from '@/components/WeightDisplay';
import { WeightUnitToggle } from '@/components/WeightUnitToggle';

export default function Home() {
  const router = useRouter();
  const trainingMaxes = useAppSelector((state) => state.workout.maxes);
  const currentWeek = useAppSelector((state) => state.workout.currentWeek);
  const currentLift = useAppSelector((state) => state.workout.currentLift);
  const weightsInitialized = Object.values(trainingMaxes).every((weight) => weight > 0);

  const weekDisplay = currentWeek === 4 ? 'Deload Week' : `Week ${currentWeek}`;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 bg-gray-50">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">5/3/1 Workout Tracker</h1>
        <p className="mt-2 text-gray-600">Simplifying your strength journey</p>
      </header>

      <main className="flex flex-col gap-8 items-center justify-center">
        <div className="max-w-md w-full space-y-6">
          {weightsInitialized ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Your Program - {weekDisplay}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(trainingMaxes).map(([lift, weight]) => (
                  <div 
                    key={lift} 
                    className={`p-4 bg-white rounded-lg shadow-md relative ${
                      lift === currentLift ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    {lift === currentLift && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Up Next
                      </span>
                    )}
                    <h3 className="text-lg font-medium capitalize">{lift}</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      <WeightDisplay weight={weight} />
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => router.push('/workout')}
                className="w-full p-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Start Workout
              </button>
              <button
                onClick={() => router.push('/onboarding/existing')}
                className="w-full p-4 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors"
              >
                Edit Program
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => router.push('/onboarding/new')}
                className="w-full p-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                <h2 className="text-xl font-semibold">I&apos;m New to 5/3/1</h2>
                <p className="mt-2 text-sm opacity-90">
                  Get started with a guided setup and learn the program basics
                </p>
              </button>

              <button
                onClick={() => router.push('/onboarding/existing')}
                className="w-full p-6 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors"
              >
                <h2 className="text-xl font-semibold">I Know My Numbers</h2>
                <p className="mt-2 text-sm opacity-90">
                  Jump right in with your existing training maxes
                </p>
              </button>
            </>
          )}
        </div>
      </main>

      <WeightUnitToggle />

      <footer className="text-center py-4 text-gray-500">
        <p className="text-sm">Built for lifters, by lifters</p>
      </footer>
    </div>
  );
}
