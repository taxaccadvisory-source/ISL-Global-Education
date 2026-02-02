
import React from 'react';
import { Course } from '../types';
import { Icons } from '../constants';

interface CourseCardProps {
  course: Course;
  onDelete: (id: string) => void;
  onEdit: (course: Course) => void;
  exchangeRate: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onDelete, onEdit, exchangeRate }) => {
  const totalMYR = course.priceMYR + (course.miscFeesMYR || 0);
  const totalBDT = Math.round(totalMYR * exchangeRate).toLocaleString();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition-all hover:shadow-md hover:border-blue-200 group relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-blue-50 text-blue-600 mb-2">
            {course.courseType}
          </span>
          <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
            {course.courseName}
          </h3>
          <p className="text-sm text-slate-400 font-medium">{course.universityName}</p>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={() => onEdit(course)}
            className="text-slate-300 hover:text-blue-500 transition-colors p-2 hover:bg-blue-50 rounded-lg"
            title="Edit Course"
          >
            <Icons.Pencil className="w-5 h-5" />
          </button>
          <button 
            onClick={() => onDelete(course.id)}
            className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
            title="Remove Course"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center text-xs font-semibold text-slate-500">
          <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {course.location}, Malaysia
        </div>

        <div className="bg-slate-50 rounded-xl p-3 space-y-2 border border-slate-100">
           <div className="flex justify-between items-center text-xs">
             <span className="text-slate-400 font-medium">Tuition Fees</span>
             <span className="text-slate-700 font-bold">RM {course.priceMYR.toLocaleString()}</span>
           </div>
           <div className="flex justify-between items-center text-xs">
             <span className="text-slate-400 font-medium">Misc. Fees</span>
             <span className="text-slate-700 font-bold">RM {(course.miscFeesMYR || 0).toLocaleString()}</span>
           </div>
           <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
             <span className="text-xs font-bold text-slate-800">Total (MYR)</span>
             <span className="text-sm font-extrabold text-blue-600">RM {totalMYR.toLocaleString()}</span>
           </div>
        </div>

        <div className="bg-emerald-600 rounded-xl px-4 py-3 flex flex-col shadow-inner">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest">Approx. BDT Amount</span>
            <span className="text-[10px] font-bold text-emerald-100 bg-emerald-700 px-1.5 py-0.5 rounded italic">Rate: {exchangeRate}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-white text-lg font-black tracking-tight">৳ {totalBDT}</span>
            <span className="text-emerald-200 text-xs font-medium">BDT</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
