export function TeacherClasses() {
  // Giả lập danh sách lớp
  const classes = [
    { id: 1, name: "Web Development", section: "CS101 - A" },
    { id: 2, name: "Data Structures", section: "CS201 - B" },
  ];
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">My Classes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold">{cls.name}</h2>
            <p className="text-gray-500">{cls.section}</p>
            <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">View Class</button>
          </div>
        ))}
      </div>
    </div>
  );
} 