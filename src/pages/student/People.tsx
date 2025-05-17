import { Users, User } from "lucide-react";

const teachers = [
  { id: 1, name: "John Doe", email: "john.doe@email.com" },
];
const students = [
  { id: 2, name: "Alice Brown", email: "alice.brown@email.com" },
  { id: 3, name: "Bob Smith", email: "bob.smith@email.com" },
  { id: 4, name: "Charlie Lee", email: "charlie.lee@email.com" },
];

export function People() {
  return (
    <div className="space-y-6 px-2 sm:px-0">
      <div className="flex items-center gap-3 mb-4">
        <Users className="h-7 w-7 text-purple-600" />
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">People</h1>
      </div>
      <div className="mb-2 text-lg font-semibold text-gray-700">Teachers</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {teachers.map(t => (
          <div key={t.id} className="flex items-center gap-4 bg-white rounded-lg shadow p-4 w-full">
            <User className="h-10 w-10 text-purple-500 bg-purple-100 rounded-full p-2" />
            <div>
              <div className="font-medium text-gray-800">{t.name}</div>
              <div className="text-sm text-gray-500">{t.email}</div>
              <div className="text-xs text-purple-600 font-semibold mt-1">Teacher</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-2 text-lg font-semibold text-gray-700">Students</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {students.map(s => (
          <div key={s.id} className="flex items-center gap-4 bg-white rounded-lg shadow p-4 w-full">
            <User className="h-10 w-10 text-blue-500 bg-blue-100 rounded-full p-2" />
            <div>
              <div className="font-medium text-gray-800">{s.name}</div>
              <div className="text-sm text-gray-500">{s.email}</div>
              <div className="text-xs text-blue-600 font-semibold mt-1">Student</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 