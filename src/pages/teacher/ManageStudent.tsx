// src/pages/TeacherManageStudents.tsx
export function TeacherManageStudents() {
    // Giả lập danh sách học sinh
    const students = [
      { id: 1, name: "Alice Brown", email: "alice@email.com" },
      { id: 2, name: "Bob Smith", email: "bob@email.com" },
    ];
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Manage Students</h1>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">
                  <button className="text-red-500 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }