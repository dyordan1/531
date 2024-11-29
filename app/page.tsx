'use client';

import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from '@/store/counterSlice';
import type { RootState } from '@/store';

export default function Home() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <div className="text-4xl font-bold">{count}</div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => dispatch(decrement())}
          >
            -
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => dispatch(increment())}
          >
            +
          </button>
        </div>
      </main>
    </div>
  );
}
