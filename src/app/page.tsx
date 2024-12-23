'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]); // State to store fetched todos
  const [newTodo, setNewTodo] = useState<string>(''); // State for the input field

  useEffect(() => {
    // Fetch todos from the API
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/todos'
        );
        const data = await response.json();
        setTodos(data.slice(0, 10)); // Limit to the first 10 todos for simplicity
      } catch (error) {
        console.error('Error fetching todos:', error);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = (event: any) => {
    event.preventDefault();
    if (!newTodo.trim()) return;

    // Add new todo locally
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Date.now(), title: newTodo, completed: false },
    ]);
    setNewTodo('');
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const routeDifPage = (id: number) => {
    router.push(`/${id}`);
  };
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 mt-8 flex flex-col items-center">
        <div className="w-full max-w-lg">
          <form id="todoForm" className="flex space-x-2" onSubmit={addTodo}>
            <input
              type="text"
              id="todoInput"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </form>
        </div>

        <div
          id="todoList"
          className="w-full max-w-lg mt-6 bg-white rounded-lg shadow-md p-4"
        >
          <h2 className="text-xl font-semibold mb-4">Your Todos</h2>
          <ul className="space-y-2" id="todoItems">
            {todos.map((todo: Todo, index: number) => (
              <div key={index}>
                <li
                  className={`bg-gray-100 p-2 rounded-md flex justify-between items-center ${
                    todo.completed ? 'line-through text-gray-500' : ''
                  }`}
                >
                  <Link href={`/${todo.id}`}>
                    <span>{todo.title}</span>
                  </Link>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 Todo App. All rights reserved.</p>
      </footer>
    </>
  );
}
