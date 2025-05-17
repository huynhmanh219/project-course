import { useState } from "react";
import { Button } from "../../components/ui/button";

export function TeacherCreateAssignment() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [due, setDue] = useState("");

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">Create Assignment</h1>
      <form className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-700">Title</label>
          <input className="w-full border rounded px-3 py-2" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Description</label>
          <textarea className="w-full border rounded px-3 py-2" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1 text-gray-700">Due Date</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={due} onChange={e => setDue(e.target.value)} />
        </div>
        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">Create</Button>
      </form>
    </div>
  );
} 