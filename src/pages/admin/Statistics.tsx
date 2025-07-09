import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';
import { statisticsService } from '../../services/statistics.service';

// register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface TrendRow { month: string; active: number; inactive: number; }

const AdminStatisticsCharts: React.FC = () => {
  const [trend, setTrend] = useState<TrendRow[]>([]);
  const [publish, setPublish] = useState<any>(null);
  const [accounts, setAccounts] = useState<any>(null);
  const [topSubjects, setTopSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendRes, publishRes, accRes, topRes] = await Promise.all([
          statisticsService.getSubjectStatus(12),
          statisticsService.getPublishStatus(),
          statisticsService.getAccountTotals(),
          statisticsService.getTopSubjects(5),
        ]);

        setTrend(trendRes.data || trendRes);
        setPublish(publishRes.data || publishRes);
        setAccounts(accRes.data || accRes);
        setTopSubjects(topRes.data || topRes);
      } catch (err) {
        console.error('Fetch statistics error', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" /></div>
    );
  }

  // Chart configurations
  const barData = {
    labels: trend.map(t => t.month),
    datasets: [
      { label: 'Hoạt động', data: trend.map(t => t.active), backgroundColor: '#4f46e5' },
      { label: 'Ngưng hoạt động', data: trend.map(t => t.inactive), backgroundColor: '#a5b4fc' },
    ],
  };

  const chapterDoughData = {
    labels: ['Xuất bản', 'Bản nháp'],
    datasets: [{
      data: publish ? [publish.chapters.published, publish.chapters.draft] : [0, 0],
      backgroundColor: ['#10b981', '#d1d5db'],
    }],
  };

  const lectureDoughData = {
    labels: ['Xuất bản', 'Bản nháp'],
    datasets: [{
      data: publish ? [publish.lectures.published, publish.lectures.draft] : [0, 0],
      backgroundColor: ['#3b82f6', '#d1d5db'],
    }],
  };

  const roleLabelMap: Record<string,string> = { admin: 'Quản trị', lecturer: 'Giảng viên', student: 'Sinh viên' };
  const accountPieData = {
    labels: Object.keys(accounts || {}).map(k=>roleLabelMap[k] || k),
    datasets: [{
      data: Object.values(accounts || {}),
      backgroundColor: ['#60a5fa', '#34d399', '#f87171'],
    }],
  };

  const topBarData = {
    labels: topSubjects.map(s => s.subject_name),
    datasets: [{
      label: 'Số lớp học phần',
      data: topSubjects.map(s => s.classes),
      backgroundColor: '#fbbf24',
    }],
  };

  const barOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' as const } } };
  const horizontalOptions: ChartOptions<'bar'> = { ...barOptions, indexAxis: 'y' as const };
  const chartHeight = 200;

  return (
    <div className="space-y-8">
      {/* Subject trend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Tổng số môn học Active/Inactive theo tháng</h3>
        <div className="h-[200px]">
          <Bar data={barData} options={barOptions} height={chartHeight} />
              </div>
            </div>

      {/* Publish status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2 text-center">Chương (Published / Draft)</h3>
          <div className="h-[200px]">
            <Doughnut data={chapterDoughData} height={chartHeight} />
          </div>
            </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold mb-2 text-center">Bài giảng (Published / Draft)</h3>
          <div className="h-[200px]">
            <Doughnut data={lectureDoughData} height={chartHeight} />
          </div>
        </div>
      </div>

      {/* Account roles */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2 text-center">Phân bố tài khoản theo vai trò</h3>
        <div className="h-[200px] mx-auto max-w-[300px]">
          <Pie data={accountPieData} height={chartHeight} />
        </div>
      </div>

      {/* Top subjects */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-2">Top môn học có nhiều lớp học phần nhất</h3>
        <div className="h-[200px]">
          <Bar data={topBarData} options={horizontalOptions} height={chartHeight} />
          </div>
        </div>
      </div>
    );
  };

// ----- removed legacy static cards and activities -----

const Statistics: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-3">Thống kê & Báo cáo</h1>
              <p className="text-blue-100 text-lg">Xem báo cáo tổng quan về hoạt động và hiệu suất của hệ thống.</p>
            </div>
          </div>
        </div>

        {/* Dynamic Charts Section */}
        <AdminStatisticsCharts />

        {/* end */}
      </div>
    </div>
  );
};

export default Statistics;