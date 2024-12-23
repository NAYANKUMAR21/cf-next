'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};
export const runtime = 'edge';

export default function Page() {
  const [todo, setTodo] = useState<Todo | null>(null); // State to store the todo
  const [loading, setLoading] = useState<boolean>(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error
  const params = useSearchParams();
  const slug = params.get('slug');
  console.log(slug);

  useEffect(() => {
    // Fetch a single todo by ID (e.g., ID 1)
    const fetchTodo = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos/1'
        );

        const data = await response.json();

        setTodo(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.log('error', err.message);
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [slug]);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 mt-8 flex justify-center">
      {todo ? (
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
          <h1 className="text-2xl font-semibold mb-4">Todo Details</h1>
          <p className="text-lg mb-2">
            <strong>ID:</strong> {todo.id}
          </p>
          <p className="text-lg mb-2">
            <strong>Title:</strong> {todo.title}
          </p>
          <p className="text-lg">
            <strong>Status:</strong>{' '}
            <span
              className={todo.completed ? 'text-green-500' : 'text-red-500'}
            >
              {todo.completed ? 'Completed' : 'Not Completed'}
            </span>
          </p>
        </div>
      ) : (
        <div className="text-center">No Todo Found</div>
      )}
    </div>
  );
}
