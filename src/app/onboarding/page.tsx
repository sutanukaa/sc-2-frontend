'use client';
import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Upload, X, CheckCircle, User, GraduationCap, FileText, Award, Calendar, MapPin, Phone, Mail, Building } from 'lucide-react';
import { z } from 'zod';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const FileSchema = z.object({
  file: z.any().nullable(),
  extractedData: z.string()
});

const OnboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  course: z.string().optional(),
  stream: z.string().optional(),
  batch: z.string().optional(),
  institute: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
  active_backlog: z.number().min(0).default(0),
  resume_file_id: z.string().optional(),
  isCompleted: z.boolean().default(false),
  invite: z.array(z.string()).default([]),
  updatedAt: z.string().optional(),
  '10th': z.number().optional(),
  '12th': z.number().optional(),
  sem1: z.number().optional(),
  sem2: z.number().optional(),
  sem3: z.number().optional(),
  sem4: z.number().optional(),
  sem5: z.number().optional(),
  sem6: z.number().optional()
});

type OnboardingFormData = z.infer<typeof OnboardingSchema>;
type FileData = z.infer<typeof FileSchema>;

const OnboardingForm: React.FC = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const steps = [
        { id: 1, title: 'Personal Info', icon: User },
        { id: 2, title: 'Academic Details', icon: GraduationCap },
        { id: 3, title: 'Resume Upload', icon: FileText },
        { id: 4, title: 'Academic Results', icon: Award }
      ];
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
      resume_file_id: undefined,
      isCompleted: false,
      invite: [],
      updatedAt: undefined,
      '10th': undefined,
      '12th': undefined,
      sem1: undefined,
      sem2: undefined,
      sem3: undefined,
      sem4: undefined,
      sem5: undefined,
      sem6: undefined
    });
  
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadedFiles, setUploadedFiles] = useState<Record<string, {file: File, fileId?: string}>>({});
    const [successMessages, setSuccessMessages] = useState<Record<string, string>>({});

    const totalSteps = 4;

    // Calculate active backlogs based on semesters with GPA = 0
    const calculateActiveBacklogs = (): number => {
      const semesterGPAs = [formData.sem1, formData.sem2, formData.sem3, formData.sem4, formData.sem5, formData.sem6];
      return semesterGPAs.filter(gpa => gpa === 0).length;
    };

    // Upload file to bucket and return file ID
    const uploadFileToBucket = async (file: File, fileKey: string): Promise<string> => {
      setUploadingFiles(prev => ({ ...prev, [fileKey]: true }));
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileKey', fileKey);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error('File upload failed');
        }
        
        const result = await response.json();
        return result.fileId;
      } finally {
        setUploadingFiles(prev => ({ ...prev, [fileKey]: false }));
      }
    };

    // Extract GPA from uploaded academic result file
    const extractGPAFromFile = async (file: File, fileKey: string): Promise<number | null> => {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Use environment variable or fallback to localhost
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const apiEndpoint = `${backendUrl}/student/extract-gpa`;
        
        console.log(`Calling GPA extraction API: ${apiEndpoint}`);
        
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          body: formData,
        });
        console.log(response);
        if (!response.ok) {
          throw new Error(`GPA extraction failed: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('GPA extraction result:', result);
        
        const extractedGPA = result.GPA;
        
        // Check if GPA is a valid number
        if (extractedGPA && !isNaN(parseFloat(extractedGPA))) {
          const gpaValue = parseFloat(extractedGPA);
          // Ensure GPA is within valid range (0-10)
          if (gpaValue >= 0 && gpaValue <= 10) {
            console.log(`Successfully extracted GPA: ${gpaValue} for ${fileKey}`);
            return gpaValue;
          }
        }
        
        // If GPA is not a valid number or out of range, return 0
        console.log(`Invalid GPA extracted: ${extractedGPA}, setting to 0 for ${fileKey}`);
        return 0;
      } catch (error) {
        console.error('GPA extraction failed:', error);
        // Return 0 if extraction fails
        return 0;
      }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileKey: string = 'resume') => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        // Store file locally first
        setUploadedFiles(prev => ({ 
          ...prev, 
          [fileKey]: { file } 
        }));

        // For resume, immediately upload and get file ID
        if (fileKey === 'resume') {
          const fileId = await uploadFileToBucket(file, fileKey);
          setUploadedFiles(prev => ({ 
            ...prev, 
            [fileKey]: { file, fileId } 
          }));
          setFormData(prev => ({ ...prev, resume_file_id: fileId }));
        }
        
        // For academic result files, extract GPA and update form
        if (['10th', '12th', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'].includes(fileKey)) {
          // Show extracting state
          setUploadingFiles(prev => ({ ...prev, [fileKey]: true }));
          
          // Extract GPA from the uploaded file
          const extractedGPA = await extractGPAFromFile(file, fileKey);
          
          // Update form data with extracted GPA
          setFormData(prev => ({ ...prev, [fileKey]: extractedGPA }));
          
          // Upload file to bucket
          const fileId = await uploadFileToBucket(file, fileKey);
          setUploadedFiles(prev => ({
            ...prev,
            [fileKey]: { file, fileId }
          }));
          
          // Show success message
          setSuccessMessages(prev => ({ ...prev, [fileKey]: 'GPA extracted successfully!' }));
          setErrors(prev => ({ ...prev, [fileKey]: '' }));
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessages(prev => ({ ...prev, [fileKey]: '' }));
          }, 3000);
        }
        
        // Clear any existing errors for this field
        if (errors[fileKey]) {
          setErrors(prev => ({ ...prev, [fileKey]: '' }));
        }
      } catch (error) {
        console.error('File upload failed:', error);
        setErrors(prev => ({ ...prev, [fileKey]: 'File upload failed. Please try again.' }));
      } finally {
        setUploadingFiles(prev => ({ ...prev, [fileKey]: false }));
      }
    };

    // Upload all academic result files
    const uploadAllAcademicFiles = async (): Promise<boolean> => {
      const academicKeys = ['10th', '12th', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'];
      
      try {
        for (const key of academicKeys) {
          const fileData = uploadedFiles[key];
          if (fileData && fileData.file && !fileData.fileId) {
            const fileId = await uploadFileToBucket(fileData.file, key);
            setUploadedFiles(prev => ({
              ...prev,
              [key]: { ...prev[key], fileId }
            }));
          }
        }
        return true;
      } catch (error) {
        console.error('Academic files upload failed:', error);
        return false;
      }
    };

  const handleInputChange = (field: keyof OnboardingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        break;
      case 2:
        // All academic fields are optional, so no validation needed
        break;
      case 3:
        if (!formData.resume_file_id) newErrors.resume_file_id = 'Resume is required';
        break;
      case 4:
        // Academic results are optional
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

  const searchParams = useSearchParams();
  const userId = searchParams.get("uid");

  const handleFinalSubmit = async () => {
    if (!userId) {
      setError("User ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, upload all academic files
      const uploadSuccess = await uploadAllAcademicFiles();
      if (!uploadSuccess) {
        throw new Error("Academic files upload failed. Please try again.");
      }

      // Calculate active backlogs based on semesters with GPA = 0
      const activeBacklogs = calculateActiveBacklogs();
      
      // Prepare final form data
      const finalFormData = {
        ...formData,
        active_backlog: activeBacklogs,
        isCompleted: true,
        updatedAt: new Date().toISOString()
      };

      // Validate the final data
      const validatedData = OnboardingSchema.parse(finalFormData);

      // Create FormData for the API call
      const apiFormData = new FormData();
      apiFormData.append('userId', userId);
      
      // Add the resume file if it exists
      const resumeData = uploadedFiles['resume'];
      if (resumeData?.file) {
        apiFormData.append('resume', resumeData.file);
      }

      // Add other form data as JSON
      apiFormData.append('updateData', JSON.stringify(validatedData));

      const response = await fetch("/api/onboarding", {
        method: "POST",
        body: apiFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      router.push("/home/student");
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
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
            onChange={(e) => handleInputChange('gender', e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | undefined)}
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="+91 12345 67890"
          />
          {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Date of Birth</label>
          <input
            type="date"
            value={formData.dob || ''}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.dob ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
          />
          {errors.dob && <p className="text-red-400 text-sm mt-1">{errors.dob}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
          <textarea
            value={formData.address || ''}
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Course</label>
          <input
            type="text"
            value={formData.course || ''}
            onChange={(e) => handleInputChange('course', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.course ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., Bachelor of Technology"
          />
          {errors.course && <p className="text-red-400 text-sm mt-1">{errors.course}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Stream</label>
          <input
            type="text"
            value={formData.stream || ''}
            onChange={(e) => handleInputChange('stream', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.stream ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., Computer Science Engineering"
          />
          {errors.stream && <p className="text-red-400 text-sm mt-1">{errors.stream}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Batch</label>
          <input
            type="text"
            value={formData.batch || ''}
            onChange={(e) => handleInputChange('batch', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.batch ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., 2026"
          />
          {errors.batch && <p className="text-red-400 text-sm mt-1">{errors.batch}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Institute</label>
          <input
            type="text"
            value={formData.institute || ''}
            onChange={(e) => handleInputChange('institute', e.target.value)}
            className={`w-full p-3 rounded-lg bg-gray-800 border text-white focus:outline-none transition-colors ${
              errors.institute ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
            }`}
            placeholder="e.g., Indian Institute of Technology"
          />
          {errors.institute && <p className="text-red-400 text-sm mt-1">{errors.institute}</p>}
        </div>
      </div>
    </div>
  );

  const renderResumeUpload = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className={`border-2 border-dashed rounded-lg p-8 ${
          errors.resume_file_id ? 'border-red-500' : 'border-gray-600'
        }`}>
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-lg font-medium text-gray-300 mb-2">Upload your Resume *</div>
          <div className="text-sm text-gray-500 mb-4">PDF, DOC, or DOCX files only (Max 5MB)</div>
          
          {uploadingFiles.resume ? (
            <div className="text-blue-400 text-sm">Uploading resume...</div>
          ) : (
            <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Choose File
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'resume')}
                className="hidden"
              />
            </label>
          )}
          
          {uploadedFiles.resume && (
            <div className="mt-4 text-sm text-green-400">
              ✓ {uploadedFiles.resume.file.name} uploaded successfully
            </div>
          )}
          {errors.resume_file_id && <p className="text-red-400 text-sm mt-2">{errors.resume_file_id}</p>}
        </div>
      </div>
    </div>
  );

  const renderAcademicResults = () => (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Academic Results</h3>
        <p className="text-gray-400 text-sm">Enter your GPA for each semester. GPA of 0 indicates a backlog.</p>
      </div>

      {/* Active Backlogs Display */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-yellow-400">Active Backlogs:</span>
          <span className="text-lg font-bold text-yellow-400">{calculateActiveBacklogs()}</span>
        </div>
        <p className="text-xs text-yellow-400 mt-1">
          Calculated from semesters with GPA = 0
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(['10th', '12th', 'sem1', 'sem2', 'sem3', 'sem4', 'sem5', 'sem6'] as const).map((key) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 capitalize">
              {key === '10th' ? '10th Standard' : key === '12th' ? '12th Standard' : `${key.toUpperCase()} Semester`}
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  uploadingFiles[key] ? 'border-blue-500 bg-blue-500/10' : 
                  uploadedFiles[key] ? 'border-green-500 bg-green-500/10' : 
                  'border-gray-600 hover:border-gray-500'
                }`}>
                  {uploadingFiles[key] ? (
                    <div className="text-blue-400 text-sm">
                      {uploadedFiles[key]?.file ? 'Extracting GPA...' : 'Uploading...'}
                    </div>
                  ) : uploadedFiles[key] ? (
                    <div className="text-green-400 text-sm">
                      ✓ Uploaded
                      {formData[key] !== undefined && (
                        <div className="text-xs text-green-300 mt-1">
                          GPA: {formData[key]}
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center">
                      <Upload className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm text-gray-400">Choose file</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, key)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={formData[key] || ''}
                  onChange={(e) => handleInputChange(key, parseFloat(e.target.value) || undefined)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="Enter GPA (0-10)"
                />
                {uploadedFiles[key] && formData[key] !== undefined && (
                  <div className="text-xs text-green-400 mt-1">
                    ✓ Auto-extracted from file
                  </div>
                )}
                {successMessages[key] && (
                  <div className="text-xs text-green-400 mt-1 animate-pulse">
                    {successMessages[key]}
                  </div>
                )}
                {errors[key] && (
                  <div className="text-xs text-red-400 mt-1">
                    {errors[key]}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Submit Button - Only shown on last step */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className={`w-full p-4 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {loading ? 'Submitting Application...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderPersonalInfo();
      case 2: return renderAcademicDetails();
      case 3: return renderResumeUpload();
      case 4: return renderAcademicResults();
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

          {/* Navigation buttons - only show if not on last step */}
          {currentStep < totalSteps && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Previous button for last step */}
          {currentStep === totalSteps && (
            <div className="flex justify-start mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;