import React, { useState } from "react";

const initialRoles = [
  {
    id: 1,
    name: "Quản trị",
    desc: "Quản lý toàn bộ hệ thống",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25v-1.5A2.25 2.25 0 016.75 16.5h10.5a2.25 2.25 0 012.25 2.25v1.5" /></svg>
    ),
    gradient: 'from-blue-500 to-indigo-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    id: 2,
    name: "Giảng viên",
    desc: "Quản lý lớp phần, môn học",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
    ),
    gradient: 'from-green-500 to-emerald-500',
    bgGradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
  },
  {
    id: 3,
    name: "Sinh viên",
    desc: "Học tập, tham gia lớp",
    icon: (
      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 14c-4 0-7 1.5-7 3.5V20h14v-2.5c0-2-3-3.5-7-3.5z" /><circle cx="12" cy="8" r="4" /></svg>
    ),
    gradient: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-50 to-orange-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-700',
  },
];

const RoleManagement: React.FC = () => {
  const [roles] = useState(initialRoles);

  const RoleCard: React.FC<{ role: any }> = ({ role }) => {
    return (
      <div className="group h-full">
        <div className={`h-full flex flex-col shadow-lg border ${role.borderColor} bg-gradient-to-br ${role.bgGradient} group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 rounded-2xl relative overflow-hidden`}>
          {/* Header gradient bar */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${role.gradient}`} />
          
          <div className="flex-1 flex flex-col p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className={`rounded-xl bg-gradient-to-tr ${role.gradient} p-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {role.icon}
              </div>
            </div>

            {/* Content */}
            <div className="text-center flex-1 flex flex-col">
              <h3 className={`text-xl font-bold ${role.textColor} mb-3`}>{role.name}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">{role.desc}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-3">Quản lý Vai Trò</h1>
              <p className="text-blue-100 text-lg">Thông tin về các vai trò trong hệ thống và quyền hạn tương ứng.</p>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </div>

        {/* Empty State */}
        {roles.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 max-w-md mx-auto">
              <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Chưa có vai trò nào
              </h3>
              <p className="text-gray-500">
                Các vai trò sẽ xuất hiện ở đây
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
