
import React, { useState, useEffect, useMemo } from 'react';
import { CourseType, Course } from '../types';
import { LOCATIONS, Icons } from '../constants';

interface CourseFormProps {
  onAdd: (course: Course) => void;
  onUpdate: (course: Course) => void;
  onClose: () => void;
  courseToEdit?: Course | null;
  existingLocations?: string[];
}

const CourseForm: React.FC<CourseFormProps> = ({ onAdd, onUpdate, onClose, courseToEdit, existingLocations = [] }) => {
  const [formData, setFormData] = useState({
    universityName: '',
    courseName: '',
    courseType: CourseType.Bachelor,
    priceMYR: '', // Tuition
    miscFeesMYR: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        universityName: courseToEdit.universityName,
        courseName: courseToEdit.courseName,
        courseType: courseToEdit.courseType,
        priceMYR: courseToEdit.priceMYR.toString(),
        miscFeesMYR: (courseToEdit.miscFeesMYR || 0).toString(),
        location: courseToEdit.location,
        description: courseToEdit.description || ''
      });
    } else {
        // Default location for new courses if any exist
        setFormData(prev => ({ ...prev, location: existingLocations[0] || LOCATIONS[0] }));
    }
  }, [courseToEdit, existingLocations]);

  const totalMYR = (Number(formData.priceMYR) || 0) + (Number(formData.miscFeesMYR) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Course = {
      id: courseToEdit ? courseToEdit.id : crypto.randomUUID(),
      universityName: formData.universityName,
      courseName: formData.courseName,
      courseType: formData.courseType,
      priceMYR: Number(formData.priceMYR),
      miscFeesMYR: Number(formData.miscFeesMYR),
      location: formData.location.trim(),
      description: formData.description
    };

    if (courseToEdit) {
      onUpdate(data);
    } else {
      onAdd(data);
    }
    onClose();
  };

  const locationSuggestions = useMemo(() => {
    return Array.from(new Set([...LOCATIONS, ...existingLocations])).sort();
  }, [existingLocations]);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <h2 className="text-lg font-bold flex items-center">
            {courseToEdit ? <Icons.Pencil className="w-5 h-5 mr-2" /> : <Icons.Plus className="w-5 h-5 mr-2" />}
            {courseToEdit ? 'Edit Course Details' : 'Add New University Course'}
          </h2>
          <button onClick={onClose} className="hover:bg-blue-500 rounded-full p-1 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">University Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Taylor's University"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.universityName}
              onChange={e => setFormData({ ...formData, universityName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Course Name</label>
            <input
              required
              type="text"
              placeholder="e.g. B.Sc. in Computer Science"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={formData.courseName}
              onChange={e => setFormData({ ...formData, courseName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Course Level</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.courseType}
                onChange={e => setFormData({ ...formData, courseType: e.target.value as CourseType })}
              >
                {Object.values(CourseType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Location</label>
              <div className="relative">
                  <input
                    required
                    list="location-list"
                    type="text"
                    placeholder="Search or type new..."
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                  />
                  <datalist id="location-list">
                    {locationSuggestions.map(loc => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                  <p className="mt-1 text-[10px] text-slate-400">Pick from list or type a new city</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tuition Fees (MYR)</label>
              <input
                required
                type="number"
                placeholder="0"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.priceMYR}
                onChange={e => setFormData({ ...formData, priceMYR: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Misc Fees (MYR)</label>
              <input
                type="number"
                placeholder="0"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.miscFeesMYR}
                onChange={e => setFormData({ ...formData, miscFeesMYR: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-blue-700">Total Fees (MYR):</span>
              <span className="text-xl font-extrabold text-blue-800">RM {totalMYR.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-[0.98] mt-4"
          >
            {courseToEdit ? 'Update Changes' : 'Save New Course'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
