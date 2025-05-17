// src/pages/TeacherGradebook.tsx
export function TeacherGradebook() {
    // Giả lập điểm
    const grades = [
      { id: 1, name: "Alice Brown", assignment: "HTML Basics", grade: 9 },
      { id: 2, name: "Bob Smith", assignment: "HTML Basics", grade: 8 },
    ];
    return (
      <div className="p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Gradebook</h1>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-2 text-left">Student</th>
              <th className="p-2 text-left">Assignment</th>
              <th className="p-2 text-left">Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(g => (
              <tr key={g.id} className="border-t">
                <td className="p-2">{g.name}</td>
                <td className="p-2">{g.assignment}</td>
                <td className="p-2">{g.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }