
import React, { useState, useEffect, useMemo } from 'react';
import { Course, CourseType, FilterState } from './types';
import { LOCATIONS, Icons } from './constants';
import CourseCard from './components/CourseCard';
import CourseForm from './components/CourseForm';
import GeminiAssistant from './components/GeminiAssistant';
import SearchableSelect from './components/SearchableSelect';

const INITIAL_COURSES: Course[] = [
  { id: '1', universityName: 'Taylor\'s University', courseName: 'Bachelor of Computer Science', courseType: CourseType.Bachelor, priceMYR: 28000, miscFeesMYR: 2500, location: 'Selangor' },
  { id: '2', universityName: 'Sunway University', courseName: 'Diploma in Information Technology', courseType: CourseType.Diploma, priceMYR: 15500, miscFeesMYR: 1800, location: 'Selangor' },
  { id: '3', universityName: 'University of Malaya', courseName: 'Master of Engineering', courseType: CourseType.Master, priceMYR: 35000, miscFeesMYR: 3000, location: 'Kuala Lumpur' },
  { id: '4', universityName: 'Monash University', courseName: 'Bachelor of Business', courseType: CourseType.Bachelor, priceMYR: 32000, miscFeesMYR: 2800, location: 'Johor Bahru' },
];

const App: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('edubridge_courses_v2');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem('edubridge_rate');
    return saved ? parseFloat(saved) : 26.5;
  });

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    courseType: 'All',
    location: 'All',
    university: 'All',
    courseName: 'All',
    maxPrice: 150000,
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  useEffect(() => {
    localStorage.setItem('edubridge_courses_v2', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('edubridge_rate', exchangeRate.toString());
  }, [exchangeRate]);

  // Derive unique values for dropdowns
  const uniqueUniversities = useMemo(() => {
    const unis = Array.from(new Set(courses.map(c => c.universityName)));
    return unis.sort();
  }, [courses]);

  const uniqueCourseNames = useMemo(() => {
    const names = Array.from(new Set(courses.map(c => c.courseName)));
    return names.sort();
  }, [courses]);

  const uniqueCourseTypes = useMemo(() => {
    return Object.values(CourseType);
  }, []);

  // Dynamic locations based on base list + any custom locations added by user
  const dynamicLocations = useMemo(() => {
    const courseLocations = courses.map(c => c.location);
    const combined = Array.from(new Set([...LOCATIONS, ...courseLocations]));
    return combined.sort();
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const totalFees = course.priceMYR + (course.miscFeesMYR || 0);
      
      const matchesSearch = 
        course.universityName.toLowerCase().includes(filters.search.toLowerCase()) ||
        course.courseName.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesType = filters.courseType === 'All' || course.courseType === filters.courseType;
      const matchesLocation = filters.location === 'All' || course.location === filters.location;
      const matchesUniversity = filters.university === 'All' || course.universityName === filters.university;
      const matchesCourseName = filters.courseName === 'All' || course.courseName === filters.courseName;
      const matchesPrice = totalFees <= filters.maxPrice;

      return matchesSearch && matchesType && matchesLocation && matchesUniversity && matchesCourseName && matchesPrice;
    });
  }, [courses, filters]);

  const addCourse = (course: Course) => {
    setCourses([course, ...courses]);
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };

  const deleteCourse = (id: string) => {
    if (confirm('Are you sure you want to remove this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleEditClick = (course: Course) => {
    setCourseToEdit(course);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCourseToEdit(null);
  };

  const resetFilters = () => {
    setFilters({ 
      search: '', 
      courseType: 'All', 
      location: 'All', 
      university: 'All', 
      courseName: 'All', 
      maxPrice: 150000 
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Icons.Academic className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">EduBridge <span className="text-blue-600">Pro</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
              <span className="text-xs font-bold text-slate-400 uppercase">Rate: 1 RM =</span>
              <input 
                type="number" 
                step="0.1"
                className="w-16 bg-transparent border-none focus:ring-0 text-sm font-bold text-blue-600 outline-none"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
              />
              <span className="text-xs font-bold text-slate-400">BDT</span>
            </div>
            <button
              onClick={() => {
                setCourseToEdit(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-md shadow-blue-100 active:scale-95"
            >
              <Icons.Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Course</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Course Management</h2>
            <p className="text-slate-500">Managing fees for Malaysian Universities with real-time BDT conversion.</p>
          </div>
          <div className="md:hidden bg-white p-4 rounded-xl shadow-sm border border-slate-200">
             <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Exchange Rate (BDT/MYR)</label>
             <input 
                type="number" 
                step="0.1"
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-lg font-bold text-blue-600 outline-none"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
              />
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Keyword Search */}
            <div className="relative">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Keyword Search</label>
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type anything..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  value={filters.search}
                  onChange={e => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
            </div>

            {/* Searchable University Select */}
            <SearchableSelect
              label="University Name"
              placeholder="Select University"
              options={uniqueUniversities}
              value={filters.university}
              onChange={(val) => setFilters({ ...filters, university: val })}
            />

            {/* Searchable Course Name Select */}
            <SearchableSelect
              label="Course Name"
              placeholder="Select Course"
              options={uniqueCourseNames}
              value={filters.courseName}
              onChange={(val) => setFilters({ ...filters, courseName: val })}
            />

            {/* Searchable Level Select */}
            <SearchableSelect
              label="Course Level"
              placeholder="Select Level"
              options={uniqueCourseTypes}
              value={filters.courseType}
              onChange={(val) => setFilters({ ...filters, courseType: val })}
            />

            {/* Searchable Location Select */}
            <SearchableSelect
              label="Location"
              placeholder="Select Location"
              options={dynamicLocations}
              value={filters.location}
              onChange={(val) => setFilters({ ...filters, location: val })}
            />

            {/* Max Price Slider */}
            <div className="xl:col-span-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Max Total Fees: <span className="text-blue-600 font-bold">RM {filters.maxPrice.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="0"
                max="150000"
                step="5000"
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 mt-4"
                value={filters.maxPrice}
                onChange={e => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              />
            </div>

            {/* Reset Button */}
            <div className="flex items-end">
              <button 
                onClick={resetFilters}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-500 text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-700">
            Found {filteredCourses.length} {filteredCourses.length === 1 ? 'Course' : 'Courses'}
          </h3>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <CourseCard 
                key={course.id} 
                course={course} 
                onDelete={deleteCourse} 
                onEdit={handleEditClick} 
                exchangeRate={exchangeRate}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl py-20 flex flex-col items-center justify-center text-center px-4">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Icons.Search className="w-10 h-10 text-slate-300" />
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-1">No matches found</h4>
            <p className="text-slate-500 max-w-sm">
              We couldn't find any courses matching your current filters. Try adjusting your search or price range.
            </p>
            <button 
              onClick={resetFilters}
              className="mt-6 text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      <GeminiAssistant courses={courses} />

      {isFormOpen && (
        <CourseForm 
          onAdd={addCourse} 
          onUpdate={updateCourse} 
          onClose={handleCloseForm} 
          courseToEdit={courseToEdit}
          existingLocations={dynamicLocations}
        />
      )}
    </div>
  );
};

export default App;
