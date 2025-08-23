'use client';
import React, { useState, useRef, KeyboardEvent } from 'react';
import { ChevronRight, ChevronLeft, Upload, X, CheckCircle, User, GraduationCap, FileText, Award, Calendar, MapPin, Phone, Mail, Building } from 'lucide-react';
import { z } from 'zod';

const FileSchema = z.object({
  file: z.any().nullable(),
  extractedData: z.string()
});

const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"])
});

const OnboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["male", "female"]).optional(),
  course: z.string().min(1, "Course is required"),
  stream: z.string().min(1, "Stream is required"),
  batch: z.string().min(4, "Batch must be valid year"),
  institute: z.string().min(1, "Institute is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  dob: z.string().min(1, "Date of birth is required"),
  active_backlog: z.number().min(0).default(0),
  resume: z.any().nullable(),
  results: z.object({
    '10th': FileSchema,
    '12th': FileSchema,
    'sem1': FileSchema,
    'sem2': FileSchema,
    'sem3': FileSchema,
    'sem4': FileSchema,
    'sem5': FileSchema,
    'sem6': FileSchema,
    'sem7': FileSchema,
  }),
  skills: z.array(SkillSchema)
});

type OnboardingFormData = z.infer<typeof OnboardingSchema>;
type FileData = z.infer<typeof FileSchema>;
type Skill = z.infer<typeof SkillSchema>;

const OnboardingForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: '',
    gender: undefined,
    course: '',
    stream: '',
    batch: '',
    institute: '',
    email: '',
    phone: '',
    address: '',
    dob: '',
    active_backlog: 0,
    resume: null,
    results: {
      '10th': { file: null, extractedData: '' },
      '12th': { file: null, extractedData: '' },
      'sem1': { file: null, extractedData: '' },
      'sem2': { file: null, extractedData: '' },
      'sem3': { file: null, extractedData: '' },
      'sem4': { file: null, extractedData: '' },
      'sem5': { file: null, extractedData: '' },
      'sem6': { file: null, extractedData: '' },
      'sem7': { file: null, extractedData: '' },
    },
    skills: []
  });
  
  const [skillInput, setSkillInput] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<Skill['level']>('Beginner');
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const skillInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  const steps = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Academic Details', icon: GraduationCap },
    { id: 3, title: 'Resume Upload', icon: FileText },
    { id: 4, title: 'Academic Results', icon: Award },
    { id: 5, title: 'Skills & Expertise', icon: CheckCircle }
  ];

  const processFile = async (file: File, resultKey?: string): Promise<string> => {
    const fileKey = resultKey || 'resume';
    setUploadingFiles(prev => ({ ...prev, [fileKey]: true }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockExtractedData = resultKey 
      ? `Extracted: ${resultKey.toUpperCase()} - CGPA: 8.5, Year: 2023`
      : 'Software Engineer with 2 years experience in React, Node.js';
    
    setUploadingFiles(prev => ({ ...prev, [fileKey]: false }));
    return mockExtractedData;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, resultKey?: keyof OnboardingFormData['results']) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (resultKey) {
      setFormData(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [resultKey]: { ...prev.results[resultKey], file }
        }
      }));
      
      const extractedData = await processFile(file, resultKey);
      setFormData(prev => ({
        ...prev,
        results: {
          ...prev.results,
          [resultKey]: { ...prev.results[resultKey], extractedData }
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, resume: file }));
      await processFile(file);
    }
  };

  const handleInputChange = (field: keyof OnboardingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && skillInput.trim()) {
      e.preventDefault();
      addSkillChip();
    }
  };

  const addSkillChip = () => {
    if (skillInput.trim() && !formData.skills.some(skill => skill.name.toLowerCase() === skillInput.trim().toLowerCase())) {
      const newSkill: Skill = { name: skillInput.trim(), level: skillLevel };
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
      setSkillInput('');
      skillInputRef.current?.focus();
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        break;
      case 2:
        if (!formData.course.trim()) newErrors.course = 'Course is required';
        if (!formData.stream.trim()) newErrors.stream = 'Stream is required';
        if (!formData.batch.trim()) newErrors.batch = 'Batch is required';
        if (!formData.institute.trim()) newErrors.institute = 'Institute is required';
        break;
      case 3:
        if (!formData.resume) newErrors.resume = 'Resume is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    try {
      const validatedData = OnboardingSchema.parse(formData);
      console.log('Form submitted:', validatedData);
      alert('Onboarding completed successfully!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error?.errors?.forEach((err: any) => {
          if (err.path.length > 0) {
            newErrors[err.path.join('.')] = err.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
          <select
            value={formData.gender || ''}
            onChange={(e) => handleInputChange('gender', e.target.value as 'male' | 'female' | undefined)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="+91 12345 67890"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth *</label>
          <input
            type="date"
            value={formData.dob}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.dob ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
          />
          {errors.dob && <p className="text-red-400 text-sm mt-1">{errors.dob}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address *</label>
          <textarea
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            rows={3}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors resize-none ${
              errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="Enter your address"
          />
          {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
        </div>
      </div>
    </div>
  );

  const renderAcademicDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Course *</label>
          <input
            type="text"
            value={formData.course}
            onChange={(e) => handleInputChange('course', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.course ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., Bachelor of Technology"
          />
          {errors.course && <p className="text-red-400 text-sm mt-1">{errors.course}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stream *</label>
          <input
            type="text"
            value={formData.stream}
            onChange={(e) => handleInputChange('stream', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.stream ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., Computer Science Engineering"
          />
          {errors.stream && <p className="text-red-400 text-sm mt-1">{errors.stream}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Batch *</label>
          <input
            type="text"
            value={formData.batch}
            onChange={(e) => handleInputChange('batch', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.batch ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., 2026"
          />
          {errors.batch && <p className="text-red-400 text-sm mt-1">{errors.batch}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Institute *</label>
          <input
            type="text"
            value={formData.institute}
            onChange={(e) => handleInputChange('institute', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.institute ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., Indian Institute of Technology"
          />
          {errors.institute && <p className="text-red-400 text-sm mt-1">{errors.institute}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Active Backlogs</label>
          <input
            type="number"
            value={formData.active_backlog}
            onChange={(e) => handleInputChange('active_backlog', parseInt(e.target.value) || 0)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="0"
            min="0"
          />
        </div>
      </div>
    </div>
  );

  const renderResumeUpload = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`border-2 border-dashed rounded-lg p-8 ${
          errors.resume ? 'border-red-500' : 'border-gray-600'
        }`}>
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-lg font-medium text-gray-300 mb-2">Upload your Resume *</div>
          <div className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX files only (Max 5MB)</div>
          <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Choose File
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e)}
              className="hidden"
            />
          </label>
          {formData.resume && (
            <div className="mt-4 text-sm text-green-400">
              ✓ {(formData.resume as File).name} uploaded successfully
            </div>
          )}
          {errors.resume && <p className="text-red-400 text-sm mt-2">{errors.resume}</p>}
        </div>
      </div>
    </div>
  );

  const renderAcademicResults = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Upload Academic Results</h3>
        <p className="text-sm text-gray-500">Upload your academic transcripts and mark sheets</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(formData.results).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 capitalize">
              {key === '10th' ? '10th Standard' : key === '12th' ? '12th Standard' : `Semester ${key.slice(-1)}`}
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="flex items-center justify-center p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-gray-500 transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {value.file ? (value.file as File).name : 'Choose file'}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload(e, key as keyof OnboardingFormData['results'])}
                    className="hidden"
                  />
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={value.extractedData}
                  readOnly
                  placeholder={uploadingFiles[key] ? 'Processing...' : 'Extracted data will appear here'}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none"
                />
              </div>
            </div>
            {uploadingFiles[key] && (
              <div className="text-sm text-blue-400 flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                Processing file...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium text-gray-300 mb-2">Add Your Skills</h3>
        <p className="text-sm text-gray-500">Type skills and press Tab to add them as chips</p>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="flex-1">
          <input
            ref={skillInputRef}
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleSkillKeyDown}
            placeholder="Type skill name and press Tab (e.g., JavaScript, Python)"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="w-32">
          <select
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value as Skill['level'])}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
        <button
          onClick={addSkillChip}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>

      {formData.skills.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Skills Added:</h4>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full text-sm"
              >
                <span className="text-white font-medium">{skill.name}</span>
                <span className="text-xs text-gray-300 bg-gray-700/50 px-2 py-0.5 rounded-full">
                  {skill.level}
                </span>
                <button
                  onClick={() => handleRemoveSkill(index)}
                  className="text-red-400 hover:text-red-300 transition-colors ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderAcademicDetails();
      case 3: return renderResumeUpload();
      case 4: return renderAcademicResults();
      case 5: return renderSkills();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="absolute inset-0 h-full w-full bg-transparent opacity-5 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Join Campus Placement Platform
          </h1>
          <p className="text-gray-400">Complete your profile to get started with AI-powered placement assistance</p>
        </div>

        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isActive ? 'border-blue-500 bg-blue-500' : 
                  isCompleted ? 'border-green-500 bg-green-500' : 
                  'border-gray-600 bg-gray-800'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-blue-400' : 
                    isCompleted ? 'text-green-400' : 
                    'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {renderCurrentStep()}

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg transition-colors ${
                currentStep === 1 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Complete Onboarding
                <CheckCircle className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;